import Link from "next/link";
import { connection } from "next/server";

import { requireVerifiedUser } from "@/lib/auth/permissions";
import PokemonSelector from "@/components/dashboard/PokemonSelector";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export const instant = false;

export default async function DashboardPage() {
  await connection();
  const user = await requireVerifiedUser();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0B0B0D] text-[#F5F2E9]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-72 left-1/2 h-152 w-260 -translate-x-1/2 rounded-full bg-[#D6A84B]/5.5 blur-[130px]" />
        <div className="absolute right-72 top-180 h-128 w-lg rounded-full bg-[#D6A84B]/[0.035] blur-[120px]" />
      </div>

      <DashboardHeader userName={user.name} activePage="dashboard" />

      <div className="relative mx-auto max-w-7xl px-5 py-9 sm:px-8 sm:py-12">
        <section className="relative overflow-hidden rounded-4xl border border-[#D6A84B]/20 bg-linear-to-br from-[#211B10] via-[#15130F] to-[#111113] p-7 shadow-[0_25px_90px_rgba(0,0,0,0.25)] sm:p-10 lg:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full bg-[#D6A84B]/9 blur-[100px]"
          />

          <div className="relative max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D6A84B]/20 bg-[#D6A84B]/[0.07] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.17em] text-[#E6BD69]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D6A84B]" />
              Trainer account active
            </div>

            <p className="mt-8 text-xs font-bold uppercase tracking-[0.25em] text-white/40">
              Welcome back, Trainer
            </p>

            <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
              Ready to level up,
              <span className="mt-1 block bg-linear-to-r from-[#E6BD69] to-[#D6A84B] bg-clip-text text-transparent">
                {user.name}?
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-white/50 sm:text-base">
              Every bug is an opportunity to learn. Team up with your coding
              companion, understand the problem and become a stronger developer,
              one fix at a time.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/dashboard/debug-lab"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D6A84B] px-5 py-3.5 text-sm font-bold text-[#17130B] shadow-[0_8px_30px_rgba(214,168,75,0.12)] transition hover:-translate-y-0.5 hover:bg-[#E6BD69]"
              >
                Open Debug Lab
                <span aria-hidden="true">↗</span>
              </Link>

              <Link
                href="/dashboard/history"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] px-5 py-3.5 text-sm font-semibold text-white/75 transition hover:border-[#D6A84B]/30 hover:bg-white/6 hover:text-[#E6BD69]"
              >
                View your history
              </Link>
            </div>
          </div>
        </section>

        <PokemonSelector selectedPokemon={user.selectedPokemon} />

        <section className="mt-16">
          <div className="mb-7">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D6A84B]">
              Your workspace
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Keep your progress moving.
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/40">
              Your tools for understanding errors and revisiting what you learn.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Link
              href="/dashboard/debug-lab"
              className="group relative overflow-hidden rounded-2xl border border-[#D6A84B]/15 bg-[#111113] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#D6A84B]/40 hover:bg-[#151411] sm:p-8"
            >
              <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-[#D6A84B]/4.5 blur-3xl transition group-hover:bg-[#D6A84B]/9" />

              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#D6A84B]/20 bg-[#D6A84B]/8 text-xl text-[#E6BD69]">
                  {"</>"}
                </div>

                <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D6A84B]">
                  Available now
                </p>

                <h3 className="mt-2 text-xl font-bold text-white/90 transition group-hover:text-[#E6BD69]">
                  AI Debug Lab
                  <span className="ml-2 inline-block transition group-hover:translate-x-1">
                    →
                  </span>
                </h3>

                <p className="mt-3 max-w-md text-sm leading-7 text-white/45">
                  Investigate JavaScript, TypeScript and Python issues with
                  AI-powered explanations, evidence and suggested fixes.
                </p>
              </div>
            </Link>

            <Link
              href="/dashboard/history"
              className="group relative overflow-hidden rounded-2xl border border-white/9 bg-[#111113] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#D6A84B]/30 hover:bg-[#151411] sm:p-8"
            >
              <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-white/[0.018] blur-3xl transition group-hover:bg-[#D6A84B]/5" />

              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/4 text-xl text-[#E6BD69]">
                  ◷
                </div>

                <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
                  Your learning archive
                </p>

                <h3 className="mt-2 text-xl font-bold text-white/90 transition group-hover:text-[#E6BD69]">
                  Analysis History
                  <span className="ml-2 inline-block transition group-hover:translate-x-1">
                    →
                  </span>
                </h3>

                <p className="mt-3 max-w-md text-sm leading-7 text-white/45">
                  Revisit saved debugging sessions, original code snapshots and
                  the insights from your previous analyses.
                </p>
              </div>
            </Link>
          </div>
        </section>

        <footer className="mt-16 border-t border-white/[0.07] pt-6 text-center text-xs text-white/25">
          PokeDev AI · Debug smarter. Grow stronger.
        </footer>
      </div>
    </main>
  );
}
