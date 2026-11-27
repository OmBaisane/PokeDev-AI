import Link from "next/link";
import { connection } from "next/server";
import { getPokemonElementTheme } from "@/lib/pokemon/theme";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DebugLab from "@/components/dashboard/DebugLab";
import { requireVerifiedUser } from "@/lib/auth/permissions";

export const instant = false;

export default async function DebugLabPage() {
  await connection();
  const user = await requireVerifiedUser();

  return (
    <main
      data-element-theme={getPokemonElementTheme(user.selectedPokemon)}
      className="min-h-screen bg-[#0B0B0D] text-[#F5F2E9]"
    >
      <DashboardHeader userName={user.name} activePage="debug-lab" />

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-[#A1A1AA] transition hover:text-[#E6BD69]"
        >
          <span aria-hidden="true">←</span>
          Back to dashboard
        </Link>

        <section className="relative mt-7 overflow-hidden rounded-3xl border border-[#D6A84B]/20 bg-linear-to-br from-[#211B10] via-[#15130F] to-[#101012] p-7 sm:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full bg-[#D6A84B]/10 blur-3xl"
          />

          <div className="relative max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#E6BD69]">
              Your coding companion
            </p>

            <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight sm:text-5xl">
              Welcome to
              <span className="block bg-linear-to-r from-[#E6BD69] to-[#D6A84B] bg-clip-text text-transparent">
                AI Debug Lab
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#A1A1AA] sm:text-base">
              Understand errors, investigate possible causes and discover better
              solutions with your AI-powered coding companion. Learn why
              something went wrong instead of just copying a fix.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {["JavaScript", "TypeScript", "Python"].map((language) => (
                <span
                  key={language}
                  className="rounded-full border border-[#D6A84B]/20 bg-[#D6A84B]/8 px-4 py-2 text-xs font-semibold text-[#E6BD69]"
                >
                  {language}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-10">
          <DebugLab />
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-6 text-[#71717A]">
          AI-generated debugging suggestions may be incomplete or incorrect.
          Always review suggested changes and verify them in your own
          development environment. Submitted content may be processed by an AI
          analysis provider. Do not submit secrets or sensitive code.
        </p>
      </div>
    </main>
  );
}
