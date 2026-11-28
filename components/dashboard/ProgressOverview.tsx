import { POKEMON_EVOLUTION } from "@/lib/progression/config";
import PokemonCompanion from "@/components/dashboard/PokemonCompanion";

type PokemonName = keyof typeof POKEMON_EVOLUTION;

type PokemonProgress = {
  xp: number;
  level: number;
  evolutionStage: number;
};

type ProgressOverviewProps = {
  totalXp: number;
  completedAnalyses: number;
  completedChallenges: number;
  completedMilestones: number;
  selectedPokemon: PokemonName | null;
  selectedPokemonProgress: PokemonProgress | null;
};

function StatCard({
  label,
  value,
  description,
  symbol,
}: {
  label: string;
  value: string | number;
  description: string;
  symbol: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#111113] p-5 transition-colors duration-200 hover:border-[#D6A84B]/20 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-white/45">{label}</p>
        <span aria-hidden="true" className="text-lg text-[#E6BD69]">
          {symbol}
        </span>
      </div>

      <p className="mt-4 text-2xl font-bold tracking-tight text-white tabular-nums sm:text-3xl">
        {value.toLocaleString()}
      </p>

      <p className="mt-1 text-xs leading-5 text-white/35">{description}</p>
    </div>
  );
}

function ProgressBar({ value, label }: { value: number; label: string }) {
  const percentage = Math.min(100, Math.max(0, value));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-xs">
        <span className="min-w-0 text-white/45">{label}</span>

        <span className="shrink-0 font-semibold tabular-nums text-[#E6BD69]">
          {Math.round(percentage)}%
        </span>
      </div>

      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percentage)}
        className="relative h-3 w-full overflow-hidden rounded-full border border-white/10 bg-white/10"
      >
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{
            width: `${percentage}%`,
            background:
              "linear-gradient(to right, var(--element-accent, #D6A84B), var(--element-highlight, #E6BD69))",
            boxShadow: "0 0 12px var(--element-accent, #D6A84B)",
          }}
        />
      </div>
    </div>
  );
}

export default function ProgressOverview({
  totalXp,
  completedAnalyses,
  completedChallenges,
  completedMilestones,
  selectedPokemon,
  selectedPokemonProgress,
}: ProgressOverviewProps) {
  const pokemon = selectedPokemonProgress;

  const evolutionStages = selectedPokemon
    ? POKEMON_EVOLUTION[selectedPokemon].stages
    : [];

  const pokemonXp = pokemon?.xp ?? 0;
  const pokemonLevel = pokemon?.level ?? 1;

  const evolutionStage =
    evolutionStages.findLast((stage) => pokemonXp >= stage.requiredXp)?.stage ??
    1;

  const currentStage = evolutionStages[evolutionStage - 1];
  const nextStage = evolutionStages[evolutionStage];

  const currentThreshold = currentStage?.requiredXp ?? 0;
  const nextThreshold = nextStage?.requiredXp ?? null;

  const evolutionPercentage =
    nextThreshold === null
      ? 100
      : Math.min(
          100,
          Math.max(
            0,
            ((pokemonXp - currentThreshold) /
              (nextThreshold - currentThreshold)) *
              100,
          ),
        );

  const levelPercentage = pokemonXp % 100;

  return (
    <section className="mt-12 sm:mt-16">
      <div className="mb-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D6A84B]">
          Your journey
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Progress Overview
        </h2>

        <p className="mt-2 text-sm leading-6 text-white/40">
          Every analysis, challenge and milestone takes you one step further.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Experience"
          value={totalXp}
          description="Account-wide earned XP"
          symbol="✦"
        />

        <StatCard
          label="AI Analyses"
          value={completedAnalyses}
          description="Completed debugging sessions"
          symbol="⌘"
        />

        <StatCard
          label="Challenges"
          value={completedChallenges}
          description="Coding challenges solved"
          symbol="⚡"
        />

        <StatCard
          label="Milestones"
          value={completedMilestones}
          description="Learning achievements earned"
          symbol="◆"
        />
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-[#D6A84B]/20 bg-linear-to-br from-[#1B1811] via-[#131210] to-[#111113] p-5 sm:p-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#D6A84B]">
              Companion progression
            </p>

            <h3 className="mt-2 text-xl font-bold text-white sm:text-2xl">
              {selectedPokemon ?? "No companion selected"}
            </h3>

            <p className="mt-2 max-w-lg text-sm leading-6 text-white/45">
              {selectedPokemon
                ? "Keep learning and earning XP together with your companion."
                : "Choose your Pokémon companion to begin your progression journey."}
            </p>
          </div>

          {selectedPokemon && pokemon && (
            <div className="grid grid-cols-3 gap-3 sm:flex sm:gap-8">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/35">
                  Level
                </p>

                <p className="mt-1 text-2xl font-bold tabular-nums text-[#E6BD69] sm:text-3xl">
                  {pokemonLevel}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/35">
                  Pokémon XP
                </p>

                <p className="mt-1 text-2xl font-bold tabular-nums text-white sm:text-3xl">
                  {pokemonXp.toLocaleString()}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/35">
                  Evolution
                </p>

                <p className="mt-1 text-2xl font-bold tabular-nums text-white sm:text-3xl">
                  {evolutionStage}/3
                </p>
              </div>
            </div>
          )}
        </div>

        {selectedPokemon && pokemon && (
          <>
            <PokemonCompanion
              pokemon={selectedPokemon}
              stage={evolutionStage}
            />

            <div className="mt-7 grid gap-6 sm:grid-cols-2 sm:gap-5">
              <ProgressBar
                value={levelPercentage}
                label={`Level ${pokemonLevel} progress · ${100 - levelPercentage} XP to next level`}
              />

              <ProgressBar
                value={evolutionPercentage}
                label={
                  nextThreshold === null
                    ? "Final evolution achieved"
                    : `Evolution progress · ${nextThreshold - pokemonXp} XP remaining`
                }
              />
            </div>
          </>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-5">
          <p className="text-xs leading-5 text-white/35">
            {selectedPokemon && pokemon
              ? `Stage ${evolutionStage} companion · ${pokemonXp.toLocaleString()} individual XP earned`
              : "Your companion's progress will appear here."}
          </p>

          <span className="shrink-0 rounded-full border border-[#D6A84B]/20 bg-[#D6A84B]/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#E6BD69]">
            {selectedPokemon ? "Training active" : "Awaiting companion"}
          </span>
        </div>
      </div>
    </section>
  );
}
