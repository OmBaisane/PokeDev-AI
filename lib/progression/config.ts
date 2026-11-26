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
      { stage: 2, name: "Cindervolt", requiredXp: 250 },
      { stage: 3, name: "Solpyrax", requiredXp: 700 },
    ],
  },

  Aquavex: {
    stages: [
      { stage: 1, name: "Aquavex", requiredXp: 0 },
      { stage: 2, name: "Rivucrest", requiredXp: 250 },
      { stage: 3, name: "Tiderion", requiredXp: 700 },
    ],
  },

  Thornyx: {
    stages: [
      { stage: 1, name: "Thornyx", requiredXp: 0 },
      { stage: 2, name: "Briarthorn", requiredXp: 250 },
      { stage: 3, name: "Verdantyr", requiredXp: 700 },
    ],
  },
} as const;

export const POKEMON_LEVEL_XP = 100;

export type PokemonName = keyof typeof POKEMON_EVOLUTION;

export type ChallengeDifficulty = keyof typeof XP_REWARDS.challenge;

export type ProgressionSourceType = "analysis" | "challenge" | "milestone";

export function getPokemonProgression(xp: number) {
  const level = Math.floor(xp / POKEMON_LEVEL_XP) + 1;

  const stages = POKEMON_EVOLUTION.Pyronix.stages;

  const currentStage = [...stages]
    .reverse()
    .find((stage) => xp >= stage.requiredXp);

  return {
    xp,
    level,
    evolutionStage: currentStage?.stage ?? 1,
  };
}
