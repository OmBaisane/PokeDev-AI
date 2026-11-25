import Image from "next/image";

const companions = [
  {
    name: "Pyronix",
    type: "FIRE TYPE",
    description:
      "Bring the spark. Face every debugging challenge with courage.",
    image: "/images/pokemon/pyronix.png",
    accent: "border-orange-400/20",
    glow: "bg-orange-500/[0.08]",
    color: "text-orange-300",
    symbol: "🔥",
  },
  {
    name: "Aquavex",
    type: "WATER TYPE",
    description: "Stay calm, think clearly and flow through complex problems.",
    image: "/images/pokemon/aquavex.png",
    accent: "border-cyan-400/20",
    glow: "bg-cyan-500/[0.08]",
    color: "text-cyan-300",
    symbol: "💧",
  },
  {
    name: "Thornyx",
    type: "GRASS TYPE",
    description: "Grow with every challenge and build stronger foundations.",
    image: "/images/pokemon/thornyx.png",
    accent: "border-emerald-400/20",
    glow: "bg-emerald-500/[0.08]",
    color: "text-emerald-300",
    symbol: "🌿",
  },
];

export default function CompanionsSection() {
  return (
    <section
      id="companions"
      aria-labelledby="companions-title"
      className="relative mx-auto w-full max-w-7xl scroll-mt-8 px-5 py-24 sm:px-8 lg:px-12 lg:py-32"
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold tracking-[0.2em] text-[#D6A84B] sm:text-sm">
          CHOOSE YOUR COMPANION
        </p>

        <h2
          id="companions-title"
          className="mt-5 text-3xl font-bold tracking-tight text-[#F5F2E9] sm:text-4xl lg:text-5xl"
        >
          Every journey deserves
          <span className="mt-2 block text-[#D6A84B]">a companion.</span>
        </h2>

        <p className="mt-5 text-sm leading-7 text-white/45 sm:text-base">
          Meet the three starter companions of PokeDev AI. Each brings its own
          personality to your developer journey.
        </p>
      </div>

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {companions.map((companion) => (
          <article
            key={companion.name}
            className={`group relative overflow-hidden rounded-3xl border ${companion.accent} bg-[#111113] p-5 transition duration-300 hover:-translate-y-1 sm:p-6`}
          >
            <div
              aria-hidden="true"
              className={`absolute -top-16 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full ${companion.glow} blur-[65px]`}
            />

            <div className="relative">
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold tracking-[0.15em] ${companion.color}`}
                >
                  {companion.type}
                </span>

                <span aria-hidden="true" className="text-lg">
                  {companion.symbol}
                </span>
              </div>

              <div className="relative mx-auto mt-4 aspect-square w-full max-w-67.5">
                <Image
                  src={companion.image}
                  alt={`${companion.name}, the ${companion.type.toLowerCase()} starter companion`}
                  width={600}
                  height={600}
                  sizes="(max-width: 768px) 80vw, 270px"
                  className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="mt-2 border-t border-white/8 pt-5">
                <h3 className="text-xl font-bold text-[#F5F2E9]">
                  {companion.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-white/45">
                  {companion.description}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
