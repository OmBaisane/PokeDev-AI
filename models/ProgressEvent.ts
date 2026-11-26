import "server-only";

import { model, models, Schema } from "mongoose";

const ProgressEventSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sourceType: {
      type: String,
      enum: ["analysis", "challenge", "milestone"],
      required: true,
    },

    sourceId: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    xpAwarded: {
      type: Number,
      required: true,
      min: 1,
    },

    pokemonName: {
      type: String,
      enum: ["Pyronix", "Aquavex", "Thornyx", null],
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

ProgressEventSchema.index(
  {
    userId: 1,
    sourceType: 1,
    sourceId: 1,
  },
  {
    unique: true,
    name: "unique_user_progress_source",
  },
);

export const ProgressEvent =
  models.ProgressEvent || model("ProgressEvent", ProgressEventSchema);
