import { z } from "zod";
import { NextResponse } from "next/server";

import { requireVerifiedUser } from "@/lib/auth/permissions";
import { challengeBank } from "@/lib/challenges/bank";
import { challengeRateLimits } from "@/lib/auth/rate-limit";
import { awardProgressionXp } from "@/lib/progression/reward-service";

const MAX_BODY_SIZE = 8 * 1024;

const submissionSchema = z.object({
  challengeId: z.string().min(1).max(100),
  answer: z.string().min(1).max(500),
});

function jsonError(message: string, status: number, headers?: HeadersInit) {
  return NextResponse.json({ error: message }, { status, headers });
}

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
    return jsonError("Unable to load challenges.", 401);
  }
}

export async function POST(request: Request) {
  let user;

  try {
    user = await requireVerifiedUser();
  } catch {
    return jsonError("Authentication required.", 401);
  }

  let rateLimitResult;

  try {
    rateLimitResult = await challengeRateLimits.submit.limit(user.id);
  } catch {
    return jsonError("Challenge service is temporarily unavailable.", 503);
  }

  if (!rateLimitResult.success) {
    const retryAfter = Math.max(
      1,
      Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
    );

    return jsonError("Too many submissions. Please try again later.", 429, {
      "Retry-After": String(retryAfter),
    });
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return jsonError("Content-Type must be application/json.", 415);
  }

  const contentLength = Number(request.headers.get("content-length"));

  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_SIZE) {
    return jsonError("Request body is too large.", 413);
  }

  try {
    const rawBody = await request.text();

    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_SIZE) {
      return jsonError("Request body is too large.", 413);
    }

    let body: unknown;

    try {
      body = JSON.parse(rawBody);
    } catch {
      return jsonError("Invalid JSON request body.", 400);
    }

    const parsed = submissionSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError("Invalid challenge submission.", 400);
    }

    const challenge = challengeBank.find(
      (item) => item.id === parsed.data.challengeId,
    );

    if (!challenge) {
      return jsonError("Challenge not found.", 404);
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
      previousLevel: reward.previousLevel,
      previousEvolutionStage: reward.previousEvolutionStage,
      explanation: challenge.explanation,
    });
  } catch (error) {
    console.error("Challenge submission failed:", error);

    return jsonError("Unable to process this challenge right now.", 500);
  }
}
