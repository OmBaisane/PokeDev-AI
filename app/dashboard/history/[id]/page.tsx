import Link from "next/link";
import { connection } from "next/server";

import { logoutAction } from "@/app/actions/logout";
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
          href="/dashboard/history"
          className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-blue-400"
        >
          <span aria-hidden="true">←</span>
          Back to history
        </Link>

        <section className="mt-7 mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">
            Your learning archive
          </p>

          <h1 className="mt-3 text-3xl font-black sm:text-4xl">
            Saved Analysis
          </h1>

          <p className="mt-3 text-sm leading-7 text-gray-400">
            Revisit the AI insights, suggested fixes and original code snapshot
            from your debugging session.
          </p>
        </section>

        <AnalysisDetail id={id} />
      </div>
    </main>
  );
}
