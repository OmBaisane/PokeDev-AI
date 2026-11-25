"use client";

import { useState, useTransition, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";

import { registerUser } from "@/app/actions/auth";

type FormResult = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export default function RegisterForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<FormResult | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const input = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    startTransition(async () => {
      const response = await registerUser(input);
      setResult(response);
    });
  }

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#0B0B0D] px-5 py-12 text-[#F5F2E9] sm:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-48 left-1/2 h-136 w-136 -translate-x-1/2 rounded-full bg-[#D6A84B]/[0.07] blur-[120px]" />
        <div className="absolute -bottom-48 -right-40 h-112 w-md rounded-full bg-[#D6A84B]/[0.035] blur-[110px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-size-[64px_64px] mask-[linear-gradient(to_bottom,black,transparent_85%)]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-3"
          aria-label="PokeDev AI home"
        >
          <Image
            src="/branding/pokedev-symbol.png"
            alt=""
            width={44}
            height={44}
            priority
            className="h-11 w-11 object-contain"
          />

          <span className="text-xl font-bold tracking-tight text-[#F5F2E9]">
            PokeDev <span className="text-[#D6A84B]">AI</span>
          </span>
        </Link>

        <section className="rounded-4xl border border-white/9 bg-[#111113]/95 p-7 shadow-[0_25px_100px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:p-9">
          <div className="mb-8">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#D6A84B]/20 bg-[#D6A84B]/[0.07] px-3 py-1.5 text-[10px] font-bold tracking-[0.16em] text-[#E6BD69]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D6A84B]" />
              START YOUR JOURNEY
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#F5F2E9] sm:text-4xl">
              Create your
              <span className="mt-1 block text-[#D6A84B]">
                developer account.
              </span>
            </h1>

            <p className="mt-4 text-sm leading-7 text-white/45">
              Join PokeDev AI and make every debugging challenge an opportunity
              to grow.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-white/75"
              >
                Full name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                minLength={2}
                maxLength={60}
                required
                placeholder="Your name"
                className="w-full rounded-xl border border-white/10 bg-[#0B0B0D] px-4 py-3.5 text-sm text-[#F5F2E9] outline-none transition placeholder:text-white/25 hover:border-white/20 focus:border-[#D6A84B]/60 focus:ring-2 focus:ring-[#D6A84B]/10"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-white/75"
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                maxLength={254}
                required
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/10 bg-[#0B0B0D] px-4 py-3.5 text-sm text-[#F5F2E9] outline-none transition placeholder:text-white/25 hover:border-white/20 focus:border-[#D6A84B]/60 focus:ring-2 focus:ring-[#D6A84B]/10"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-white/75"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                maxLength={128}
                required
                placeholder="Create a password"
                className="w-full rounded-xl border border-white/10 bg-[#0B0B0D] px-4 py-3.5 text-sm text-[#F5F2E9] outline-none transition placeholder:text-white/25 hover:border-white/20 focus:border-[#D6A84B]/60 focus:ring-2 focus:ring-[#D6A84B]/10"
              />

              <p className="mt-2 text-[11px] text-white/30">
                Use at least 8 characters.
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-white/75"
              >
                Confirm password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                maxLength={128}
                required
                placeholder="Enter your password again"
                className="w-full rounded-xl border border-white/10 bg-[#0B0B0D] px-4 py-3.5 text-sm text-[#F5F2E9] outline-none transition placeholder:text-white/25 hover:border-white/20 focus:border-[#D6A84B]/60 focus:ring-2 focus:ring-[#D6A84B]/10"
              />
            </div>

            {result && (
              <p
                role="status"
                className={`rounded-xl border px-4 py-3 text-sm ${
                  result.success
                    ? "border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-300"
                    : "border-red-400/20 bg-red-400/[0.07] text-red-300"
                }`}
              >
                {result.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#D6A84B] px-5 py-3.5 text-sm font-bold text-[#17130B] shadow-[0_8px_30px_rgba(214,168,75,0.12)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#E6BD69] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Creating account..." : "Create your account"}
              {!isPending && <span aria-hidden="true">↗</span>}
            </button>
          </form>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/8" />
            <span className="text-[10px] font-medium tracking-wider text-white/30">
              ALREADY A MEMBER?
            </span>
            <div className="h-px flex-1 bg-white/8" />
          </div>

          <p className="text-center text-sm text-white/45">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#E6BD69] transition hover:text-[#F0D18A]"
            >
              Log in
            </Link>
          </p>
        </section>

        <p className="mt-7 text-center text-xs text-white/25">
          Your next debugging adventure starts here.
        </p>
      </div>
    </main>
  );
}
