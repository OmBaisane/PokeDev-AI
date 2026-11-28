import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative mx-auto grid min-h-[calc(90vh-73px)] w-full max-w-7xl items-center gap-12 overflow-hidden px-5 py-16 sm:px-8 sm:py-20 md:grid-cols-[0.9fr_1.1fr] md:gap-8 md:py-24 lg:gap-12 lg:px-12"
    >
      <div className="relative z-10 max-w-2xl">
        <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-[#D6A84B]/20 bg-[#D6A84B]/[0.07] px-4 py-2 text-xs font-semibold tracking-[0.12em] text-[#E6BD69] sm:text-sm">
          <span className="h-2 w-2 rounded-full bg-[#D6A84B] shadow-[0_0_12px_rgba(214,168,75,0.8)]" />
          YOUR AI-POWERED DEBUGGING COMPANION
        </div>

        <h1
          id="hero-title"
          className="text-5xl font-bold leading-[1.08] tracking-[-0.045em] text-[#F5F2E9] sm:text-6xl lg:text-7xl"
        >
          Debug smarter.
          <span className="mt-2 block bg-linear-to-r from-[#E6BD69] via-[#D6A84B] to-[#A77B32] bg-clip-text text-transparent">
            Grow stronger.
          </span>
        </h1>

        <p className="mt-7 max-w-xl text-base leading-8 text-white/60 sm:text-lg">
          Confused by an error? Let AI help you understand what went wrong,
          explore the evidence, and find a clearer path to the solution.
        </p>

        <p className="mt-3 text-sm leading-7 text-white/40">
          Built for JavaScript, TypeScript and Python developers.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#D6A84B] px-7 py-4 text-sm font-bold text-[#17130B] shadow-[0_8px_35px_rgba(214,168,75,0.16)] transition duration-200 hover:-translate-y-1 hover:bg-[#E6BD69]"
          >
            Start your journey
            <span aria-hidden="true">↗</span>
          </Link>

          <Link
            href="#features"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-7 py-4 text-sm font-semibold text-white/80 transition hover:border-[#D6A84B]/30 hover:bg-white/[0.07] hover:text-white"
          >
            Explore features
            <span aria-hidden="true">↓</span>
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-white/40 sm:text-sm">
          <span className="flex items-center gap-2">
            <span className="text-[#D6A84B]">✦</span>
            Understand the cause
          </span>

          <span className="flex items-center gap-2">
            <span className="text-[#D6A84B]">✦</span>
            Keep your analysis history
          </span>
        </div>
      </div>

      <div className="relative mx-auto w-full min-w-0 md:-mr-4 lg:-mr-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[12%] rounded-full bg-[#D6A84B]/10 blur-[100px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[18%] rounded-full border border-[#D6A84B]/10"
        />

        <div className="relative overflow-hidden rounded-4xl border border-[#D6A84B]/15 bg-[#0B0B0D] shadow-[0_25px_100px_rgba(0,0,0,0.45)]">
          <Image
            src="/images/hero/pokedev-starters-hero.png"
            alt="Pyronix, Aquavex and Thornyx standing together as the three starter companions of PokeDev AI"
            width={1536}
            height={1024}
            priority
            sizes="(max-width: 768px) 100vw, 58vw"
            className="relative z-10 h-auto w-full object-contain"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-20 bg-linear-to-t from-[#0B0B0D]/70 to-transparent"
          />

          <div className="absolute bottom-4 left-4 right-4 z-30 flex items-center justify-between gap-3 sm:bottom-5 sm:left-5 sm:right-5">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#D6A84B]">
                Choose your companion
              </p>
              <p className="mt-1 text-xs font-semibold text-white/85 sm:text-sm">
                Three elements. One journey.
              </p>
            </div>

            <span className="shrink-0 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-[9px] font-bold tracking-wider text-[#E6BD69] backdrop-blur-md sm:text-[10px]">
              FIRE · WATER · GRASS
            </span>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-8 -right-5 h-32 w-32 rounded-full bg-[#D6A84B]/10 blur-3xl"
        />
      </div>
    </section>
  );
}
