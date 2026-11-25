import Link from "next/link";
import { connection } from "next/server";
import { requireVerifiedUser } from "@/lib/auth/permissions";
import { logoutAction } from "@/app/actions/logout";
import PokemonSelector from "@/components/dashboard/PokemonSelector";

export const instant = false;

export default async function DashboardPage() {
  await connection();
  const user = await requireVerifiedUser();

  return (
    <main className="min-h-screen bg-[#080b14] text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-20 border-b border-white/6 bg-[#080b14]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <div>
            <p className="text-xl font-black tracking-tight">
              POKEDEV<span className="text-blue-500"> AI</span>
            </p>
            <p className="text-[10px] tracking-[0.3em] text-gray-500">
              TRAIN. CODE. EVOLVE.
            </p>
          </div>

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
        {/* Welcome Section */}
        <section className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-linear-to-br from-[#111d38] via-[#101629] to-[#0b1020] p-7 sm:p-10">
          <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-400">
              Your adventure begins
            </p>

            <h1 className="mt-5 text-3xl font-black leading-tight sm:text-5xl">
              Welcome back,
              <span className="block bg-linear-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                {user.name}!
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-sm leading-7 text-gray-400 sm:text-base">
              Your journey from developer to AI-powered coding trainer starts
              here. Choose your partner and prepare to evolve your coding
              skills.
            </p>

            <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-xs font-semibold text-blue-300">
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              Trainer account active
            </div>
          </div>
        </section>

        {/* Starter Selection */}
        <PokemonSelector selectedPokemon={user.selectedPokemon} />

        {/* Upcoming Features */}
        <section className="mt-14 grid gap-4 sm:grid-cols-2">
          <Link
            href="/dashboard/debug-lab"
            className="group rounded-2xl border border-blue-500/20 bg-[#101522] p-6 transition hover:border-blue-400/50 hover:bg-[#131d32]"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">
              Available now
            </p>
            <h3 className="mt-3 text-xl font-bold transition group-hover:text-blue-300">
              AI Debug Lab →
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Analyze code, discover bugs and learn better solutions with your
              AI-powered coding companion.
            </p>
          </Link>

          <Link
            href="/dashboard/history"
            className="group rounded-2xl border border-cyan-500/20 bg-[#101522] p-6 transition hover:border-cyan-400/50 hover:bg-[#131d32]"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
              Your learning archive
            </p>
            <h3 className="mt-3 text-xl font-bold transition group-hover:text-cyan-300">
              Analysis History →
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Revisit your previous AI debugging sessions, saved insights and
              original code snapshots.
            </p>
          </Link>
        </section>
      </div>
    </main>
  );
}
