"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

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

const confidenceStyles: Record<
  AnalysisDetailData["result"]["confidence"],
  string
> = {
  low: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  medium: "border-[#D6A84B]/25 bg-[#D6A84B]/10 text-[#E6BD69]",
  high: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
};

const panelClass = "rounded-2xl border border-white/8 bg-[#111113] p-5 sm:p-7";

const codeClass =
  "mt-4 overflow-x-auto whitespace-pre-wrap wrap-break-words rounded-xl border border-white/8 bg-[#09090B] p-4 font-mono text-sm leading-7 text-[#D4D4D8]";

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-lg font-bold tracking-tight text-[#F5F2E9]">
      {children}
    </h2>
  );
}

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
      isDeleting ||
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
        className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-white/8 bg-[#111113]"
      >
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#D6A84B]/20 border-t-[#D6A84B]" />

        <p className="mt-4 text-sm text-[#A1A1AA]">
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
          className="mt-5 inline-flex text-sm font-semibold text-[#E6BD69] transition hover:text-[#F5D58C]"
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
    <div className="space-y-6 sm:space-y-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-[#D6A84B]/25 bg-[#D6A84B]/10 px-3 py-1.5 text-xs font-semibold text-[#E6BD69]">
            {languageLabels[analysis.language]}
          </span>

          <time
            dateTime={analysis.createdAt}
            className="text-xs text-[#71717A]"
          >
            {new Date(analysis.createdAt).toLocaleString()}
          </time>
        </div>

        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          aria-label="Delete this analysis and its original snapshot"
          className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:border-red-400/40 hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-50"
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

      <section className="rounded-2xl border border-[#D6A84B]/20 bg-linear-to-br from-[#D6A84B]/9 to-transparent p-5 sm:p-7">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#D6A84B]" />

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E6BD69]">
            Analysis summary
          </p>
        </div>

        <p className="mt-4 text-sm leading-7 text-[#E4E4E7]">
          {result.summary}
        </p>
      </section>

      <section className={panelClass}>
        <SectionHeading>Likely cause</SectionHeading>

        <p className="mt-3 text-sm leading-7 text-[#A1A1AA]">
          {result.likelyCause}
        </p>
      </section>

      <section className={panelClass}>
        <SectionHeading>Evidence</SectionHeading>

        <ul className="mt-4 space-y-3">
          {result.evidence.map((item, index) => (
            <li
              key={index}
              className="flex gap-3 text-sm leading-7 text-[#A1A1AA]"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D6A84B]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={panelClass}>
        <SectionHeading>Suggested fix</SectionHeading>

        <pre className={codeClass}>{result.suggestedFix}</pre>
      </section>

      <section className={panelClass}>
        <SectionHeading>Verification steps</SectionHeading>

        <ol className="mt-4 space-y-4">
          {result.verificationSteps.map((step, index) => (
            <li
              key={index}
              className="flex gap-3 text-sm leading-7 text-[#A1A1AA]"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-[#D6A84B]/20 bg-[#D6A84B]/10 text-xs font-bold text-[#E6BD69]">
                {index + 1}
              </span>

              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className={panelClass}>
        <SectionHeading>Limitations</SectionHeading>

        <p className="mt-3 text-sm leading-7 text-[#A1A1AA]">
          {result.limitations}
        </p>
      </section>

      <section className={panelClass}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionHeading>Original input snapshot</SectionHeading>

          <span className="rounded-full border border-white/10 bg-white/3 px-3 py-1 text-[11px] font-medium text-[#A1A1AA]">
            Saved input
          </span>
        </div>

        <div className="mt-5 space-y-6">
          {snapshot.code && (
            <div>
              <h3 className="text-sm font-semibold text-[#E4E4E7]">
                Original code
              </h3>

              <pre className={codeClass}>{snapshot.code}</pre>
            </div>
          )}

          {snapshot.errorMessage && (
            <div>
              <h3 className="text-sm font-semibold text-[#E4E4E7]">
                Original error message
              </h3>

              <pre className={codeClass}>{snapshot.errorMessage}</pre>
            </div>
          )}

          {snapshot.additionalContext && (
            <div>
              <h3 className="text-sm font-semibold text-[#E4E4E7]">
                Additional context
              </h3>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-[#A1A1AA]">
                {snapshot.additionalContext}
              </p>
            </div>
          )}
        </div>

        {!snapshot.code &&
          !snapshot.errorMessage &&
          !snapshot.additionalContext && (
            <p className="mt-3 text-sm text-[#71717A]">
              No original input snapshot was saved.
            </p>
          )}
      </section>

      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/8 bg-[#111113] p-5">
        <div>
          <p className="text-sm font-semibold text-[#F5F2E9]">
            Confidence level
          </p>

          <p className="mt-1 text-xs text-[#71717A]">
            AI-estimated confidence for this analysis
          </p>
        </div>

        <span
          className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider ${confidenceStyles[result.confidence]}`}
        >
          {result.confidence}
        </span>
      </section>
    </div>
  );
}
