export default function AboutSection() {
  return (
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
  );
}
