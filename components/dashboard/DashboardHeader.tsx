import Image from "next/image";
import Link from "next/link";

import { logoutAction } from "@/app/actions/logout";
import MobileDashboardNav from "@/components/dashboard/MobileDashboardNav";

type DashboardHeaderProps = {
  userName: string;
  activePage:
    | "dashboard"
    | "debug-lab"
    | "history"
    | "challenges"
    | "milestones";
};

const navigation = [
  { label: "Dashboard", href: "/dashboard", key: "dashboard" },
  { label: "Debug Lab", href: "/dashboard/debug-lab", key: "debug-lab" },
  { label: "Challenges", href: "/dashboard/challenges", key: "challenges" },
  { label: "Milestones", href: "/dashboard/milestones", key: "milestones" },
  { label: "History", href: "/dashboard/history", key: "history" },
] as const;

export default function DashboardHeader({
  userName,
  activePage,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#0B0B0D]/95 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-2 sm:px-8">
        <div className="flex items-center gap-2 py-3 sm:justify-between sm:gap-3 sm:py-4">
          <Link
            href="/dashboard"
            className="flex shrink-0 items-center gap-1.5 sm:gap-2"
            aria-label="PokeDev AI dashboard"
          >
            <Image
              src="/branding/pokedev-symbol.png"
              alt=""
              width={32}
              height={32}
              priority
              className="h-7 w-7 shrink-0 object-contain sm:h-9 sm:w-9"
            />

            <div className="min-w-0">
              <p className="whitespace-nowrap text-[13px] font-bold tracking-tight sm:text-lg">
                PokeDev <span className="text-[#D6A84B]">AI</span>
              </p>
              <p className="whitespace-nowrap text-[6px] font-semibold tracking-[0.16em] text-white/35 sm:text-[9px] sm:tracking-[0.24em]">
                TRAIN. CODE. EVOLVE.
              </p>
            </div>
          </Link>

          <nav
            aria-label="Dashboard navigation"
            className="hidden items-center gap-7 lg:flex"
          >
            {navigation.map((item) => {
              const isActive = activePage === item.key;

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`text-sm transition ${
                    isActive
                      ? "font-semibold text-[#E6BD69]"
                      : "text-white/55 hover:text-[#E6BD69]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-1 sm:ml-0 sm:gap-3">
            <div className="hidden text-right sm:block">
              <p className="max-w-40 truncate text-sm font-semibold text-white/85">
                {userName}
              </p>
              <p className="text-[10px] text-white/35">Developer Trainer</p>
            </div>

            <form action={logoutAction}>
              <button
                type="submit"
                className="whitespace-nowrap rounded-lg border border-white/10 px-2 py-2 text-[10px] font-semibold text-white/65 transition hover:border-red-400/30 hover:bg-red-400/[0.07] hover:text-red-300 sm:rounded-xl sm:px-4 sm:text-sm"
              >
                Log out
              </button>
            </form>

            <MobileDashboardNav activePage={activePage} />
          </div>
        </div>
      </div>
    </header>
  );
}
