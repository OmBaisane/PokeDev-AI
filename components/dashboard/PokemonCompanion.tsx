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
    <div className="relative mt-7 overflow-hidden rounded-3xl border border-[#D6A84B]/15 bg-linear-to-br from-[#19160F] via-[#111113] to-[#0B0B0D] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.25)] sm:p-7">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-[#D6A84B]/7 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-(--element-accent,#D6A84B)/[0.07] blur-3xl"
      />

      <div className="relative flex flex-col items-center gap-6 sm:gap-8 md:flex-row">
        <div className="relative w-full max-w-65 shrink-0">
          <div className="absolute inset-3 rounded-full bg-(--element-accent,#D6A84B)/10 blur-2xl" />

          <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-4xl border border-white/8 bg-[#0B0B0D]/75 shadow-inner">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/[0.035] via-transparent to-black/20"
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
                sizes="(max-width: 640px) 260px, 260px"
                priority
                unoptimized={isAnimated}
                className="object-contain p-0"
              />
            </picture>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-black/35 to-transparent" />

            <span className="absolute bottom-3 left-3 rounded-full border border-white/10 bg-black/65 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-white/65 backdrop-blur-md">
              Stage {safeStage}
            </span>

            <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-[#D6A84B]/20 bg-black/60 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider text-[#E6BD69] backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D6A84B] shadow-[0_0_8px_#D6A84B]" />
              Active
            </span>
          </div>
        </div>

        <div className="relative min-w-0 flex-1 text-center md:text-left">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#D6A84B]">
            Your active companion
          </p>

          <h4 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {currentEvolution.name}
          </h4>

          <p className="mt-2 text-sm text-white/45">{pokemon} evolution line</p>

          <div className="mt-6">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
              Evolution journey
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
              {stages.map((evolution, index) => (
                <div key={evolution.stage} className="flex items-center gap-2">
                  <span
                    className={`rounded-xl border px-3 py-2 text-[10px] font-semibold transition-colors ${
                      evolution.stage === safeStage
                        ? "border-[#D6A84B]/40 bg-[#D6A84B]/10 text-[#E6BD69] shadow-[0_0_18px_rgba(214,168,75,0.08)]"
                        : evolution.stage < safeStage
                          ? "border-white/10 bg-white/5 text-white/55"
                          : "border-white/6 bg-black/20 text-white/25"
                    }`}
                  >
                    {evolution.name}
                  </span>

                  {index < stages.length - 1 && (
                    <span aria-hidden="true" className="text-xs text-white/20">
                      →
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 border-t border-white/7 pt-5">
            <p className="text-xs leading-6 text-white/40">
              Keep learning, completing challenges and earning XP together. Your
              companion grows stronger with every achievement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
