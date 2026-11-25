"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";

import { verifyEmail } from "@/app/actions/auth";
import { resendVerificationEmail } from "@/app/actions/verification";

type VerifyEmailFormProps = {
  token: string;
};

export default function VerifyEmailForm({ token }: VerifyEmailFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isResending, startResending] = useTransition();

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [resendMessage, setResendMessage] = useState("");

  function handleVerification() {
    startTransition(async () => {
      const result = await verifyEmail(token);

      setMessage(result.message);
      setSuccess(result.success);
    });
  }

  function handleResend() {
    startResending(async () => {
      const result = await resendVerificationEmail(email);
      setResendMessage(result.message);
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
              ACCOUNT VERIFICATION
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#F5F2E9] sm:text-4xl">
              Verify your
              <span className="mt-1 block text-[#D6A84B]">email address.</span>
            </h1>

            <p className="mt-4 text-sm leading-7 text-white/45">
              One final step before you enter the PokeDev AI world. Verify your
              email address to continue.
            </p>
          </div>

          {token ? (
            <div className="space-y-5">
              <div className="rounded-2xl border border-[#D6A84B]/15 bg-[#D6A84B]/4.5 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#D6A84B]/20 bg-[#D6A84B]/8 text-xl text-[#E6BD69]">
                    ✉
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white/85">
                      Almost there!
                    </p>
                    <p className="mt-1 text-xs leading-5 text-white/40">
                      Confirm your email to activate your account.
                    </p>
                  </div>
                </div>
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

              {success ? (
                <Link
                  href="/login"
                  className="flex w-full items-center justify-center rounded-xl bg-[#D6A84B] px-5 py-3.5 text-sm font-bold text-[#17130B] transition hover:bg-[#E6BD69]"
                >
                  Continue to login ↗
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleVerification}
                  disabled={isPending}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D6A84B] px-5 py-3.5 text-sm font-bold text-[#17130B] shadow-[0_8px_30px_rgba(214,168,75,0.12)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#E6BD69] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? "Verifying..." : "Verify email"}
                  {!isPending && <span aria-hidden="true">↗</span>}
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              <p className="text-sm leading-7 text-white/50">
                Don&apos;t have your verification link? Enter your registered
                email address and request a new one.
              </p>

              <div>
                <label
                  htmlFor="resend-email"
                  className="mb-2 block text-sm font-medium text-white/75"
                >
                  Registered email address
                </label>

                <input
                  id="resend-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  maxLength={254}
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/10 bg-[#0B0B0D] px-4 py-3.5 text-sm text-[#F5F2E9] outline-none transition placeholder:text-white/25 hover:border-white/20 focus:border-[#D6A84B]/60 focus:ring-2 focus:ring-[#D6A84B]/10"
                />
              </div>

              <button
                type="button"
                onClick={handleResend}
                disabled={isResending || !email.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D6A84B] px-5 py-3.5 text-sm font-bold text-[#17130B] shadow-[0_8px_30px_rgba(214,168,75,0.12)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#E6BD69] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isResending ? "Sending..." : "Resend verification email"}
                {!isResending && <span aria-hidden="true">↗</span>}
              </button>

              {resendMessage && (
                <p
                  role="status"
                  className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white/60"
                >
                  {resendMessage}
                </p>
              )}
            </div>
          )}

          <p className="mt-7 text-center text-sm text-white/45">
            Already verified?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#E6BD69] transition hover:text-[#F0D18A]"
            >
              Log in
            </Link>
          </p>
        </section>

        <p className="mt-7 text-center text-xs text-white/25">
          A verified account is your gateway to PokeDev AI.
        </p>
      </div>
    </main>
  );
}
