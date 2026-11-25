import "server-only";

import { model, models, Schema } from "mongoose";

const AnalysisResultSchema = new Schema(
  {
    summary: {
      type: String,
      required: true,
    },

    likelyCause: {
      type: String,
      required: true,
    },

    evidence: {
      type: [String],
      required: true,
    },

    suggestedFix: {
      type: String,
      required: true,
    },

    verificationSteps: {
      type: [String],
      required: true,
    },

    limitations: {
      type: String,
      required: true,
    },

    confidence: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
    },
  },
  {
    _id: false,
    versionKey: false,
  },
);

const DebugAnalysisSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    language: {
      type: String,
      enum: ["javascript", "typescript", "python"],
      required: true,
    },

    snapshot: {
      code: {
        type: String,
        default: "",
        maxlength: 20_000,
      },

      errorMessage: {
        type: String,
        default: "",
        maxlength: 5_000,
      },

      additionalContext: {
        type: String,
        default: "",
        maxlength: 5_000,
      },
    },

    result: {
      type: AnalysisResultSchema,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

DebugAnalysisSchema.index({ userId: 1, createdAt: -1 });

export const DebugAnalysis =
  models.DebugAnalysis || model("DebugAnalysis", DebugAnalysisSchema);
