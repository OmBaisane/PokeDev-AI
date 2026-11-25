import { NextRequest, NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/db/mongoose";
import { getCurrentUser } from "@/lib/auth/dal";
import { DebugAnalysis } from "@/models/DebugAnalysis";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

async function getAuthorizedUser() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        user: null,
        response: jsonError("Authentication required.", 401),
      };
    }

    if (!user.emailVerifiedAt) {
      return {
        user: null,
        response: jsonError("Please verify your email first.", 403),
      };
    }

    return { user, response: null };
  } catch {
    return {
      user: null,
      response: jsonError(
        "Authentication service is temporarily unavailable.",
        503,
      ),
    };
  }
}

function isValidAnalysisId(id: string) {
  return /^[a-f\d]{24}$/i.test(id);
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { user, response } = await getAuthorizedUser();

  if (response || !user) {
    return response;
  }

  const { id } = await params;

  if (!isValidAnalysisId(id)) {
    return jsonError("Invalid analysis ID.", 400);
  }

  try {
    await connectToDatabase();

    const analysis = await DebugAnalysis.findOne({
      _id: id,
      userId: user.id,
    }).lean();

    if (!analysis) {
      return jsonError("Analysis not found.", 404);
    }

    return NextResponse.json({
      data: {
        id: analysis._id.toString(),
        language: analysis.language,
        snapshot: analysis.snapshot,
        result: analysis.result,
        createdAt: analysis.createdAt,
      },
    });
  } catch {
    console.error("[AI history] Failed to retrieve analysis details.");

    return jsonError("Unable to load analysis details. Please try again.", 503);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { user, response } = await getAuthorizedUser();

  if (response || !user) {
    return response;
  }

  const { id } = await params;

  if (!isValidAnalysisId(id)) {
    return jsonError("Invalid analysis ID.", 400);
  }

  try {
    await connectToDatabase();

    // Delete only when the analysis belongs to the authenticated user.
    const deletedAnalysis = await DebugAnalysis.findOneAndDelete({
      _id: id,
      userId: user.id,
    });

    if (!deletedAnalysis) {
      return jsonError("Analysis not found.", 404);
    }

    return NextResponse.json({
      message: "Analysis deleted successfully.",
    });
  } catch {
    console.error("[AI history] Failed to delete analysis.");

    return jsonError("Unable to delete analysis. Please try again.", 503);
  }
}
