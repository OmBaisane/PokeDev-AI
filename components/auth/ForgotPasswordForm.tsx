"use client";

import { useState, useTransition, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";

import { forgotPassword } from "@/app/actions/auth";

export default function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await forgotPassword({
        email: formData.get("email"),
      });

      setMessage(result.message);
      setSuccess(result.success);
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
              ACCOUNT RECOVERY
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#F5F2E9] sm:text-4xl">
              Forgot your
              <span className="mt-1 block text-[#D6A84B]">password?</span>
            </h1>

            <p className="mt-4 text-sm leading-7 text-white/45">
              Enter your registered email address. If an account exists,
              we&apos;ll send you a password reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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

            {message && (
              <p
                role="status"
                className={`rounded-xl border px-4 py-3 text-sm ${
                  success
                    ? "border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-300"
                    : "border-red-400/20 bg-red-400/[0.07] text-red-300"
                }`}
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D6A84B] px-5 py-3.5 text-sm font-bold text-[#17130B] shadow-[0_8px_30px_rgba(214,168,75,0.12)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#E6BD69] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Sending..." : "Send reset link"}
              {!isPending && <span aria-hidden="true">↗</span>}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-white/45">
            Remember your password?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#E6BD69] transition hover:text-[#F0D18A]"
            >
              Back to login
            </Link>
          </p>
        </section>

        <p className="mt-7 text-center text-xs text-white/25">
          Your account security matters.
        </p>
      </div>
    </main>
  );
}
