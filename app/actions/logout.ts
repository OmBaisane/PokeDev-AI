"use server";

import { redirect } from "next/navigation";

import { logoutUser } from "@/app/actions/auth";

export async function logoutAction(): Promise<void> {
  await logoutUser();
  redirect("/login");
}
