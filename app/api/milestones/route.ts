import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentUser } from "@/lib/auth/dal";
import { connectToDatabase } from "@/lib/db/mongoose";
import { User } from "@/models/User";
import { ProgressEvent } from "@/models/ProgressEvent";
import { awardProgressionXp } from "@/lib/progression/reward-service";
import {
  LEARNING_MILESTONES,
  isMilestoneEligible,
} from "@/lib/progression/milestones";

const claimSchema = z.object({
  milestoneId: z.string().min(1).max(100),
});

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

async function getVerifiedUser() {
  const user = await getCurrentUser();

  if (!user) {
    return { error: jsonError("Authentication required.", 401) };
  }

  if (!user.emailVerifiedAt) {
    return {
      error: jsonError("Please verify your email first.", 403),
    };
  }

  return { user };
}

export async function GET() {
  try {
    const auth = await getVerifiedUser();

    if ("error" in auth) return auth.error;

    await connectToDatabase();

    const user = await User.findById(auth.user.id)
      .select("completedAnalyses completedChallenges completedMilestones")
      .lean();

    if (!user) {
      return jsonError("User not found.", 404);
    }

    const completedEvents = await ProgressEvent.find({
      userId: auth.user.id,
      sourceType: "milestone",
    })
      .select("sourceId")
      .lean();

    const completedIds = new Set(
      completedEvents.map((event) => event.sourceId),
    );

    const progress = {
      completedAnalyses: user.completedAnalyses ?? 0,
      completedChallenges: user.completedChallenges ?? 0,
    };

    const milestones = LEARNING_MILESTONES.map((milestone) => ({
      ...milestone,
      reward: 100,
      completed: completedIds.has(milestone.id),
      eligible: isMilestoneEligible(milestone, progress),
    }));

    return NextResponse.json({
      milestones,
      progress,
      completedMilestones: user.completedMilestones ?? 0,
    });
  } catch {
    return jsonError("Unable to load learning milestones.", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getVerifiedUser();

    if (auth.error) return auth.error;

    if (!request.headers.get("content-type")?.includes("application/json")) {
      return jsonError("Content-Type must be application/json.", 415);
    }

    const body = await request.json().catch(() => null);
    const validation = claimSchema.safeParse(body);

    if (!validation.success) {
      return jsonError("Invalid milestone request.", 400);
    }

    const milestone = LEARNING_MILESTONES.find(
      (item) => item.id === validation.data.milestoneId,
    );

    if (!milestone) {
      return jsonError("Milestone not found.", 404);
    }

    await connectToDatabase();

    const user = await User.findById(auth.user.id)
      .select("completedAnalyses completedChallenges")
      .lean();

    if (!user) {
      return jsonError("User not found.", 404);
    }

    const progress = {
      completedAnalyses: user.completedAnalyses ?? 0,
      completedChallenges: user.completedChallenges ?? 0,
    };

    if (!isMilestoneEligible(milestone, progress)) {
      return jsonError("Milestone requirements are not completed yet.", 403);
    }

    const result = await awardProgressionXp({
      userId: auth.user.id,
      sourceType: "milestone",
      sourceId: milestone.id,
    });

    if (!result.awarded) {
      return NextResponse.json({
        success: true,
        alreadyCompleted: true,
        milestoneId: milestone.id,
        xpAwarded: 0,
      });
    }

    return NextResponse.json({
      success: true,
      alreadyCompleted: false,
      milestoneId: milestone.id,
      xpAwarded: result.xpAwarded,
      totalXp: result.totalXp,
      pokemonName: result.pokemonName,
      pokemonXp: result.pokemonXp,
      level: result.level,
      evolutionStage: result.evolutionStage,
    });
  } catch {
    return jsonError("Unable to claim milestone reward.", 500);
  }
}
