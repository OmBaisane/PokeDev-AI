import { NextRequest, NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/db/mongoose";
import { getCurrentUser } from "@/lib/auth/dal";
import { DebugAnalysis } from "@/models/DebugAnalysis";

const PAGE_SIZE = 10;

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(request: NextRequest) {
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
    return jsonError("Please verify your email first.", 403);
  }

  const pageParam = request.nextUrl.searchParams.get("page") ?? "1";

  if (!/^[1-9]\d*$/.test(pageParam)) {
    return jsonError("Invalid page number.", 400);
  }

  const page = Number(pageParam);

  if (!Number.isSafeInteger(page)) {
    return jsonError("Invalid page number.", 400);
  }

  const offset = (page - 1) * PAGE_SIZE;

  if (!Number.isSafeInteger(offset)) {
    return jsonError("Invalid page number.", 400);
  }

  try {
    await connectToDatabase();

    const filter = { userId: user.id };
    const total = await DebugAnalysis.countDocuments(filter);
    const totalPages = Math.ceil(total / PAGE_SIZE);

    // Avoid expensive database skips for out-of-range pages.
    if (page > totalPages) {
      return NextResponse.json({
        data: {
          items: [],
          pagination: {
            page,
            pageSize: PAGE_SIZE,
            total,
            totalPages,
          },
        },
      });
    }

    const analyses = await DebugAnalysis.find(filter)
      .select("language result.summary result.confidence createdAt")
      .sort({ createdAt: -1, _id: -1 })
      .skip(offset)
      .limit(PAGE_SIZE)
      .lean();

    const items = analyses.map((analysis) => ({
      id: analysis._id.toString(),
      language: analysis.language,
      summary: analysis.result.summary,
      confidence: analysis.result.confidence,
      createdAt: analysis.createdAt,
    }));

    return NextResponse.json({
      data: {
        items,
        pagination: {
          page,
          pageSize: PAGE_SIZE,
          total,
          totalPages,
        },
      },
    });
  } catch {
    console.error("[AI history] Failed to retrieve analysis history.");

    return jsonError("Unable to load analysis history. Please try again.", 503);
  }
}
