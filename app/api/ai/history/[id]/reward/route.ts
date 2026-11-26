import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { getCurrentUser } from "@/lib/auth/dal";
import { DebugAnalysis } from "@/models/DebugAnalysis";
import { awardProgressionXp } from "@/lib/progression/reward-service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  let user;

  try {
    user = await getCurrentUser();
  } catch {
    return NextResponse.json(
      { error: "Authentication service is temporarily unavailable." },
      { status: 503 },
    );
  }

  if (!user) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  }

  if (!user.emailVerifiedAt) {
    return NextResponse.json(
      { error: "Please verify your email first." },
      { status: 403 },
    );
  }

  try {
    const { id } = await context.params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Invalid analysis ID." },
        { status: 400 },
      );
    }

    const analysis = await DebugAnalysis.findOne({
      _id: id,
      userId: user.id,
    })
      .select("_id")
      .lean();

    if (!analysis) {
      return NextResponse.json(
        { error: "Analysis not found." },
        { status: 404 },
      );
    }

    const progression = await awardProgressionXp({
      userId: user.id,
      sourceType: "analysis",
      sourceId: analysis._id.toString(),
    });

    return NextResponse.json({
      success: true,
      alreadyAwarded: !progression.awarded,
      progression,
    });
  } catch (error) {
    console.error("[AI analysis] Progression retry failed:", error);

    return NextResponse.json(
      { error: "XP reward could not be processed. Please retry later." },
      { status: 503 },
    );
  }
}
