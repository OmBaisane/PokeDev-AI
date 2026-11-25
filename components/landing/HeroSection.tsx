import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative mx-auto grid min-h-[calc(90vh-73px)] w-full max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 md:grid-cols-[1.05fr_0.95fr] md:py-24 lg:gap-20 lg:px-12"
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

      <div className="relative mx-auto w-full max-w-lg">
        <div
          aria-hidden="true"
          className="absolute inset-10 rounded-full bg-[#D6A84B]/10 blur-[90px]"
        />

        <div className="absolute inset-[8%] rounded-full border border-[#D6A84B]/10" />
        <div className="absolute inset-[17%] rounded-full border border-dashed border-[#D6A84B]/15" />

        <div className="relative rounded-4xl border border-white/10 bg-[#131316]/90 p-5 shadow-[0_25px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-7">
          <div className="flex items-center justify-between border-b border-white/8 pb-4">
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] text-[#D6A84B]/70">
                POKEDEV AI
              </p>
              <p className="mt-1.5 text-sm font-semibold text-white/90">
                Your debugging companion
              </p>
            </div>

            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-semibold text-emerald-300">
              AI ASSISTED
            </span>
          </div>

          <div className="relative mx-auto my-5 flex aspect-square w-full max-w-82.5 items-center justify-center">
            <div className="absolute inset-5 rounded-full bg-[#D6A84B]/6 blur-2xl" />

            <Image
              src="/images/pokemon/pyronix.png"
              alt="Pyronix, the Fire starter companion"
              width={700}
              height={700}
              priority
              sizes="(max-width: 768px) 75vw, 330px"
              className="relative z-10 h-full w-full object-contain drop-shadow-[0_15px_35px_rgba(0,0,0,0.5)]"
            />
          </div>

          <div className="rounded-2xl border border-[#D6A84B]/15 bg-[#D6A84B]/4.5 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white/90">
                  Every error has a story.
                </p>
                <p className="mt-1.5 text-xs leading-5 text-white/45">
                  Understand the problem, not just the fix.
                </p>
              </div>

              <span className="text-2xl text-[#E6BD69]" aria-hidden="true">
                ✧
              </span>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-5 -left-3 rounded-xl border border-white/10 bg-[#171719] px-4 py-3 shadow-xl sm:-left-8">
          <p className="text-[10px] font-medium tracking-wide text-white/40">
            YOUR COMPANION
          </p>
          <p className="mt-1 text-sm font-bold text-[#E6BD69]">Pyronix</p>
        </div>
      </div>
    </section>
  );
}
