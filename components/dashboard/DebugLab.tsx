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

  const fieldClassName =
    "w-full rounded-xl border border-white/[0.09] bg-[#0B0B0D] px-4 py-3 text-sm text-[#F5F2E9] outline-none transition placeholder:text-white/25 focus:border-[#D6A84B]/60 focus:ring-2 focus:ring-[#D6A84B]/10";

  const labelClassName = "mb-2 block text-sm font-semibold text-white/75";

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
      <section className="rounded-[1.75rem] border border-white/8 bg-[#111113] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.18)] sm:p-7">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D6A84B]">
            Debug workspace
          </p>

          <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#F5F2E9]">
            Analyze your code
          </h2>

          <p className="mt-2 text-sm leading-6 text-white/40">
            Share your code, error message, or debugging context to understand
            what might be going wrong.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="language" className={labelClassName}>
              Programming language
            </label>

            <select
              id="language"
              value={language}
              onChange={(event) => setLanguage(event.target.value as Language)}
              className={fieldClassName}
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
            </select>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label htmlFor="code" className={labelClassName + " mb-0"}>
                Your code
              </label>

              <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30">
                Optional
              </span>
            </div>

            <textarea
              id="code"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              maxLength={20_000}
              rows={9}
              placeholder={"function greet() {\n  console.log(message);\n}"}
              spellCheck={false}
              className={`${fieldClassName} resize-y font-mono text-[13px] leading-6`}
            />

            <p className="mt-2 text-right text-[11px] tabular-nums text-white/30">
              {code.length.toLocaleString()} / 20,000 characters
            </p>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label
                htmlFor="errorMessage"
                className={labelClassName + " mb-0"}
              >
                Error message
              </label>

              <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30">
                Optional
              </span>
            </div>

            <textarea
              id="errorMessage"
              value={errorMessage}
              onChange={(event) => setErrorMessage(event.target.value)}
              maxLength={5_000}
              rows={3}
              placeholder="Paste your error message here..."
              className={`${fieldClassName} resize-y leading-6`}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label
                htmlFor="additionalContext"
                className={labelClassName + " mb-0"}
              >
                Additional context
              </label>

              <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30">
                Optional
              </span>
            </div>

            <textarea
              id="additionalContext"
              value={additionalContext}
              onChange={(event) => setAdditionalContext(event.target.value)}
              maxLength={5_000}
              rows={3}
              placeholder="What were you trying to achieve? When does the issue occur?"
              className={`${fieldClassName} resize-y leading-6`}
            />
          </div>

          <div className="flex gap-3 rounded-xl border border-[#D6A84B]/15 bg-[#D6A84B]/4.5 p-4">
            <span className="mt-0.5 shrink-0 text-[#D6A84B]" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-4 w-4"
              >
                <path
                  d="M12 9v4m0 4h.01M10.3 3.9 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3l-7.5-13.1a2 2 0 0 0-3.4 0Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>

            <p className="text-xs leading-6 text-[#E6BD69]/75">
              Privacy reminder: Never submit passwords, API keys, access tokens,
              personal information, or sensitive proprietary code.
            </p>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-400/20 bg-red-400/6 p-3 text-sm leading-6 text-red-300"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#D6A84B] px-5 py-4 text-sm font-bold text-[#17130B] shadow-[0_8px_25px_rgba(214,168,75,0.12)] transition hover:bg-[#E6BD69] hover:shadow-[0_8px_30px_rgba(214,168,75,0.2)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#17130B]/25 border-t-[#17130B]" />
                Analyzing your code...
              </>
            ) : (
              <>
                Analyze with PokeDev AI
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </>
            )}
          </button>
        </form>
      </section>

      <section className="rounded-[1.75rem] border border-white/8 bg-[#111113] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.18)] sm:p-7">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D6A84B]">
            AI analysis
          </p>

          <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#F5F2E9]">
            Debug insights
          </h2>
        </div>

        {!result && !isLoading && (
          <div className="mt-7 flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#0B0B0D]/50 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#D6A84B]/15 bg-[#D6A84B]/6 text-3xl">
              <span aria-hidden="true">⌕</span>
            </div>

            <h3 className="mt-5 font-semibold text-white/80">
              Your analysis will appear here
            </h3>

            <p className="mt-2 max-w-xs text-sm leading-6 text-white/35">
              Submit your debugging information and your coding companion will
              help investigate the issue.
            </p>
          </div>
        )}

        {isLoading && (
          <div
            role="status"
            className="mt-7 flex min-h-80 flex-col items-center justify-center rounded-2xl border border-white/6 bg-[#0B0B0D]/50 text-center"
          >
            <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-[#D6A84B]/15 border-t-[#D6A84B]" />

            <p className="mt-5 font-semibold text-white/80">
              Your companion is thinking...
            </p>

            <p className="mt-2 text-sm text-white/35">
              Examining your debugging information.
            </p>
          </div>
        )}

        {result && (
          <div className="mt-7 space-y-6">
            {analysisId && (
              <div className="rounded-xl border border-[#D6A84B]/20 bg-[#D6A84B]/5 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#E6BD69]">
                      Analysis saved successfully
                    </p>

                    <p className="mt-1 text-xs leading-5 text-white/40">
                      Your result and original snapshot are saved.
                    </p>
                  </div>

                  <Link
                    href={`/dashboard/history/${analysisId}`}
                    className="rounded-lg border border-[#D6A84B]/20 bg-[#D6A84B]/10 px-3 py-2 text-xs font-bold text-[#E6BD69] transition hover:bg-[#D6A84B]/20"
                  >
                    View saved analysis →
                  </Link>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-[#D6A84B]/20 bg-[#D6A84B]/5 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D6A84B]">
                Summary
              </p>

              <p className="mt-3 text-sm leading-7 text-white/80">
                {result.summary}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#F5F2E9]">Likely cause</h3>

              <p className="mt-2 text-sm leading-7 text-white/50">
                {result.likelyCause}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#F5F2E9]">Evidence</h3>

              <ul className="mt-3 space-y-3">
                {result.evidence.map((item, index) => (
                  <li
                    key={index}
                    className="flex gap-3 text-sm leading-6 text-white/50"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D6A84B]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#F5F2E9]">
                Suggested fix
              </h3>

              <pre className="mt-3 overflow-x-auto whitespace-pre-wrap wrap-break-word rounded-xl border border-white/[0.07] bg-[#0B0B0D] p-4 font-mono text-[12px] leading-6 text-[#E6BD69]/85">
                {result.suggestedFix}
              </pre>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#F5F2E9]">
                Verification steps
              </h3>

              <ol className="mt-3 space-y-3">
                {result.verificationSteps.map((step, index) => (
                  <li
                    key={index}
                    className="flex gap-3 text-sm leading-6 text-white/50"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-[#D6A84B]/20 bg-[#D6A84B]/6 text-[10px] font-bold text-[#D6A84B]">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#F5F2E9]">Limitations</h3>

              <p className="mt-2 text-sm leading-7 text-white/50">
                {result.limitations}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#0B0B0D] p-4">
              <span className="text-sm font-semibold text-white/60">
                Confidence level
              </span>

              <span className="rounded-full border border-[#D6A84B]/20 bg-[#D6A84B]/8 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#E6BD69]">
                {result.confidence}
              </span>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
