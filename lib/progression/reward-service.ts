import "server-only";

import mongoose from "mongoose";

import { User } from "@/models/User";
import { ProgressEvent } from "@/models/ProgressEvent";
import { connectToDatabase } from "@/lib/db/mongoose";

import {
  XP_REWARDS,
  getPokemonProgression,
  type ChallengeDifficulty,
} from "@/lib/progression/config";

type AwardProgressionXpInput =
  | {
      userId: string;
      sourceType: "analysis";
      sourceId: string;
    }
  | {
      userId: string;
      sourceType: "challenge";
      sourceId: string;
      difficulty: ChallengeDifficulty;
    }
  | {
      userId: string;
      sourceType: "milestone";
      sourceId: string;
    };

type AwardProgressionXpResult = {
  awarded: boolean;
  xpAwarded: number;
  totalXp?: number;
  pokemonName?: string | null;
  pokemonXp?: number;
  level?: number;
  evolutionStage?: number;
};

function getRewardAmount(input: AwardProgressionXpInput): number {
  switch (input.sourceType) {
    case "analysis":
      return XP_REWARDS.analysis;

    case "challenge":
      return XP_REWARDS.challenge[input.difficulty];

    case "milestone":
      return XP_REWARDS.milestone;
  }
}

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  );
}

export async function awardProgressionXp(
  input: AwardProgressionXpInput,
): Promise<AwardProgressionXpResult> {
  if (!mongoose.isValidObjectId(input.userId)) {
    throw new Error("Invalid user ID.");
  }

  const sourceId = input.sourceId.trim();

  if (!sourceId || sourceId.length > 150) {
    throw new Error("Invalid progression source ID.");
  }

  const xpAwarded = getRewardAmount(input);

  await connectToDatabase();
  await ProgressEvent.init();

  const session = await mongoose.startSession();

  let result: AwardProgressionXpResult | null = null;

  try {
    await session.withTransaction(async () => {
      const user = await User.findById(input.userId).session(session);

      if (!user) {
        throw new Error("User not found.");
      }

      if (!user.isActive || !user.emailVerifiedAt) {
        throw new Error("User is not eligible for progression rewards.");
      }

      const pokemonName = user.selectedPokemon ?? null;

      const event = new ProgressEvent({
        userId: user._id,
        sourceType: input.sourceType,
        sourceId,
        xpAwarded,
        pokemonName,
      });

      await event.save({ session });

      const update: Record<string, number> = {
        totalXp: xpAwarded,
      };

      if (input.sourceType === "analysis") {
        update.completedAnalyses = 1;
      }

      if (input.sourceType === "challenge") {
        update.completedChallenges = 1;
      }

      if (input.sourceType === "milestone") {
        update.completedMilestones = 1;
      }

      const updateQuery: Record<string, number> = {};

      for (const [key, value] of Object.entries(update)) {
        updateQuery[key] = value;
      }

      const increments: Record<string, number> = {
        totalXp: xpAwarded,
      };

      if (input.sourceType === "analysis") {
        increments.completedAnalyses = 1;
      }

      if (input.sourceType === "challenge") {
        increments.completedChallenges = 1;
      }

      if (input.sourceType === "milestone") {
        increments.completedMilestones = 1;
      }

      let pokemonResult: ReturnType<typeof getPokemonProgression> | null = null;

      if (pokemonName) {
        const currentPokemonXp = user.pokemonProgress?.[pokemonName]?.xp ?? 0;

        pokemonResult = getPokemonProgression(currentPokemonXp + xpAwarded);

        increments[`pokemonProgress.${pokemonName}.xp`] = xpAwarded;

        // Set derived progression values below.
      }

      const updateOperations: Record<string, unknown> = {
        $inc: increments,
      };

      if (pokemonName && pokemonResult) {
        updateOperations.$set = {
          [`pokemonProgress.${pokemonName}.level`]: pokemonResult.level,

          [`pokemonProgress.${pokemonName}.evolutionStage`]:
            pokemonResult.evolutionStage,
        };
      }

      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        updateOperations,
        {
          new: true,
          session,
          runValidators: true,
        },
      );

      if (!updatedUser) {
        throw new Error("Could not update user progression.");
      }

      result = {
        awarded: true,
        xpAwarded,
        totalXp: updatedUser.totalXp,
        pokemonName,
        ...(pokemonName && pokemonResult
          ? {
              pokemonXp: updatedUser.pokemonProgress[pokemonName].xp,
              level: pokemonResult.level,
              evolutionStage: pokemonResult.evolutionStage,
            }
          : {}),
      };
    });

    if (!result) {
      throw new Error("Progression reward could not be processed.");
    }

    return result;
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return {
        awarded: false,
        xpAwarded: 0,
      };
    }

    throw error;
  } finally {
    await session.endSession();
  }
}
