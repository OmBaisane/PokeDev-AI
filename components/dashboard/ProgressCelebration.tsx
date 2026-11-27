"use client";

import Image from "next/image";

import { POKEMON_EVOLUTION } from "@/lib/progression/config";
import type { ProgressCelebrationData } from "./useProgressCelebration";

type Props = {
  celebration: ProgressCelebrationData | null;
  onClose: () => void;
};

export default function ProgressCelebration({ celebration, onClose }: Props) {
  if (!celebration) return null;

  const stages = POKEMON_EVOLUTION[celebration.pokemonName].stages;

  const currentPokemon = stages.find(
    (stage) => stage.stage === celebration.evolutionStage,
  );

  const previousPokemon = stages.find(
    (stage) => stage.stage === celebration.previousEvolutionStage,
  );

  if (!currentPokemon) return null;

  const isEvolution = celebration.kind === "evolution";

  return (
    <div
      className="progress-celebration-backdrop fixed inset-0 z-100 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
      role="presentation"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="progress-celebration-title"
        className="progress-celebration-card relative w-full max-w-md overflow-hidden rounded-3xl border border-[#D6A84B]/30 bg-[#111113] p-7 text-center shadow-[0_25px_100px_rgba(0,0,0,0.65)] sm:p-9"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-[#D6A84B]/10 blur-3xl"
        />

        <div className="relative">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D6A84B]">
            {isEvolution ? "Evolution unlocked" : "Progression achieved"}
          </p>

          <h2
            id="progress-celebration-title"
            className="mt-3 text-3xl font-black tracking-tight text-[#F5F2E9] sm:text-4xl"
          >
            {isEvolution ? "EVOLUTION!" : "LEVEL UP!"}
          </h2>

          <div className="progress-celebration-pokemon relative mx-auto mt-5 flex h-52 w-52 items-center justify-center">
            <div
              aria-hidden="true"
              className="absolute inset-5 rounded-full bg-[#D6A84B]/10 blur-2xl"
            />

            <Image
              src={`/images/pokemon/${currentPokemon.name.toLowerCase()}.png`}
              alt={currentPokemon.name}
              width={190}
              height={190}
              priority
              className="relative h-44 w-44 object-contain drop-shadow-[0_12px_25px_rgba(214,168,75,0.18)]"
            />
          </div>

          {isEvolution ? (
            <>
              <p className="mt-2 text-sm text-white/45">
                {previousPokemon?.name ?? celebration.pokemonName}
                {" evolved into"}
              </p>

              <p className="mt-1 text-2xl font-extrabold text-[#E6BD69]">
                {currentPokemon.name}!
              </p>

              <p className="mt-3 text-sm text-white/50">
                Your companion has reached a new evolution stage.
              </p>
            </>
          ) : (
            <>
              <p className="mt-2 text-2xl font-extrabold text-[#E6BD69]">
                Level {celebration.level}
              </p>

              <p className="mt-3 text-sm text-white/50">
                {currentPokemon.name} is getting stronger. Keep training!
              </p>
            </>
          )}

          <div className="mt-7 flex items-center justify-center gap-3">
            <div className="rounded-xl border border-white/10 bg-white/4 px-4 py-3">
              <p className="text-[10px] uppercase tracking-wider text-white/35">
                Level
              </p>
              <p className="mt-1 text-lg font-bold text-white">
                {celebration.previousLevel}
                <span className="mx-2 text-[#D6A84B]">→</span>
                {celebration.level}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/4 px-4 py-3">
              <p className="text-[10px] uppercase tracking-wider text-white/35">
                Evolution
              </p>
              <p className="mt-1 text-lg font-bold text-white">
                {celebration.previousEvolutionStage}
                <span className="mx-2 text-[#D6A84B]">→</span>
                {celebration.evolutionStage}
              </p>
            </div>
          </div>

          <button
            type="button"
            autoFocus
            onClick={onClose}
            className="mt-8 w-full rounded-xl bg-[#D6A84B] px-5 py-3.5 text-sm font-extrabold text-[#17130B] transition hover:bg-[#E6BD69]"
          >
            Continue training
          </button>
        </div>
      </section>
    </div>
  );
}
