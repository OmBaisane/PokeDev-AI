import { NextRequest, NextResponse } from "next/server";

import { analyzeCode } from "@/lib/ai/analyze";
import { saveAnalysis } from "@/lib/ai/save-analysis";
import { debugAnalysisRequestSchema } from "@/lib/ai/schemas";
import { getCurrentUser } from "@/lib/auth/dal";
import { aiRateLimits } from "@/lib/auth/rate-limit";

const MAX_BODY_SIZE = 64 * 1024;

function jsonError(message: string, status: number, headers?: HeadersInit) {
  return NextResponse.json({ error: message }, { status, headers });
}

export async function POST(request: NextRequest) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return jsonError("Content-Type must be application/json.", 415);
  }

  const contentLength = Number(request.headers.get("content-length"));

  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_SIZE) {
    return jsonError("Request body is too large.", 413);
  }

  let user;

  try {
    user = await getCurrentUser();
  } catch {
    return jsonError("Authentication service is temporarily unavailable.", 503);
  }

  if (!user) {
    return jsonError("Authentication required.", 401);
  }

  if (!user.emailVerifiedAt) {
    return jsonError("Please verify your email before using AI analysis.", 403);
  }

  let rawBody: string;

  try {
    rawBody = await request.text();
  } catch {
    return jsonError("Unable to read request body.", 400);
  }

  const bodySize = new TextEncoder().encode(rawBody).byteLength;

  if (bodySize > MAX_BODY_SIZE) {
    return jsonError("Request body is too large.", 413);
  }

  let parsedBody: unknown;

  try {
    parsedBody = JSON.parse(rawBody);
  } catch {
    return jsonError("Invalid JSON request body.", 400);
  }

  const validation = debugAnalysisRequestSchema.safeParse(parsedBody);

  if (!validation.success) {
    return NextResponse.json(
      {
        error: "Invalid analysis input.",
        details: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 },
    );
  }

  let rateLimitResult;

  try {
    rateLimitResult = await aiRateLimits.analyze.limit(user.id);
  } catch {
    return jsonError("AI service is temporarily unavailable.", 503);
  }

  if (!rateLimitResult.success) {
    const retryAfter = Math.max(
      1,
      Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
    );

    return jsonError("Rate limit reached. Please try again later.", 429, {
      "Retry-After": String(retryAfter),
    });
  }

  let result;

  try {
    result = await analyzeCode(validation.data);
  } catch (error) {
    const providerError =
      typeof error === "object" && error !== null
        ? (error as {
            name?: unknown;
            status?: unknown;
            code?: unknown;
            headers?: {
              get?: (name: string) => string | null;
            };
          })
        : {};

    const status =
      typeof providerError.status === "number"
        ? providerError.status
        : undefined;

    console.error("[AI analysis] Provider request failed:", {
      name:
        typeof providerError.name === "string"
          ? providerError.name
          : "UnknownError",
      status,
      code:
        typeof providerError.code === "string" ? providerError.code : undefined,
    });

    if (status === 429) {
      const retryAfterHeader = providerError.headers?.get?.("retry-after");

      const retryAfter =
        retryAfterHeader && /^\d+$/.test(retryAfterHeader)
          ? Math.max(1, Number(retryAfterHeader))
          : 30;

      return jsonError(
        "AI usage limit reached. Please wait before trying again.",
        429,
        { "Retry-After": String(retryAfter) },
      );
    }

    if (status === 401 || status === 403) {
      return jsonError(
        "AI service configuration error. Please try again later.",
        503,
      );
    }

    if (status !== undefined && status >= 500 && status <= 599) {
      return jsonError(
        "AI analysis is temporarily unavailable. Please try again shortly.",
        503,
        { "Retry-After": "30" },
      );
    }

    return jsonError(
      "AI analysis could not be completed. Please try again later.",
      502,
    );
  }

  let savedAnalysis;

  try {
    savedAnalysis = await saveAnalysis({
      userId: user.id,
      input: validation.data,
      result,
    });
  } catch {
    console.error("[AI analysis] Failed to save completed analysis.");

    return jsonError(
      "Analysis completed, but could not be saved. Please try again later.",
      503,
    );
  }

  return NextResponse.json({
    data: result,
    analysisId: savedAnalysis._id.toString(),
  });
}
