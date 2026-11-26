import Link from "next/link";
import { connection } from "next/server";

import Challenges from "@/components/dashboard/Challenges";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { requireVerifiedUser } from "@/lib/auth/permissions";

export const instant = false;

export default async function ChallengesPage() {
  await connection();
  const user = await requireVerifiedUser();

  return (
    <main className="min-h-screen bg-[#0B0B0D] text-[#F5F2E9]">
      <DashboardHeader userName={user.name} activePage="challenges" />

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
              Practice & progression
            </p>

            <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight sm:text-5xl">
              Enter the
              <span className="block bg-linear-to-r from-[#E6BD69] to-[#D6A84B] bg-clip-text text-transparent">
                Challenge Arena
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#A1A1AA] sm:text-base">
              Sharpen your JavaScript, TypeScript and Python skills through
              practical coding questions. Solve challenges, earn XP and help
              your companion grow stronger.
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
          <Challenges />
        </div>

        <p className="mt-10 text-center text-xs leading-6 text-white/30">
          Challenge answers are validated securely on the server. Each challenge
          can award XP only once.
        </p>
      </div>
    </main>
  );
}
