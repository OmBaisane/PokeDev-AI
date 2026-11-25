"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type AnalysisDetailData = {
  id: string;
  language: "javascript" | "typescript" | "python";
  snapshot: {
    code: string;
    errorMessage: string;
    additionalContext: string;
  };
  result: {
    summary: string;
    likelyCause: string;
    evidence: string[];
    suggestedFix: string;
    verificationSteps: string[];
    limitations: string;
    confidence: "low" | "medium" | "high";
  };
  createdAt: string;
};

type AnalysisDetailProps = {
  id: string;
};

const languageLabels: Record<AnalysisDetailData["language"], string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
};

export default function AnalysisDetail({ id }: AnalysisDetailProps) {
  const router = useRouter();

  const [analysis, setAnalysis] = useState<AnalysisDetailData | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadAnalysis() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/ai/history/${id}`, {
          cache: "no-store",
        });

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error || "Unable to load this analysis.");
        }

        if (!cancelled) {
          setAnalysis(payload.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong. Please try again.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadAnalysis();

    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleDelete() {
    if (
      !analysis ||
      !window.confirm(
        "Delete this analysis and its original code snapshot permanently?",
      )
    ) {
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/ai/history/${id}`, {
        method: "DELETE",
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Unable to delete this analysis.");
      }

      router.push("/dashboard/history");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <div
        role="status"
        className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#101522]"
      >
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-400/20 border-t-blue-400" />
        <p className="mt-4 text-sm text-gray-400">
          Loading your saved analysis...
        </p>
      </div>
    );
  }

  if (error && !analysis) {
    return (
      <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-6">
        <p role="alert" className="text-sm text-red-300">
          {error}
        </p>
        <Link
          href="/dashboard/history"
          className="mt-5 inline-flex text-sm font-semibold text-blue-400 hover:text-cyan-300"
        >
          ← Back to history
        </Link>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  const { result, snapshot } = analysis;

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1.5 text-xs font-semibold text-blue-300">
            {languageLabels[analysis.language]}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(analysis.createdAt).toLocaleString()}
          </span>
        </div>

        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isDeleting ? "Deleting..." : "Delete analysis"}
        </button>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-sm text-red-300"
        >
          {error}
        </p>
      )}

      <section className="rounded-2xl border border-blue-400/20 bg-blue-400/5 p-5 sm:p-7">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-300">
          Summary
        </p>
        <p className="mt-3 text-sm leading-7 text-gray-200">{result.summary}</p>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#101522] p-5 sm:p-7">
        <h2 className="text-lg font-bold">Likely cause</h2>
        <p className="mt-3 text-sm leading-7 text-gray-400">
          {result.likelyCause}
        </p>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#101522] p-5 sm:p-7">
        <h2 className="text-lg font-bold">Evidence</h2>
        <ul className="mt-4 list-inside list-disc space-y-3 text-sm leading-7 text-gray-400">
          {result.evidence.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#101522] p-5 sm:p-7">
        <h2 className="text-lg font-bold">Suggested fix</h2>
        <pre className="mt-4 overflow-x-auto whitespace-pre-wrap wrap-break-words rounded-xl border border-white/10 bg-[#080b14] p-4 font-mono text-sm leading-7 text-gray-300">
          {result.suggestedFix}
        </pre>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#101522] p-5 sm:p-7">
        <h2 className="text-lg font-bold">Verification steps</h2>
        <ol className="mt-4 list-inside list-decimal space-y-3 text-sm leading-7 text-gray-400">
          {result.verificationSteps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#101522] p-5 sm:p-7">
        <h2 className="text-lg font-bold">Limitations</h2>
        <p className="mt-3 text-sm leading-7 text-gray-400">
          {result.limitations}
        </p>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#101522] p-5 sm:p-7">
        <h2 className="text-lg font-bold">Original input snapshot</h2>

        <div className="mt-5 space-y-5">
          {snapshot.code && (
            <div>
              <h3 className="text-sm font-semibold text-gray-300">
                Original code
              </h3>
              <pre className="mt-2 overflow-x-auto whitespace-pre-wrap wrap-break-words rounded-xl border border-white/10 bg-[#080b14] p-4 font-mono text-sm leading-7 text-gray-300">
                {snapshot.code}
              </pre>
            </div>
          )}

          {snapshot.errorMessage && (
            <div>
              <h3 className="text-sm font-semibold text-gray-300">
                Original error message
              </h3>
              <pre className="mt-2 overflow-x-auto whitespace-pre-wrap wrap-break-words rounded-xl border border-white/10 bg-[#080b14] p-4 font-mono text-sm leading-7 text-gray-300">
                {snapshot.errorMessage}
              </pre>
            </div>
          )}

          {snapshot.additionalContext && (
            <div>
              <h3 className="text-sm font-semibold text-gray-300">
                Additional context
              </h3>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-gray-400">
                {snapshot.additionalContext}
              </p>
            </div>
          )}
        </div>

        {!snapshot.code &&
          !snapshot.errorMessage &&
          !snapshot.additionalContext && (
            <p className="mt-3 text-sm text-gray-500">
              No original input snapshot was saved.
            </p>
          )}
      </section>

      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#101522] p-5">
        <div>
          <p className="text-sm font-semibold text-gray-300">
            Confidence level
          </p>
          <p className="mt-1 text-xs text-gray-500">
            AI-estimated confidence for this analysis
          </p>
        </div>

        <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-xs font-bold uppercase text-blue-300">
          {result.confidence}
        </span>
      </section>
    </div>
  );
}
