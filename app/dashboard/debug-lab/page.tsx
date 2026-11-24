import Link from "next/link";
import { connection } from "next/server";
import { logoutAction } from "@/app/actions/logout";
import DebugLab from "@/components/dashboard/DebugLab";
import { requireVerifiedUser } from "@/lib/auth/permissions";

export const instant = false;

export default async function DebugLabPage() {
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

        <section className="relative mt-7 overflow-hidden rounded-3xl border border-blue-500/20 bg-linear-to-br from-[#111d38] via-[#101629] to-[#0b1020] p-7 sm:p-10">
          <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-400">
              Your coding companion
            </p>

            <h1 className="mt-5 text-3xl font-black leading-tight sm:text-5xl">
              Welcome to
              <span className="block bg-linear-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                AI Debug Lab
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
              Understand errors, investigate possible causes and discover better
              solutions with your AI-powered coding companion. Learn why
              something went wrong instead of just copying a fix.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {["JavaScript", "TypeScript", "Python"].map((language) => (
                <span
                  key={language}
                  className="rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-xs font-semibold text-blue-300"
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

        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-6 text-gray-500">
          AI-generated debugging suggestions may be incomplete or incorrect.
          Always review suggested changes and verify them in your own
          development environment. Submitted content may be processed by AI
          analysis provider. Do not submit secrets or sensitive code.
        </p>
      </div>
    </main>
  );
}
