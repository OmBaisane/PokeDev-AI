import Link from "next/link";
import { connection } from "next/server";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AnalysisDetail from "@/components/dashboard/AnalysisDetail";
import { requireVerifiedUser } from "@/lib/auth/permissions";

export const instant = false;

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function HistoryDetailPage({ params }: PageProps) {
  await connection();

  const user = await requireVerifiedUser();
  const { id } = await params;

  return (
    <main className="min-h-screen bg-[#0B0B0D] text-[#F5F2E9]">
      <DashboardHeader userName={user.name} activePage="history" />

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <Link
          href="/dashboard/history"
          className="inline-flex items-center gap-2 text-sm text-[#A1A1AA] transition hover:text-[#E6BD69]"
        >
          <span aria-hidden="true">←</span>
          Back to history
        </Link>

        <section className="mb-8 mt-7">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#E6BD69]">
            Your learning archive
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Saved Analysis
          </h1>

          <p className="mt-3 text-sm leading-7 text-[#A1A1AA]">
            Revisit the AI insights, suggested fixes and original code snapshot
            from your debugging session.
          </p>
        </section>

        <AnalysisDetail id={id} />
      </div>
    </main>
  );
}
