import Image from "next/image";

import { POKEMON_EVOLUTION, type PokemonName } from "@/lib/progression/config";

interface PokemonCompanionProps {
  pokemon: PokemonName;
  stage: number;
}

const evolutionImages: Record<PokemonName, readonly [string, string, string]> =
  {
    Pyronix: [
      "/images/pokemon/pyronix.png",
      "/images/pokemon/cindervolt.png",
      "/images/pokemon/solpyrax.png",
    ],
    Aquavex: [
      "/images/pokemon/aquavex.png",
      "/images/pokemon/rivucrest.png",
      "/images/pokemon/tiderion.png",
    ],
    Thornyx: [
      "/images/pokemon/thornyx.png",
      "/images/pokemon/briarthorn.png",
      "/images/pokemon/verdantyr.png",
    ],
  };

export default function PokemonCompanion({
  pokemon,
  stage,
}: PokemonCompanionProps) {
  const stages = POKEMON_EVOLUTION[pokemon].stages;
  const safeStage = Math.min(3, Math.max(1, stage));
  const currentEvolution = stages[safeStage - 1];

  const image = evolutionImages[pokemon][safeStage - 1];

  return (
    <div className="mt-7 flex flex-col items-center gap-5 rounded-2xl border border-white/[0.07] bg-black/15 p-5 sm:flex-row sm:p-6">
      <div className="pokemon-companion-stage relative flex h-40 w-40 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0B0B0D] sm:h-44 sm:w-44">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full bg-[#D6A84B]/6 blur-2xl"
        />

        <Image
          key={image}
          src={image}
          alt={`${currentEvolution.name}, evolution stage ${safeStage}`}
          fill
          sizes="176px"
          priority
          className="pokemon-companion-image object-contain p-3"
        />
      </div>

      <div className="min-w-0 flex-1 text-center sm:text-left">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D6A84B]">
          Your active companion
        </p>

        <h4 className="mt-2 text-2xl font-bold tracking-tight text-white">
          {currentEvolution.name}
        </h4>

        <p className="mt-2 text-sm text-white/45">
          {pokemon} evolution line · Stage {safeStage} of 3
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
          {stages.map((evolution) => (
            <span
              key={evolution.stage}
              className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold transition ${
                evolution.stage === safeStage
                  ? "border-[#D6A84B]/35 bg-[#D6A84B]/10 text-[#E6BD69]"
                  : evolution.stage < safeStage
                    ? "border-white/10 bg-white/4 text-white/50"
                    : "border-white/6 bg-transparent text-white/25"
              }`}
            >
              {evolution.name}
            </span>
          ))}
        </div>

        <p className="mt-4 text-xs leading-5 text-white/30">
          Keep earning XP to unlock your companion&apos;s next evolution.
        </p>
      </div>
    </div>
  );
}
