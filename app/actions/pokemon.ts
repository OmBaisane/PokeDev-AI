"use server";

import { z } from "zod";

import { requireVerifiedUser } from "@/lib/auth/permissions";
import { connectToDatabase } from "@/lib/db/mongoose";
import { User } from "@/models/User";

const pokemonSchema = z.enum(["Pyronix", "Aquavex", "Thornyx"]);

export async function selectPokemonAction(pokemon: unknown) {
  const parsedPokemon = pokemonSchema.safeParse(pokemon);

  if (!parsedPokemon.success) {
    return {
      success: false,
      message: "Invalid Pokémon selection.",
    };
  }

  const user = await requireVerifiedUser();

  await connectToDatabase();

  const updatedUser = await User.findOneAndUpdate(
    {
      _id: user.id,
      selectedPokemon: null,
    },
    {
      $set: {
        selectedPokemon: parsedPokemon.data,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .select("selectedPokemon")
    .lean();

  if (updatedUser) {
    return {
      success: true,
      message: `${parsedPokemon.data} is now your companion!`,
      selectedPokemon: updatedUser.selectedPokemon,
    };
  }

  const existingUser = await User.findById(user.id)
    .select("selectedPokemon")
    .lean();

  if (existingUser?.selectedPokemon === parsedPokemon.data) {
    return {
      success: true,
      message: `${parsedPokemon.data} is already your companion!`,
      selectedPokemon: existingUser.selectedPokemon,
    };
  }

  return {
    success: false,
    message: "You have already selected your starter Pokémon.",
  };
}
