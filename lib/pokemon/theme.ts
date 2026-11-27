export type PokemonElementTheme = "gold" | "fire" | "water" | "grass";

const pokemonThemes: Record<string, PokemonElementTheme> = {
  Pyronix: "fire",
  Aquavex: "water",
  Thornyx: "grass",
};

export function getPokemonElementTheme(
  pokemon: string | null,
): PokemonElementTheme {
  if (!pokemon) return "gold";

  return pokemonThemes[pokemon] ?? "gold";
}
