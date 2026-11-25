import Link from "next/link";

export default function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="relative scroll-mt-8 px-5 pb-28 pt-12 sm:px-8 lg:px-12 lg:pb-36"
    >
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-4xl border border-[#D6A84B]/20 bg-[#111113] px-7 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-40 h-120 w-120 rounded-full bg-[#D6A84B]/8 blur-[110px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-linear-to-r from-transparent via-[#D6A84B]/50 to-transparent"
        />

        <div className="relative z-10 max-w-3xl">
          <p className="text-xs font-bold tracking-[0.2em] text-[#D6A84B] sm:text-sm">
            YOUR NEXT LEVEL STARTS HERE
          </p>

          <h2
            id="about-title"
            className="mt-6 text-3xl font-bold leading-tight tracking-tight text-[#F5F2E9] sm:text-4xl lg:text-5xl"
          >
            Don&apos;t just fix the error.
            <span className="mt-2 block text-[#D6A84B]">
              Understand the code.
            </span>
          </h2>

          <p className="mt-6 max-w-2xl text-sm leading-7 text-white/50 sm:text-base sm:leading-8">
            PokeDev AI is built to make debugging a more understandable
            experience. Explore the cause, examine the evidence, revisit your
            analyses and keep growing as a developer.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#D6A84B] px-7 py-4 text-sm font-bold text-[#17130B] transition duration-200 hover:-translate-y-1 hover:bg-[#E6BD69]"
            >
              Get started with PokeDev AI
              <span aria-hidden="true">↗</span>
            </Link>

            <Link
              href="#top"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 px-7 py-4 text-sm font-semibold text-white/70 transition hover:border-[#D6A84B]/30 hover:bg-white/4 hover:text-white"
            >
              Back to top ↑
            </Link>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-8 right-10 hidden select-none font-mono text-[11rem] font-bold leading-none text-white/2.5 lg:block"
        >
          AI
        </div>
      </div>
    </section>
  );
}
