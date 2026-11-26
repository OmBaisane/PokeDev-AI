export const XP_REWARDS = {
  analysis: 10,

  challenge: {
    beginner: 25,
    intermediate: 50,
    advanced: 75,
  },

  milestone: 100,
} as const;

export const POKEMON_EVOLUTION = {
  Pyronix: {
    stages: [
      { stage: 1, name: "Pyronix", requiredXp: 0 },
      { stage: 2, name: "Cindervolt", requiredXp: 100 },
      { stage: 3, name: "Solpyrax", requiredXp: 300 },
    ],
  },

  Aquavex: {
    stages: [
      { stage: 1, name: "Aquavex", requiredXp: 0 },
      { stage: 2, name: "Rivucrest", requiredXp: 100 },
      { stage: 3, name: "Tiderion", requiredXp: 300 },
    ],
  },

  Thornyx: {
    stages: [
      { stage: 1, name: "Thornyx", requiredXp: 0 },
      { stage: 2, name: "Briarthorn", requiredXp: 100 },
      { stage: 3, name: "Verdantyr", requiredXp: 300 },
    ],
  },
} as const;

export const POKEMON_LEVEL_XP = 100;

export type PokemonName = keyof typeof POKEMON_EVOLUTION;

export type ChallengeDifficulty = keyof typeof XP_REWARDS.challenge;

export type ProgressionSourceType = "analysis" | "challenge" | "milestone";

export function getPokemonProgression(xp: number) {
  const level = Math.floor(xp / POKEMON_LEVEL_XP) + 1;

  const evolutionStage = xp >= 300 ? 3 : xp >= 100 ? 2 : 1;

  return {
    xp,
    level,
    evolutionStage,
  };
}
