import Image from "next/image";
import Link from "next/link";

const navigation = [
  { label: "Features", href: "#features" },
  { label: "Companions", href: "#companions" },
  { label: "About", href: "#about" },
];

export default function SiteHeader() {
  return (
    <header className="relative z-20 border-b border-white/[0.07] bg-[#0B0B0D]/75 backdrop-blur-xl">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12"
      >
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3"
          aria-label="PokeDev AI home"
        >
          <Image
            src="/branding/pokedev-symbol.png"
            alt=""
            width={42}
            height={42}
            priority
            className="h-10 w-10 object-contain"
          />

          <span className="text-lg font-bold tracking-tight text-[#F5F2E9] sm:text-xl">
            PokeDev
            <span className="text-[#D6A84B]"> AI</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-white/55 transition-colors hover:text-[#E6BD69]"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-full px-4 py-2.5 text-sm font-semibold text-white/75 transition-colors hover:text-white sm:inline-flex"
          >
            Log in
          </Link>

          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-full border border-[#E6BD69]/30 bg-[#D6A84B] px-4 py-2.5 text-sm font-bold text-[#17130B] shadow-[0_0_24px_rgba(214,168,75,0.12)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#E6BD69] sm:px-5"
          >
            Get started
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
