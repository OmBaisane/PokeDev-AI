import Image from "next/image";

export default function SiteHeader() {
  return (
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
  );
}
