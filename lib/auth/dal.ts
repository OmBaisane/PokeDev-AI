import "server-only";

import { cookies } from "next/headers";

import { connectToDatabase } from "@/lib/db/mongoose";
import { hashToken } from "@/lib/auth/tokens";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { getPokemonProgression } from "@/lib/progression/config";
import { Session } from "@/models/Session";
import { User } from "@/models/User";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  await connectToDatabase();

  const session = await Session.findOne({
    tokenHash: hashToken(token),
    expiresAt: { $gt: new Date() },
  })
    .select("+tokenHash")
    .lean();

  if (!session) {
    return null;
  }

  const user = await User.findOne({
    _id: session.userId,
    isActive: true,
  })
    .select(
      "_id name email role emailVerifiedAt selectedPokemon totalXp completedAnalyses completedChallenges completedMilestones pokemonProgress",
    )
    .lean();

  if (!user) {
    return null;
  }

  await Session.updateOne(
    { _id: session._id },
    { $set: { lastUsedAt: new Date() } },
  );

  const selectedPokemon = user.selectedPokemon ?? null;

  let selectedPokemonProgress = null;

  if (
    selectedPokemon === "Pyronix" ||
    selectedPokemon === "Aquavex" ||
    selectedPokemon === "Thornyx"
  ) {
    const progress = user.pokemonProgress?.[selectedPokemon];
    const xp = progress?.xp ?? 0;

    selectedPokemonProgress = getPokemonProgression(xp);
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    emailVerifiedAt: user.emailVerifiedAt,
    selectedPokemon,

    totalXp: user.totalXp ?? 0,
    completedAnalyses: user.completedAnalyses ?? 0,
    completedChallenges: user.completedChallenges ?? 0,
    completedMilestones: user.completedMilestones ?? 0,

    selectedPokemonProgress,
  };
}
