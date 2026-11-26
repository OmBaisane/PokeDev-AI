import "server-only";

import { model, models, Schema } from "mongoose";

const PokemonProgressSchema = new Schema(
  {
    xp: {
      type: Number,
      default: 0,
      min: 0,
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
    },
    evolutionStage: {
      type: Number,
      default: 1,
      min: 1,
      max: 3,
    },
  },
  { _id: false },
);

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 60,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    emailVerifiedAt: {
      type: Date,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    selectedPokemon: {
      type: String,
      enum: ["Pyronix", "Aquavex", "Thornyx"],
      default: null,
    },

    // Account-wide progression
    totalXp: {
      type: Number,
      default: 0,
      min: 0,
    },

    completedAnalyses: {
      type: Number,
      default: 0,
      min: 0,
    },

    completedChallenges: {
      type: Number,
      default: 0,
      min: 0,
    },

    completedMilestones: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Individual Pokémon progression
    pokemonProgress: {
      Pyronix: {
        type: PokemonProgressSchema,
        default: () => ({}),
      },
      Aquavex: {
        type: PokemonProgressSchema,
        default: () => ({}),
      },
      Thornyx: {
        type: PokemonProgressSchema,
        default: () => ({}),
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const User = models.User || model("User", UserSchema);
