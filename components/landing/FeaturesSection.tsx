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

export default function FeaturesSection() {
  return (
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
          A simple vision for a better developer learning experience: understand
          more, practise deliberately, and keep moving forward.
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
  );
}
