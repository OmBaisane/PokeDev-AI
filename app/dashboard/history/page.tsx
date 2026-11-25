import Link from "next/link";
import { connection } from "next/server";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AnalysisHistory from "@/components/dashboard/AnalysisHistory";
import { requireVerifiedUser } from "@/lib/auth/permissions";

export const instant = false;

export default async function HistoryPage() {
  await connection();
  const user = await requireVerifiedUser();

  return (
    <main className="min-h-screen bg-[#0B0B0D] text-[#F5F2E9]">
      <DashboardHeader userName={user.name} activePage="history" />

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
              Your learning archive
            </p>

            <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight sm:text-5xl">
              Your
              <span className="block bg-linear-to-r from-[#E6BD69] to-[#D6A84B] bg-clip-text text-transparent">
                Analysis History
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#A1A1AA] sm:text-base">
              Every completed debugging session becomes part of your learning
              journey. Revisit previous insights, understand past mistakes and
              track your progress.
            </p>

            <Link
              href="/dashboard/debug-lab"
              className="mt-7 inline-flex rounded-xl bg-[#D6A84B] px-5 py-3 text-sm font-bold text-[#0B0B0D] transition hover:bg-[#E6BD69]"
            >
              Start new analysis →
            </Link>
          </div>
        </section>

        <div className="mt-10">
          <AnalysisHistory />
        </div>
      </div>
    </main>
  );
}
