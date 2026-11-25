import Link from "next/link";
import Image from "next/image";

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.07] bg-[#09090B]">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-3"
            aria-label="PokeDev AI home"
          >
            <Image
              src="/branding/pokedev-symbol.png"
              alt=""
              width={34}
              height={34}
              className="h-8 w-8 object-contain"
            />

            <span className="text-base font-bold text-[#F5F2E9]">
              PokeDev <span className="text-[#D6A84B]">AI</span>
            </span>
          </Link>

          <p className="mt-3 text-xs leading-6 text-white/35">
            Understand your errors. Grow as a developer.
          </p>
        </div>

        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-white/45"
        >
          <Link href="#features" className="transition hover:text-[#E6BD69]">
            Features
          </Link>

          <Link href="#companions" className="transition hover:text-[#E6BD69]">
            Companions
          </Link>

          <Link href="#about" className="transition hover:text-[#E6BD69]">
            About
          </Link>

          <Link href="/login" className="transition hover:text-[#E6BD69]">
            Log in
          </Link>
        </nav>

        <p className="text-xs text-white/30">
          © {new Date().getFullYear()} PokeDev AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
