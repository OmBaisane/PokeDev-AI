"use client";

import { useRef, useState, useTransition, type FormEvent } from "react";
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
      <div className="w-full max-w-md space-y-4 text-center">
        <h1 className="text-2xl font-bold">Invalid reset link</h1>
        <p className="text-sm text-gray-400">
          This password reset link is missing or invalid.
        </p>
        <Link href="/forgot-password" className="text-blue-400 hover:underline">
          Request another link
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create new password</h1>
        <p className="mt-2 text-sm text-gray-400">
          Choose a strong password for your PokeDev AI account.
        </p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="mb-2 block text-sm">
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
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-2 block text-sm">
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

        {success ? (
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium hover:bg-blue-500"
          >
            Continue to login
          </button>
        ) : (
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium transition hover:bg-blue-500 disabled:opacity-60"
          >
            {isPending ? "Updating..." : "Reset password"}
          </button>
        )}
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
