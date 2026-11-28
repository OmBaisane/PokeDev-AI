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
      { stage: 1, name: "Pyronix" },
      { stage: 2, name: "Cindervolt" },
      { stage: 3, name: "Solpyrax" },
    ],
  },

  Aquavex: {
    stages: [
      { stage: 1, name: "Aquavex" },
      { stage: 2, name: "Rivucrest" },
      { stage: 3, name: "Tiderion" },
    ],
  },

  Thornyx: {
    stages: [
      { stage: 1, name: "Thornyx" },
      { stage: 2, name: "Briarthorn" },
      { stage: 3, name: "Verdantyr" },
    ],
  },
} as const;

export const POKEMON_LEVEL_XP = 100;

export const POKEMON_EVOLUTION_LEVELS = {
  stage2: 1500,
  stage3: 3000,
} as const;

export type PokemonName = keyof typeof POKEMON_EVOLUTION;

export type ChallengeDifficulty = keyof typeof XP_REWARDS.challenge;

export type ProgressionSourceType = "analysis" | "challenge" | "milestone";

export function getPokemonProgression(xp: number) {
  const safeXp = Math.max(0, Math.floor(xp));
  const level = Math.floor(safeXp / POKEMON_LEVEL_XP) + 1;

  const evolutionStage =
    safeXp >= POKEMON_EVOLUTION_LEVELS.stage3
      ? 3
      : safeXp >= POKEMON_EVOLUTION_LEVELS.stage2
        ? 2
        : 1;

  return {
    xp: safeXp,
    level,
    evolutionStage,
  };
}
