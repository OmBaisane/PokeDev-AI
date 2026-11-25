import Link from "next/link";
import { connection } from "next/server";

import { logoutAction } from "@/app/actions/logout";
import AnalysisHistory from "@/components/dashboard/AnalysisHistory";
import { requireVerifiedUser } from "@/lib/auth/permissions";

export const instant = false;

export default async function HistoryPage() {
  await connection();
  const user = await requireVerifiedUser();

  return (
    <main className="min-h-screen bg-[#080b14] text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#080b14]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/dashboard" className="block">
            <p className="text-xl font-black tracking-tight">
              POKEDEV<span className="text-blue-500"> AI</span>
            </p>
            <p className="text-[10px] tracking-[0.3em] text-gray-500">
              TRAIN. CODE. EVOLVE.
            </p>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-gray-500">Developer Trainer</p>
            </div>

            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-xl border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-white"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-blue-400"
        >
          <span aria-hidden="true">←</span>
          Back to dashboard
        </Link>

        <section className="relative mt-7 overflow-hidden rounded-3xl border border-cyan-500/20 bg-linear-to-br from-[#11243a] via-[#101629] to-[#0b1020] p-7 sm:p-10">
          <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">
              Your learning archive
            </p>

            <h1 className="mt-5 text-3xl font-black leading-tight sm:text-5xl">
              Your
              <span className="block bg-linear-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                Analysis History
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
              Every completed debugging session becomes part of your learning
              journey. Revisit previous insights, understand past mistakes and
              track your progress.
            </p>

            <Link
              href="/dashboard/debug-lab"
              className="mt-7 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-500"
            >
              Start new analysis →
            </Link>
          </div>
        </section>

        <AnalysisHistory />
      </div>
    </main>
  );
}
