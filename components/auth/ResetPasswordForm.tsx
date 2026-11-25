"use client";

import { useRef, useState, useTransition, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { resetPassword } from "@/app/actions/auth";

type ResetPasswordFormProps = {
  token: string;
};

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const input = {
      token,
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    startTransition(async () => {
      const result = await resetPassword(input);

      setMessage(result.message);
      setSuccess(result.success);

      if (result.success) {
        formRef.current?.reset();
        router.refresh();
      }
    });
  }

  if (!token) {
    return (
      <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#0B0B0D] px-5 py-12 text-[#F5F2E9] sm:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-48 left-1/2 h-136 w-136 -translate-x-1/2 rounded-full bg-[#D6A84B]/[0.07] blur-[120px]"
        />

        <section className="relative z-10 w-full max-w-md rounded-4xl border border-white/9 bg-[#111113] p-8 text-center shadow-[0_25px_100px_rgba(0,0,0,0.5)] sm:p-10">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-3"
            aria-label="PokeDev AI home"
          >
            <Image
              src="/branding/pokedev-symbol.png"
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
            <span className="text-lg font-bold">
              PokeDev <span className="text-[#D6A84B]">AI</span>
            </span>
          </Link>

          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/[0.07] text-2xl text-red-300">
            !
          </div>

          <h1 className="text-2xl font-bold">Invalid reset link</h1>

          <p className="mt-3 text-sm leading-7 text-white/45">
            This password reset link is missing or invalid. Request a new link
            to continue.
          </p>

          <Link
            href="/forgot-password"
            className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-[#D6A84B] px-5 py-3.5 text-sm font-bold text-[#17130B] transition hover:bg-[#E6BD69]"
          >
            Request another link
          </Link>
        </section>
      </main>
    );
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
              ACCOUNT SECURITY
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#F5F2E9] sm:text-4xl">
              Create a new
              <span className="mt-1 block text-[#D6A84B]">password.</span>
            </h1>

            <p className="mt-4 text-sm leading-7 text-white/45">
              Choose a strong password to secure your PokeDev AI account.
            </p>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-white/75"
              >
                New password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                maxLength={128}
                required
                placeholder="Enter new password"
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
                Confirm new password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                maxLength={128}
                required
                placeholder="Enter password again"
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

            {success ? (
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="w-full rounded-xl bg-[#D6A84B] px-5 py-3.5 text-sm font-bold text-[#17130B] transition hover:bg-[#E6BD69]"
              >
                Continue to login ↗
              </button>
            ) : (
              <button
                type="submit"
                disabled={isPending}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D6A84B] px-5 py-3.5 text-sm font-bold text-[#17130B] shadow-[0_8px_30px_rgba(214,168,75,0.12)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#E6BD69] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Updating password..." : "Reset password"}
                {!isPending && <span aria-hidden="true">↗</span>}
              </button>
            )}
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
          Keep your account safe.
        </p>
      </div>
    </main>
  );
}
