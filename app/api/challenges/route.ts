import { NextResponse } from "next/server";
import { z } from "zod";

import { requireVerifiedUser } from "@/lib/auth/permissions";
import { challengeBank } from "@/lib/challenges/bank";
import { awardProgressionXp } from "@/lib/progression/reward-service";

const submissionSchema = z.object({
  challengeId: z.string().min(1).max(100),
  answer: z.string().min(1).max(500),
});

export async function GET() {
  try {
    await requireVerifiedUser();

    const challenges = challengeBank.map(
      ({ id, language, difficulty, title, type, prompt, code, options }) => ({
        id,
        language,
        difficulty,
        title,
        type,
        prompt,
        code,
        options,
      }),
    );

    return NextResponse.json({ challenges });
  } catch {
    return NextResponse.json(
      { error: "Unable to load challenges." },
      { status: 401 },
    );
  }
}

export async function POST(request: Request) {
  let user;

  try {
    user = await requireVerifiedUser();
  } catch {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  }

  try {
    const body: unknown = await request.json();
    const parsed = submissionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid challenge submission." },
        { status: 400 },
      );
    }

    const challenge = challengeBank.find(
      (item) => item.id === parsed.data.challengeId,
    );

    if (!challenge) {
      return NextResponse.json(
        { error: "Challenge not found." },
        { status: 404 },
      );
    }

    if (parsed.data.answer !== challenge.correctAnswer) {
      return NextResponse.json(
        {
          correct: false,
          error: "Not quite. Review the question and try again.",
        },
        { status: 400 },
      );
    }

    const reward = await awardProgressionXp({
      userId: user.id,
      sourceType: "challenge",
      sourceId: challenge.id,
      difficulty: challenge.difficulty,
    });

    if (!reward.awarded) {
      return NextResponse.json(
        {
          correct: true,
          alreadyCompleted: true,
          message: "This challenge has already been completed.",
          explanation: challenge.explanation,
        },
        { status: 409 },
      );
    }

    return NextResponse.json({
      correct: true,
      alreadyCompleted: false,
      xpAwarded: reward.xpAwarded,
      totalXp: reward.totalXp,
      pokemonName: reward.pokemonName,
      pokemonXp: reward.pokemonXp,
      level: reward.level,
      evolutionStage: reward.evolutionStage,
      explanation: challenge.explanation,
    });
  } catch (error) {
    console.error("Challenge submission failed:", error);

    return NextResponse.json(
      { error: "Unable to process this challenge right now." },
      { status: 500 },
    );
  }
}
