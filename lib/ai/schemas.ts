import { z } from "zod";

export const supportedLanguages = [
  "javascript",
  "typescript",
  "python",
] as const;

export const debugAnalysisRequestSchema = z
  .object({
    language: z.enum(supportedLanguages),
    code: z.string().trim().max(20_000).optional(),
    errorMessage: z.string().trim().max(5_000).optional(),
    additionalContext: z.string().trim().max(5_000).optional(),
  })
  .strict()
  .refine(
    (data) => Boolean(data.code || data.errorMessage || data.additionalContext),
    {
      message: "Provide code, an error message, or additional context.",
    },
  );

export const debugAnalysisResponseSchema = z
  .object({
    summary: z.string().min(1),
    likelyCause: z.string().min(1),
    evidence: z.array(z.string()).min(1),
    suggestedFix: z.string().min(1),
    verificationSteps: z.array(z.string()).min(1),
    limitations: z.string().min(1),
    confidence: z.enum(["low", "medium", "high"]),
  })
  .strict();

export type DebugAnalysisRequest = z.infer<typeof debugAnalysisRequestSchema>;

export type DebugAnalysisResponse = z.infer<typeof debugAnalysisResponseSchema>;
