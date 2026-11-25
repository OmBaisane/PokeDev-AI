import "server-only";

import { connectToDatabase } from "@/lib/db/mongoose";
import { DebugAnalysis } from "@/models/DebugAnalysis";
import {
  debugAnalysisRequestSchema,
  debugAnalysisResponseSchema,
} from "@/lib/ai/schemas";
import { z } from "zod";

type AnalysisInput = z.infer<typeof debugAnalysisRequestSchema>;
type AnalysisResult = z.infer<typeof debugAnalysisResponseSchema>;

type SaveAnalysisParams = {
  userId: string;
  input: AnalysisInput;
  result: AnalysisResult;
};

export async function saveAnalysis({
  userId,
  input,
  result,
}: SaveAnalysisParams) {
  await connectToDatabase();

  return DebugAnalysis.create({
    userId,
    language: input.language,
    snapshot: {
      code: input.code ?? "",
      errorMessage: input.errorMessage ?? "",
      additionalContext: input.additionalContext ?? "",
    },
    result,
  });
}
