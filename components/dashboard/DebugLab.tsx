"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import type { DebugAnalysisResponse } from "@/lib/ai/schemas";

type Language = "javascript" | "typescript" | "python";

export default function DebugLab() {
  const [language, setLanguage] = useState<Language>("javascript");
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");

  const [result, setResult] = useState<DebugAnalysisResponse | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!code.trim() && !errorMessage.trim() && !additionalContext.trim()) {
      setError("Please provide code, an error message, or additional context.");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult(null);
    setAnalysisId(null);

    try {
      const response = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language,
          code,
          errorMessage,
          additionalContext,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Analysis failed. Please try again.");
      }

      if (typeof payload.analysisId !== "string") {
        throw new Error(
          "Analysis was saved, but its history link is unavailable.",
        );
      }

      setResult(payload.data);
      setAnalysisId(payload.analysisId);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-2xl border border-white/10 bg-[#101522] p-5 sm:p-7">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-400">
            Debug workspace
          </p>
          <h2 className="mt-2 text-2xl font-bold">Analyze your code</h2>
          <p className="mt-2 text-sm leading-6 text-gray-400">
            Share your code, error message, or debugging context to understand
            what might be going wrong.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <div>
            <label
              htmlFor="language"
              className="mb-2 block text-sm font-semibold text-gray-300"
            >
              Programming language
            </label>

            <select
              id="language"
              value={language}
              onChange={(event) => setLanguage(event.target.value as Language)}
              className="w-full rounded-xl border border-white/10 bg-[#080b14] px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400"
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="code"
              className="mb-2 block text-sm font-semibold text-gray-300"
            >
              Your code
              <span className="ml-2 font-normal text-gray-500">Optional</span>
            </label>

            <textarea
              id="code"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              maxLength={20_000}
              rows={9}
              placeholder={"function greet() {\n  console.log(message);\n}"}
              spellCheck={false}
              className="w-full resize-y rounded-xl border border-white/10 bg-[#080b14] px-4 py-3 font-mono text-sm leading-6 text-gray-200 outline-none transition placeholder:text-gray-600 focus:border-blue-400"
            />

            <p className="mt-1 text-right text-xs text-gray-500">
              {code.length.toLocaleString()} / 20,000 characters
            </p>
          </div>

          <div>
            <label
              htmlFor="errorMessage"
              className="mb-2 block text-sm font-semibold text-gray-300"
            >
              Error message
              <span className="ml-2 font-normal text-gray-500">Optional</span>
            </label>

            <textarea
              id="errorMessage"
              value={errorMessage}
              onChange={(event) => setErrorMessage(event.target.value)}
              maxLength={5_000}
              rows={3}
              placeholder="Paste your error message here..."
              className="w-full resize-y rounded-xl border border-white/10 bg-[#080b14] px-4 py-3 text-sm leading-6 text-gray-200 outline-none transition placeholder:text-gray-600 focus:border-blue-400"
            />
          </div>

          <div>
            <label
              htmlFor="additionalContext"
              className="mb-2 block text-sm font-semibold text-gray-300"
            >
              Additional context
              <span className="ml-2 font-normal text-gray-500">Optional</span>
            </label>

            <textarea
              id="additionalContext"
              value={additionalContext}
              onChange={(event) => setAdditionalContext(event.target.value)}
              maxLength={5_000}
              rows={3}
              placeholder="What were you trying to achieve? When does the issue occur?"
              className="w-full resize-y rounded-xl border border-white/10 bg-[#080b14] px-4 py-3 text-sm leading-6 text-gray-200 outline-none transition placeholder:text-gray-600 focus:border-blue-400"
            />
          </div>

          <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
            <p className="text-xs leading-6 text-amber-200/80">
              Privacy reminder: Never submit passwords, API keys, access tokens,
              personal information, or sensitive proprietary code.
            </p>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-sm text-red-300"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Analyzing your code..." : "Analyze with PokeDev AI"}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#101522] p-5 sm:p-7">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
          AI analysis
        </p>

        <h2 className="mt-2 text-2xl font-bold">Debug insights</h2>

        {!result && !isLoading && (
          <div className="mt-7 flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 px-6 text-center">
            <div className="text-4xl">🔍</div>
            <h3 className="mt-4 font-semibold text-gray-300">
              Your analysis will appear here
            </h3>
            <p className="mt-2 max-w-xs text-sm leading-6 text-gray-500">
              Submit your debugging information and your coding companion will
              help investigate the issue.
            </p>
          </div>
        )}

        {isLoading && (
          <div
            role="status"
            className="mt-7 flex min-h-80 flex-col items-center justify-center text-center"
          >
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-400/20 border-t-blue-400" />
            <p className="mt-5 font-semibold text-gray-300">
              Your companion is thinking...
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Examining your debugging information.
            </p>
          </div>
        )}

        {result && (
          <div className="mt-7 space-y-5">
            {analysisId && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4">
                <div>
                  <p className="text-sm font-semibold text-emerald-300">
                    Analysis saved successfully
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Your result and original snapshot are saved.
                  </p>
                </div>

                <Link
                  href={`/dashboard/history/${analysisId}`}
                  className="rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-300 transition hover:bg-emerald-500/20"
                >
                  View saved analysis →
                </Link>
              </div>
            )}

            <div className="rounded-xl border border-blue-400/20 bg-blue-400/5 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-300">
                Summary
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-200">
                {result.summary}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white">Likely cause</h3>
              <p className="mt-2 text-sm leading-6 text-gray-400">
                {result.likelyCause}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white">Evidence</h3>
              <ul className="mt-2 list-inside list-disc space-y-2 text-sm leading-6 text-gray-400">
                {result.evidence.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white">Suggested fix</h3>
              <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-[#080b14] p-4 font-mono text-sm leading-6 text-gray-300">
                {result.suggestedFix}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-white">Verification steps</h3>
              <ol className="mt-2 list-inside list-decimal space-y-2 text-sm leading-6 text-gray-400">
                {result.verificationSteps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>

            <div>
              <h3 className="font-semibold text-white">Limitations</h3>
              <p className="mt-2 text-sm leading-6 text-gray-400">
                {result.limitations}
              </p>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#080b14] p-4">
              <span className="text-sm font-semibold text-gray-300">
                Confidence level
              </span>
              <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-xs font-bold uppercase text-blue-300">
                {result.confidence}
              </span>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
