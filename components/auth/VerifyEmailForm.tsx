"use client";

import { useState, useTransition } from "react";
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

  if (!token) {
    return (
      <div className="w-full max-w-md space-y-4 text-center">
        <h1 className="text-2xl font-bold">Verify your email</h1>

        <p className="text-sm text-gray-400">
          Open your verification link from your email, or request a new one.
        </p>

        <div className="space-y-3 text-left">
          <label htmlFor="resend-email" className="block text-sm">
            Registered email address
          </label>

          <input
            id="resend-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            maxLength={254}
            required
            placeholder="you@example.com"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500"
          />

          <button
            type="button"
            onClick={handleResend}
            disabled={isResending || !email.trim()}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium hover:bg-blue-500 disabled:opacity-60"
          >
            {isResending ? "Sending..." : "Resend verification email"}
          </button>

          {resendMessage && (
            <p role="status" className="text-sm text-gray-400">
              {resendMessage}
            </p>
          )}
        </div>

        <Link
          href="/login"
          className="inline-block text-sm text-blue-400 hover:underline"
        >
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6 text-center">
      <div>
        <h1 className="text-3xl font-bold">Verify your email</h1>
        <p className="mt-2 text-sm text-gray-400">
          One final step before you enter the PokeDev AI world.
        </p>
      </div>

      {message && (
        <p
          role="status"
          className={`rounded-lg border p-3 text-sm ${
            success
              ? "border-green-500/30 bg-green-500/10 text-green-400"
              : "border-red-500/30 bg-red-500/10 text-red-400"
          }`}
        >
          {message}
        </p>
      )}

      {success ? (
        <Link
          href="/login"
          className="inline-block w-full rounded-lg bg-blue-600 px-4 py-3 font-medium hover:bg-blue-500"
        >
          Continue to login
        </Link>
      ) : (
        <button
          type="button"
          onClick={handleVerification}
          disabled={isPending}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium transition hover:bg-blue-500 disabled:opacity-60"
        >
          {isPending ? "Verifying..." : "Verify email"}
        </button>
      )}

      <p className="text-sm text-gray-400">
        Need a new verification link?{" "}
        <Link href="/verify-email" className="text-blue-400 hover:underline">
          Request another
        </Link>
      </p>
    </div>
  );
}
