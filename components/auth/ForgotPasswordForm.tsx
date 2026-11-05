"use client";

import { useState, useTransition, type FormEvent } from "react";
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
    <div className="w-full max-w-md space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Forgot password?</h1>
        <p className="mt-2 text-sm text-gray-400">
          Enter your registered email address. If an account exists, we&apos;ll
          send you a password reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            required
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        {message && (
          <p
            role="status"
            className={`text-sm ${success ? "text-green-400" : "text-red-400"}`}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium transition hover:bg-blue-500 disabled:opacity-60"
        >
          {isPending ? "Sending..." : "Send reset link"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-400">
        Remember your password?{" "}
        <Link href="/login" className="text-blue-400 hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}
