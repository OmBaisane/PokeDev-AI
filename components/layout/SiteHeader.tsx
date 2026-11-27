"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const navigation = [
  { label: "Features", href: "#features", symbol: "✦" },
  { label: "Companions", href: "#companions", symbol: "◈" },
  { label: "About", href: "#about", symbol: "ⓘ" },
];

export default function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="relative z-20 border-b border-white/[0.07] bg-[#0B0B0D]/75 backdrop-blur-xl">
      <nav
        aria-label="Main navigation"
        className="relative mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12"
      >
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3"
          aria-label="PokeDev AI home"
          onClick={() => setIsOpen(false)}
        >
          <Image
            src="/branding/pokedev-logo-dark.png"
            alt="PokeDev AI"
            width={280}
            height={72}
            priority
            className="h-auto w-36.25 object-contain sm:w-42.5"
          />
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-white/55 transition-colors hover:text-[#E6BD69]"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="inline-flex rounded-full px-4 py-2.5 text-sm font-semibold text-white/75 transition-colors hover:text-white"
          >
            Log in
          </Link>

          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-full border border-[#E6BD69]/30 bg-[#D6A84B] px-4 py-2.5 text-sm font-bold text-[#17130B] shadow-[0_0_24px_rgba(214,168,75,0.12)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#E6BD69] sm:px-5"
          >
            Get started
            <span aria-hidden="true">↗</span>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <div className="relative shrink-0 md:hidden">
          <button
            type="button"
            aria-label={
              isOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={isOpen}
            aria-controls="mobile-site-menu"
            onClick={() => setIsOpen((open) => !open)}
            className={`flex h-9 items-center gap-2 rounded-xl border px-3 transition ${
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

            <span className="text-[11px] font-semibold">
              {isOpen ? "Close" : "Menu"}
            </span>
          </button>

          {isOpen && (
            <>
              {/* Outside click overlay */}
              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 z-40 cursor-default"
              />

              {/* Dropdown menu */}
              <div
                id="mobile-site-menu"
                className="absolute right-0 top-full z-50 mt-3 w-[min(19rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#D6A84B]/20 bg-[#111114] p-3 shadow-2xl shadow-black/40"
              >
                <div className="mb-3 border-b border-white/[0.07] px-2 pb-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D6A84B]">
                    PokeDev navigation
                  </p>
                  <p className="mt-1 text-xs text-white/35">
                    Explore your developer journey
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex min-w-0 items-center gap-2 rounded-xl border border-white/5 bg-white/2px-3 py-3 text-xs font-semibold text-white/60 transition hover:border-[#D6A84B]/20 hover:bg-[#D6A84B]/10 hover:text-[#E6BD69]"
                    >
                      <span className="shrink-0 text-base">{item.symbol}</span>
                      <span className="truncate">{item.label}</span>
                    </Link>
                  ))}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/[0.07] pt-3">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center rounded-xl border border-white/10 px-3 py-3 text-xs font-semibold text-white/70 transition hover:border-[#D6A84B]/30 hover:text-white"
                  >
                    Log in
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-1 rounded-xl bg-[#D6A84B] px-3 py-3 text-xs font-bold text-[#17130B] transition hover:bg-[#E6BD69]"
                  >
                    Get started
                    <span aria-hidden="true">↗</span>
                  </Link>
                </div>

                <p className="px-2 pt-3 text-center text-[9px] font-semibold tracking-[0.18em] text-white/25">
                  TRAIN. CODE. EVOLVE.
                </p>
              </div>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
