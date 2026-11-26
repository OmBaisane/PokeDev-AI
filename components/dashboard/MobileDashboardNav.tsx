"use client";

import { useState } from "react";
import Link from "next/link";

type MobileDashboardNavProps = {
  activePage: string;
};

const navigation = [
  { label: "Dashboard", href: "/dashboard", key: "dashboard", symbol: "⌂" },
  {
    label: "Debug Lab",
    href: "/dashboard/debug-lab",
    key: "debug-lab",
    symbol: "⌘",
  },
  {
    label: "Challenges",
    href: "/dashboard/challenges",
    key: "challenges",
    symbol: "⚡",
  },
  {
    label: "Milestones",
    href: "/dashboard/milestones",
    key: "milestones",
    symbol: "✦",
  },
  { label: "History", href: "/dashboard/history", key: "history", symbol: "◷" },
];

export default function MobileDashboardNav({
  activePage,
}: MobileDashboardNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeLabel =
    navigation.find((item) => item.key === activePage)?.label ?? "Menu";

  return (
    <div className="relative shrink-0 lg:hidden">
      <button
        type="button"
        aria-label={
          isOpen ? "Close navigation menu" : `Open ${activeLabel} navigation`
        }
        aria-expanded={isOpen}
        aria-controls="mobile-dashboard-menu"
        onClick={() => setIsOpen((open) => !open)}
        className={`flex h-9 max-w-29 items-center gap-1.5 rounded-xl border px-2 transition ${
          isOpen
            ? "border-[#D6A84B]/40 bg-[#D6A84B]/10 text-[#E6BD69]"
            : "border-white/10 bg-white/3 text-white/75 hover:border-[#D6A84B]/30"
        }`}
      >
        <span className="flex h-4 w-4 shrink-0 flex-col justify-center gap-1">
          <span
            className={`h-[1.5px] w-4 rounded-full bg-current transition ${
              isOpen ? "translate-y-[5.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-[1.5px] w-4 rounded-full bg-current transition ${
              isOpen ? "scale-x-0 opacity-0" : ""
            }`}
          />
          <span
            className={`h-[1.5px] w-4 rounded-full bg-current transition ${
              isOpen ? "translate-y-[-5.5px] -rotate-45" : ""
            }`}
          />
        </span>

        <span className="truncate text-[11px] font-semibold">
          {activeLabel}
        </span>
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />

          <nav
            id="mobile-dashboard-menu"
            aria-label="Mobile dashboard navigation"
            className="absolute right-0 top-full z-50 mt-2 w-[min(18rem,calc(100vw-1rem))] overflow-hidden rounded-2xl border border-[#D6A84B]/20 bg-[#111114] p-3 shadow-2xl shadow-black/40"
          >
            <div className="mb-3 border-b border-white/[0.07] px-2 pb-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D6A84B]">
                PokéDev navigation
              </p>
              <p className="mt-1 text-xs text-white/35">
                Choose your next destination
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {navigation.map((item) => {
                const isActive = activePage === item.key;

                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setIsOpen(false)}
                    className={`flex min-w-0 items-center gap-2 rounded-xl border px-3 py-3 text-xs font-semibold transition ${
                      isActive
                        ? "border-[#D6A84B]/20 bg-[#D6A84B]/10 text-[#E6BD69]"
                        : "border-white/5 bg-white/2 text-white/60 hover:bg-white/6 hover:text-white"
                    }`}
                  >
                    <span className="shrink-0 text-base">{item.symbol}</span>
                    <span className="truncate">{item.label}</span>
                    {isActive && (
                      <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-[#E6BD69]" />
                    )}
                  </Link>
                );
              })}
            </div>

            <p className="px-2 pt-3 text-[9px] font-semibold tracking-[0.18em] text-white/25">
              TRAIN. CODE. EVOLVE.
            </p>
          </nav>
        </>
      )}
    </div>
  );
}
