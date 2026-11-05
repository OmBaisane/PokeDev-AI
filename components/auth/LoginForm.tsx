"use client";

import { useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { loginUser } from "@/app/actions/auth";

export default function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const input = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    startTransition(async () => {
      const result = await loginUser(input);
      setMessage(result.message);

      if (result.success) {
        router.push("/dashboard");
        router.refresh();
      }
    });
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="mt-2 text-sm text-gray-400">
          Log in to continue your PokeDev AI journey.
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

        <div>
          <label htmlFor="password" className="mb-2 block text-sm">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            maxLength={128}
            required
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div className="text-right">
          <Link
            href="/forgot-password"
            className="text-sm text-blue-400 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {message && (
          <p role="status" className="text-sm text-red-400">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium transition hover:bg-blue-500 disabled:opacity-60"
        >
          {isPending ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-400">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-blue-400 hover:underline">
          Create account
        </Link>
      </p>
    </div>
  );
}
