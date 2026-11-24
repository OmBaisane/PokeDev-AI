"use client";

import Image from "next/image";
import { useState, useTransition } from "react";

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
  border: string;
  glow: string;
}[] = [
  {
    name: "Pyronix",
    type: "Fire",
    image: "/images/pokemon/pyronix.png",
    description: "A passionate companion with blazing potential.",
    border: "border-orange-500/30",
    glow: "from-orange-500/15",
  },
  {
    name: "Aquavex",
    type: "Water",
    image: "/images/pokemon/aquavex.png",
    description: "A calm companion with powerful adaptability.",
    border: "border-cyan-500/30",
    glow: "from-cyan-500/15",
  },
  {
    name: "Thornyx",
    type: "Grass",
    image: "/images/pokemon/thornyx.png",
    description: "A resilient companion with nature's strength.",
    border: "border-green-500/30",
    glow: "from-green-500/15",
  },
];

export default function PokemonSelector({
  selectedPokemon: initialSelection,
}: PokemonSelectorProps) {
  const [selectedPokemon, setSelectedPokemon] = useState<string | null>(
    initialSelection,
  );

  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSelection(name: PokemonName) {
    if (selectedPokemon || isPending) {
      return;
    }

    setMessage("");

    startTransition(async () => {
      try {
        const result = await selectPokemonAction(name);

        setMessage(result.message);

        if (result.success) {
          setSelectedPokemon(name);
        }
      } catch {
        setMessage("Something went wrong. Please try again.");
      }
    });
  }

  return (
    <section className="mt-14">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-400">
            Choose your companion
          </p>

          <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
            {selectedPokemon ? "Your Pokémon" : "Choose your first Pokémon"}
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {selectedPokemon
              ? "Your adventure begins with your chosen companion."
              : "Three elemental starters. One companion. Your journey."}
          </p>
        </div>

        <span className="text-xs text-gray-500">
          {selectedPokemon ? "Starter selected" : "3 Starters Available"}
        </span>
      </div>

      <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {starters.map((pokemon) => {
          const isSelected = selectedPokemon === pokemon.name;

          return (
            <article
              key={pokemon.name}
              className={`relative overflow-hidden rounded-2xl border bg-linear-to-br ${pokemon.glow} to-[#101522] p-4 transition duration-300 ${
                isSelected
                  ? `${pokemon.border} ring-2 ring-blue-400/50`
                  : "border-white/10"
              }`}
            >
              {isSelected && (
                <span className="absolute right-4 top-4 z-10 rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-300">
                  Your companion
                </span>
              )}

              <div className="relative aspect-square overflow-hidden rounded-xl bg-black/20">
                <Image
                  src={pokemon.image}
                  alt={pokemon.name}
                  fill
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                  className="object-contain p-3"
                />
              </div>

              <div className="px-1 pb-1 pt-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">{pokemon.name}</h3>

                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
                    {pokemon.type} Type
                  </span>
                </div>

                <p className="mt-3 min-h-10 text-sm leading-5 text-gray-400">
                  {pokemon.description}
                </p>

                <button
                  type="button"
                  onClick={() => handleSelection(pokemon.name)}
                  disabled={Boolean(selectedPokemon) || isPending}
                  aria-pressed={isSelected}
                  className={`mt-5 w-full rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isSelected
                      ? "cursor-default border border-blue-400/30 bg-blue-400/10 text-blue-300"
                      : selectedPokemon
                        ? "cursor-not-allowed border border-white/5 bg-white/5 text-gray-600"
                        : "bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50"
                  }`}
                >
                  {isPending && !selectedPokemon
                    ? "Selecting..."
                    : isSelected
                      ? "Selected"
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
          className="mt-5 text-sm text-blue-300"
        >
          {message}
        </p>
      )}

      {!selectedPokemon && (
        <p className="mt-5 text-center text-xs leading-6 text-gray-500">
          Choose carefully! Your starter will remain your companion throughout
          your training journey.
        </p>
      )}
    </section>
  );
}
