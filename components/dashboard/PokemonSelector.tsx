"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { selectPokemonAction } from "@/app/actions/pokemon";

type PokemonName = "Pyronix" | "Aquavex" | "Thornyx";

interface PokemonSelectorProps {
  selectedPokemon: string | null;
}

const starters: {
  name: PokemonName;
  type: string;
  image: string;
  description: string;
  accent: string;
  border: string;
  glow: string;
}[] = [
  {
    name: "Pyronix",
    type: "Fire",
    image: "/images/pokemon/pyronix.png",
    description: "A passionate companion with blazing potential.",
    accent: "text-orange-300",
    border: "border-orange-400/25",
    glow: "bg-orange-400/8",
  },
  {
    name: "Aquavex",
    type: "Water",
    image: "/images/pokemon/aquavex.png",
    description: "A calm companion with powerful adaptability.",
    accent: "text-sky-300",
    border: "border-sky-400/25",
    glow: "bg-sky-400/8",
  },
  {
    name: "Thornyx",
    type: "Grass",
    image: "/images/pokemon/thornyx.png",
    description: "A resilient companion with nature's strength.",
    accent: "text-emerald-300",
    border: "border-emerald-400/25",
    glow: "bg-emerald-400/8",
  },
];

export default function PokemonSelector({
  selectedPokemon: initialSelection,
}: PokemonSelectorProps) {
  const router = useRouter();

  const [selectedPokemon, setSelectedPokemon] = useState<string | null>(
    initialSelection,
  );
  const [pendingPokemon, setPendingPokemon] = useState<PokemonName | null>(
    null,
  );
  const [message, setMessage] = useState("");

  const [isPending, startTransition] = useTransition();

  function handleSelection(name: PokemonName) {
    if (selectedPokemon || isPending) {
      return;
    }

    setMessage("");
    setPendingPokemon(name);

    startTransition(async () => {
      try {
        const result = await selectPokemonAction(name);

        setMessage(result.message);

        if (result.success) {
          setSelectedPokemon(name);
          router.refresh();
        }
      } catch {
        setMessage("Something went wrong. Please try again.");
      } finally {
        setPendingPokemon(null);
      }
    });
  }

  return (
    <section className="mt-16" aria-labelledby="starter-heading">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D6A84B]">
            Choose your companion
          </p>

          <h2
            id="starter-heading"
            className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl"
          >
            {selectedPokemon
              ? "Meet your companion."
              : "Choose your first companion."}
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
            {selectedPokemon
              ? "Your adventure begins with your chosen companion. Keep learning and growing together."
              : "Three elemental starters. Three unique personalities. Choose the one that will join your developer journey."}
          </p>
        </div>

        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3.5 py-2 text-xs font-semibold text-white/55">
          <span className="h-1.5 w-1.5 rounded-full bg-[#D6A84B]" />
          {selectedPokemon ? "Starter selected" : "3 starters available"}
        </span>
      </div>

      <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {starters.map((pokemon) => {
          const isSelected = selectedPokemon === pokemon.name;
          const isBeingSelected = pendingPokemon === pokemon.name;

          return (
            <article
              key={pokemon.name}
              className={`group relative overflow-hidden rounded-[1.65rem] border bg-[#111113] p-4 transition duration-300 sm:p-5 ${
                isSelected
                  ? "border-[#D6A84B]/50 shadow-[0_0_35px_rgba(214,168,75,0.07)]"
                  : "border-white/8 hover:-translate-y-1 hover:border-white/20"
              }`}
            >
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full blur-[75px] ${pokemon.glow}`}
              />

              {isSelected && (
                <span className="absolute right-5 top-5 z-10 rounded-full border border-[#D6A84B]/25 bg-[#D6A84B]/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-[#E6BD69]">
                  Your companion
                </span>
              )}

              <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-white/5 bg-[#0B0B0D]">
                <Image
                  src={pokemon.image}
                  alt={`${pokemon.name}, ${pokemon.type}-type starter companion`}
                  fill
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                  className="object-contain p-3 transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="relative px-1 pb-1 pt-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xl font-bold tracking-tight text-[#F5F2E9]">
                    {pokemon.name}
                  </h3>

                  <span
                    className={`rounded-full border ${pokemon.border} bg-white/2.5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${pokemon.accent}`}
                  >
                    {pokemon.type} Type
                  </span>
                </div>

                <p className="mt-3 min-h-10 text-sm leading-6 text-white/40">
                  {pokemon.description}
                </p>

                <button
                  type="button"
                  onClick={() => handleSelection(pokemon.name)}
                  disabled={Boolean(selectedPokemon) || isPending}
                  aria-pressed={isSelected}
                  aria-busy={isBeingSelected}
                  className={`mt-5 w-full rounded-xl px-4 py-3.5 text-xs font-bold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6BD69] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111113] active:scale-[0.99] ${
                    isSelected
                      ? "cursor-default border border-[#D6A84B]/30 bg-[#D6A84B]/8 text-[#E6BD69]"
                      : selectedPokemon
                        ? "cursor-not-allowed border border-white/5 bg-white/2.5 text-white/20"
                        : "bg-[#D6A84B] text-[#17130B] hover:bg-[#E6BD69] disabled:cursor-not-allowed disabled:opacity-50"
                  }`}
                >
                  {isBeingSelected
                    ? "Selecting..."
                    : isPending
                      ? "Please wait..."
                      : isSelected
                        ? "✓ Your selected companion"
                        : selectedPokemon
                          ? "Unavailable"
                          : `Choose ${pokemon.name}`}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {message && (
        <p
          role="status"
          aria-live="polite"
          className="mt-5 rounded-xl border border-[#D6A84B]/15 bg-[#D6A84B]/5 px-4 py-3 text-sm text-[#E6BD69]"
        >
          {message}
        </p>
      )}

      {!selectedPokemon && (
        <p className="mt-5 text-center text-xs leading-6 text-white/30">
          Choose carefully! Your starter will remain your companion throughout
          your training journey.
        </p>
      )}
    </section>
  );
}
