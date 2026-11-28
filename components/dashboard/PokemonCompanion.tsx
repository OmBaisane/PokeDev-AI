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

const idleImages: Record<string, string> = {
  Pyronix: "/images/pokemon/idle/pyronix.gif",
  Cindervolt: "/images/pokemon/idle/cindervolt.gif",
  Solpyrax: "/images/pokemon/idle/solpyrax.gif",
  Aquavex: "/images/pokemon/idle/aquavex.gif",
  Rivucrest: "/images/pokemon/idle/rivucrest.gif",
  Tiderion: "/images/pokemon/idle/tiderion.gif",
  Thornyx: "/images/pokemon/idle/thornyx.gif",
  Briarthorn: "/images/pokemon/idle/briarthorn.gif",
  Verdantyr: "/images/pokemon/idle/verdantyr.gif",
};

export default function PokemonCompanion({
  pokemon,
  stage,
}: PokemonCompanionProps) {
  const stages = POKEMON_EVOLUTION[pokemon].stages;
  const safeStage = Math.min(3, Math.max(1, stage));
  const currentEvolution = stages[safeStage - 1];

  const staticImage = evolutionImages[pokemon][safeStage - 1];
  const idleImage = idleImages[currentEvolution.name] ?? staticImage;
  const isAnimated = idleImage.endsWith(".gif");

  return (
    <div className="mt-7 flex flex-col items-center gap-5 rounded-2xl border border-white/[0.07] bg-black/15 p-5 sm:flex-row sm:p-6">
      <div className="pokemon-companion-stage relative flex h-48 w-48 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0B0B0D] sm:h-52 sm:w-52">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full bg-[#D6A84B]/6 blur-2xl"
        />

        <picture className="absolute inset-0">
          <source
            media="(prefers-reduced-motion: reduce)"
            srcSet={staticImage}
          />

          <Image
            key={idleImage}
            src={idleImage}
            alt={`${currentEvolution.name}, evolution stage ${safeStage}`}
            fill
            sizes="208px"
            priority
            unoptimized={isAnimated}
            className={`object-contain p-1 ${
              isAnimated ? "" : "pokemon-companion-image"
            }`}
          />
        </picture>
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
