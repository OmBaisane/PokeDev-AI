import Image from "next/image";
import Link from "next/link";

import { logoutAction } from "@/app/actions/logout";

type DashboardHeaderProps = {
  userName: string;
  activePage: "dashboard" | "debug-lab" | "history";
};

const navigation = [
  { label: "Dashboard", href: "/dashboard", key: "dashboard" },
  { label: "Debug Lab", href: "/dashboard/debug-lab", key: "debug-lab" },
  { label: "History", href: "/dashboard/history", key: "history" },
] as const;

export default function DashboardHeader({
  userName,
  activePage,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#0B0B0D]/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex items-center justify-between py-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3"
            aria-label="PokeDev AI dashboard"
          >
            <Image
              src="/branding/pokedev-symbol.png"
              alt=""
              width={38}
              height={38}
              priority
              className="h-9 w-9 object-contain"
            />

            <div>
              <p className="text-lg font-bold tracking-tight">
                PokeDev <span className="text-[#D6A84B]">AI</span>
              </p>
              <p className="text-[9px] font-semibold tracking-[0.24em] text-white/35">
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

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="max-w-40 truncate text-sm font-semibold text-white/85">
                {userName}
              </p>
              <p className="text-[10px] text-white/35">Developer Trainer</p>
            </div>

            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-xl border border-white/10 px-3.5 py-2 text-xs font-semibold text-white/65 transition hover:border-red-400/30 hover:bg-red-400/[0.07] hover:text-red-300 sm:px-4 sm:text-sm"
              >
                Log out
              </button>
            </form>
          </div>
        </div>

        <nav
          aria-label="Mobile dashboard navigation"
          className="flex items-center gap-6 overflow-x-auto border-t border-white/6 py-3 lg:hidden"
        >
          {navigation.map((item) => {
            const isActive = activePage === item.key;

            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`shrink-0 text-xs font-semibold transition ${
                  isActive
                    ? "text-[#E6BD69]"
                    : "text-white/50 hover:text-[#E6BD69]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
