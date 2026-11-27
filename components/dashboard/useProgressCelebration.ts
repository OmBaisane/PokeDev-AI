"use client";

import { useCallback, useState } from "react";

import type { PokemonName } from "@/lib/progression/config";

export type ProgressCelebrationData = {
  kind: "level-up" | "evolution";
  pokemonName: PokemonName;
  previousLevel: number;
  level: number;
  previousEvolutionStage: number;
  evolutionStage: number;
};

type ProgressionRewardPayload = {
  awarded?: boolean;
  correct?: boolean;
  success?: boolean;
  alreadyCompleted?: boolean;
  alreadyAwarded?: boolean;
  xpAwarded?: number;
  pokemonName?: string | null;
  previousLevel?: number;
  previousEvolutionStage?: number;
  level?: number;
  evolutionStage?: number;
};

function isPokemonName(value: unknown): value is PokemonName {
  return value === "Pyronix" || value === "Aquavex" || value === "Thornyx";
}

export function useProgressCelebration() {
  const [celebration, setCelebration] =
    useState<ProgressCelebrationData | null>(null);

  const showProgressCelebration = useCallback(
    (payload: ProgressionRewardPayload | null | undefined) => {
      if (!payload) return;

      const isNewReward =
        payload.awarded === true ||
        (payload.correct === true && payload.alreadyCompleted === false) ||
        (payload.success === true && payload.alreadyCompleted === false);

      if (
        !isNewReward ||
        payload.alreadyAwarded === true ||
        payload.alreadyCompleted === true ||
        typeof payload.xpAwarded !== "number" ||
        payload.xpAwarded <= 0 ||
        !isPokemonName(payload.pokemonName) ||
        typeof payload.previousLevel !== "number" ||
        typeof payload.previousEvolutionStage !== "number" ||
        typeof payload.level !== "number" ||
        typeof payload.evolutionStage !== "number"
      ) {
        return;
      }

      const evolved = payload.evolutionStage > payload.previousEvolutionStage;

      const levelledUp = payload.level > payload.previousLevel;

      if (!evolved && !levelledUp) return;

      setCelebration({
        kind: evolved ? "evolution" : "level-up",
        pokemonName: payload.pokemonName,
        previousLevel: payload.previousLevel,
        previousEvolutionStage: payload.previousEvolutionStage,
        level: payload.level,
        evolutionStage: payload.evolutionStage,
      });
    },
    [],
  );

  const dismissCelebration = useCallback(() => {
    setCelebration(null);
  }, []);

  return {
    celebration,
    showProgressCelebration,
    dismissCelebration,
  };
}
