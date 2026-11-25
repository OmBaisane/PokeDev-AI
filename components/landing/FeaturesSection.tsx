const features = [
  {
    number: "01",
    label: "UNDERSTAND",
    title: "AI-powered debugging",
    description:
      "Bring your JavaScript, TypeScript or Python errors. Get structured explanations that help you understand what went wrong.",
    icon: "⌘",
    details: ["JavaScript", "TypeScript", "Python"],
  },
  {
    number: "02",
    label: "INVESTIGATE",
    title: "Evidence-first insights",
    description:
      "Go beyond a quick fix. Explore the likely cause, supporting evidence and practical suggestions behind an error.",
    icon: "⌕",
    details: ["Likely cause", "Supporting evidence", "Suggested actions"],
  },
  {
    number: "03",
    label: "PROGRESS",
    title: "Your analysis history",
    description:
      "Return to previous debugging sessions with saved results and original input snapshots, all in one place.",
    icon: "↗",
    details: ["Saved analyses", "Original snapshots", "Easy revisit"],
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className="relative mx-auto w-full max-w-7xl scroll-mt-8 px-5 py-24 sm:px-8 lg:px-12 lg:py-32"
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-bold tracking-[0.2em] text-[#D6A84B] sm:text-sm">
            BUILT FOR REAL DEBUGGING
          </p>

          <h2
            id="features-title"
            className="mt-5 text-3xl font-bold tracking-tight text-[#F5F2E9] sm:text-4xl lg:text-5xl"
          >
            More than fixing errors.
            <span className="mt-2 block text-white/45">
              Understanding them.
            </span>
          </h2>
        </div>

        <p className="max-w-md text-sm leading-7 text-white/45 sm:text-base">
          A clearer debugging experience that helps you investigate problems,
          understand the reasoning and keep track of what you have explored.
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.number}
            className="group relative overflow-hidden rounded-3xl border border-white/8 bg-[#111113] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#D6A84B]/30 hover:bg-[#151517] sm:p-8"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#D6A84B][0.035] blur-3xl transition duration-300 group-hover:bg-[#D6A84B]/9"
            />

            <div className="relative flex items-center justify-between">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D6A84B]/20 bg-[#D6A84B]/[0.07] text-2xl text-[#E6BD69]">
                {feature.icon}
              </span>

              <span className="font-mono text-xs tracking-widest text-white/25">
                {feature.number}
              </span>
            </div>

            <p className="relative mt-9 text-[10px] font-bold tracking-[0.18em] text-[#D6A84B]/75">
              {feature.label}
            </p>

            <h3 className="relative mt-3 text-xl font-bold tracking-tight text-[#F5F2E9]">
              {feature.title}
            </h3>

            <p className="relative mt-4 min-h-26.25 text-sm leading-7 text-white/50">
              {feature.description}
            </p>

            <ul className="relative mt-6 flex flex-wrap gap-2">
              {feature.details.map((detail) => (
                <li
                  key={detail}
                  className="rounded-full border border-white/8 bg-white/2.5 px-3 py-1.5 text-[11px] font-medium text-white/55"
                >
                  {detail}
                </li>
              ))}
            </ul>

            <div
              aria-hidden="true"
              className="relative mt-8 h-px w-full bg-linear-to-r from-[#D6A84B]/35 to-transparent"
            />
          </article>
        ))}
      </div>
    </section>
  );
}
