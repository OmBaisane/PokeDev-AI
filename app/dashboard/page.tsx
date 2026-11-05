import { requireVerifiedUser } from "@/lib/auth/permissions";
import { logoutAction } from "@/app/actions/logout";

export const instant = false;

export default async function DashboardPage() {
  const user = await requireVerifiedUser();

  return (
    <main className="min-h-screen bg-[#080b14] px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-widest text-blue-400">
              POKEDEV AI
            </p>

            <h1 className="mt-4 text-3xl font-bold">Welcome, {user.name}!</h1>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-lg border border-white/10 px-4 py-2 text-sm transition hover:border-red-500/50 hover:bg-red-500/10"
            >
              Log out
            </button>
          </form>
        </div>

        <p className="mt-4 text-gray-400">
          Your developer journey starts here.
        </p>
      </div>
    </main>
  );
}
