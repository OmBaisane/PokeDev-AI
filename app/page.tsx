import Image from "next/image";

const features = [
  {
    number: "01",
    title: "Learn with context",
    description:
      "Break down confusing programming concepts into smaller, understandable steps.",
    symbol: "⌘",
  },
  {
    number: "02",
    title: "Practice with purpose",
    description:
      "Build confidence through focused practice and a clearer learning path.",
    symbol: "↗",
  },
  {
    number: "03",
    title: "Grow your skills",
    description:
      "Turn small daily improvements into lasting developer progress.",
    symbol: "✳",
  },
];

export default function Home() {
  return (
    <main
      id="top"
      className="relative min-h-screen overflow-hidden bg-[#0B0A14]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-linear(ellipse_at_50%_0%,rgba(124,58,237,0.19),transparent_55%)]"
      />

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <a
          href="#top"
          className="flex items-center gap-3"
          aria-label="PokeDev AI home"
        >
          <Image
            src="/branding/pokedev-symbol.png"
            alt="PokeDev AI mascot"
            width={44}
            height={44}
            priority
            className="h-10 w-10 rounded-xl object-contain"
          />
          <span className="text-lg font-bold tracking-tight sm:text-xl">
            PokeDev <span className="text-violet-400">AI</span>
          </span>
        </a>

        <a
          href="#features"
          className="rounded-full border border-white/10 bg-white/4 px-4 py-2 text-sm font-medium text-white/80 transition hover:border-violet-400/50 hover:bg-violet-400/10 hover:text-white sm:px-5"
        >
          Explore{" "}
          <span aria-hidden="true" className="ml-1">
            ↗
          </span>
        </a>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[78vh] w-full max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.1fr_0.9fr] md:py-24 lg:px-12">
        <div className="max-w-2xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/8 px-3.5 py-2 text-xs font-medium tracking-wide text-violet-200 sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.8)]" />
            YOUR AI-POWERED LEARNING COMPANION
          </div>

          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-7xl">
            Level up your
            <span className="mt-2 block bg-linear-to-r from-violet-300 via-purple-400 to-fuchsia-300 bg-clip-text text-transparent">
              developer journey.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-white/60 sm:text-lg sm:leading-8">
            Learn with clarity. Practice with purpose. Keep growing, one concept
            at a time — with a little help from AI.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-950/40 transition hover:-translate-y-0.5 hover:bg-violet-400"
            >
              Explore the experience <span aria-hidden="true">→</span>
            </a>
            <a
              href="#about"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/3 px-6 py-3.5 text-sm font-semibold text-white/80 transition hover:bg-white/[0.07] hover:text-white"
            >
              Meet PokeDev AI
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/40 sm:text-sm">
            <span className="flex items-center gap-2">
              <span className="text-violet-300">✦</span> Learn at your pace
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-white/20 sm:block" />
            <span className="flex items-center gap-2">
              <span className="text-violet-300">✦</span> Build real
              understanding
            </span>
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-md items-center justify-center">
          <div
            aria-hidden="true"
            className="absolute h-64 w-64 rounded-full bg-violet-600/20 blur-3xl sm:h-80 sm:w-80"
          />
          <div className="absolute h-[80%] w-[80%] rounded-full border border-violet-300/10" />
          <div className="absolute h-[64%] w-[64%] rounded-full border border-dashed border-violet-300/15" />

          <div className="relative w-full rounded-4xl border border-white/10 bg-[#151222]/80 p-5 shadow-2xl shadow-violet-950/30 backdrop-blur-xl sm:p-7">
            <div className="flex items-center justify-between border-b border-white/8 pb-4">
              <div>
                <p className="text-xs font-medium text-white/40">POKEDEV AI</p>
                <p className="mt-1 text-sm font-semibold text-white/90">
                  Your next level starts here
                </p>
              </div>
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs text-emerald-300">
                Learning starts here
              </span>
            </div>

            <div className="relative mx-auto my-6 flex aspect-square w-full max-w-67.5 items-center justify-center">
              <div className="absolute inset-3 rounded-full bg-violet-500/10 blur-2xl" />
              <Image
                src="/branding/pokedev-symbol.png"
                alt="PokeDev AI mascot emblem"
                width={512}
                height={512}
                priority
                className="relative z-10 h-full w-full object-contain drop-shadow-[0_0_32px_rgba(139,92,246,0.25)]"
              />
            </div>

            <div className="rounded-2xl border border-violet-300/10 bg-white/[0.035] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">Your learning journey</p>
                  <p className="mt-1 text-xs text-white/45">
                    One concept. One step. One level up.
                  </p>
                </div>
                <span aria-hidden="true" className="text-2xl text-violet-300">
                  ✧
                </span>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-2/3 rounded-full bg-linear-to-r from-violet-500 to-fuchsia-400" />
              </div>
              <p className="mt-2 text-right text-[11px] text-white/35">
                Illustrative preview
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="relative z-10 mx-auto w-full max-w-7xl scroll-mt-8 px-5 py-16 sm:px-8 lg:px-12 lg:py-24"
      >
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">
            Built for your growth
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Make every learning session count.
          </h2>
          <p className="mt-4 leading-7 text-white/55">
            A simple vision for a better developer learning experience:
            understand more, practise deliberately, and keep moving forward.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.number}
              className="group rounded-2xl border border-white/8 bg-white/2.5 p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-300/25 hover:bg-violet-400/4 sm:p-7"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-400/10 text-xl text-violet-200">
                  {feature.symbol}
                </span>
                <span className="font-mono text-xs text-white/25">
                  {feature.number}
                </span>
              </div>
              <h3 className="mt-6 text-lg font-semibold">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/55">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="about"
        className="relative z-10 scroll-mt-8 px-5 pb-20 pt-8 sm:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-violet-300/15 bg-linear-to-br from-violet-500/10 via-[#151222] to-fuchsia-500/6 p-7 sm:p-12 lg:p-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">
            Small steps. Real progress.
          </p>
          <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Your developer story is still being written.
            </h2>
            <a
              href="#top"
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/6"
            >
              Back to top ↑
            </a>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/[0.07]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <p>© 2026 PokeDev AI. Keep learning, keep leveling up.</p>
          <p>Made for the journey ahead.</p>
        </div>
      </footer>
    </main>
  );
}
