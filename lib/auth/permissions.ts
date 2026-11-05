import "server-only";

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/dal";

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireVerifiedUser() {
  const user = await requireUser();

  if (!user.emailVerifiedAt) {
    redirect("/verify-email");
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireUser();

  if (user.role !== "admin") {
    redirect("/");
  }

  return user;
}
