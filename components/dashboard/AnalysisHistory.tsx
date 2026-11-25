"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type HistoryItem = {
  id: string;
  language: "javascript" | "typescript" | "python";
  summary: string;
  confidence: "low" | "medium" | "high";
  createdAt: string;
};

type HistoryResponse = {
  items: HistoryItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

const languageLabels: Record<HistoryItem["language"], string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
};

const confidenceStyles: Record<HistoryItem["confidence"], string> = {
  low: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  medium: "border-blue-400/20 bg-blue-400/10 text-blue-300",
  high: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
};

export default function AnalysisHistory() {
  const [history, setHistory] = useState<HistoryResponse | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const retry = useCallback(() => {
    setIsLoading(true);
    setRetryCount((count) => count + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchHistory() {
      try {
        const response = await fetch(`/api/ai/history?page=${page}`, {
          cache: "no-store",
          signal: controller.signal,
        });

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error || "Unable to load analysis history.");
        }

        if (!controller.signal.aborted) {
          setHistory(payload.data);
          setError("");
        }
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void fetchHistory();
    return () => controller.abort();
  }, [page, retryCount]);

  return (
    <section className="mt-10">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
            Your saved analyses
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Analysis History
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Revisit your previous debugging sessions and learning progress.
          </p>
        </div>

        {history && (
          <p className="text-sm text-gray-500">
            {history.pagination.total}{" "}
            {history.pagination.total === 1 ? "analysis" : "analyses"}
          </p>
        )}
      </div>

      {isLoading && (
        <div
          role="status"
          className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#101522]"
        >
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-400/20 border-t-blue-400" />
          <p className="mt-4 text-sm text-gray-400">
            Loading your analysis history...
          </p>
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-6">
          <p role="alert" className="text-sm text-red-300">
            {error}
          </p>
          <button
            type="button"
            onClick={retry}
            className="mt-4 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-gray-200 transition hover:border-blue-400/40 hover:bg-blue-400/10"
          >
            Try again
          </button>
        </div>
      )}

      {!isLoading && !error && history && history.items.length === 0 && (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#101522] px-6 text-center">
          <span className="text-4xl" aria-hidden="true">
            📚
          </span>
          <h3 className="mt-4 text-lg font-bold text-gray-200">
            No saved analyses yet
          </h3>
          <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
            Your completed AI debugging sessions will appear here. Start your
            first analysis and build your learning history.
          </p>
          <Link
            href="/dashboard/debug-lab"
            className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-500"
          >
            Open AI Debug Lab
          </Link>
        </div>
      )}

      {!isLoading && !error && history && history.items.length > 0 && (
        <>
          <div className="space-y-4">
            {history.items.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-white/10 bg-[#101522] p-5 transition hover:border-blue-400/30 sm:p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-xs font-semibold text-blue-300">
                      {languageLabels[item.language]}
                    </span>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase ${confidenceStyles[item.confidence]}`}
                    >
                      {item.confidence} confidence
                    </span>
                  </div>

                  <time
                    dateTime={item.createdAt}
                    className="text-xs text-gray-500"
                  >
                    {new Date(item.createdAt).toLocaleString()}
                  </time>
                </div>

                <h3 className="mt-4 text-base font-semibold leading-7 text-gray-100">
                  {item.summary}
                </h3>

                <Link
                  href={`/dashboard/history/${item.id}`}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-400 transition hover:text-cyan-300"
                >
                  View analysis details
                  <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>

          {history.pagination.totalPages > 1 && (
            <div className="mt-7 flex items-center justify-between gap-4">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => {
                  setIsLoading(true);
                  setPage((current) => current - 1);
                }}
                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-gray-300 transition hover:border-blue-400/40 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← Previous
              </button>

              <span className="text-sm tabular-nums text-gray-400">
                Page {history.pagination.page} of{" "}
                {history.pagination.totalPages}
              </span>

              <button
                type="button"
                disabled={page >= history.pagination.totalPages}
                onClick={() => {
                  setIsLoading(true);
                  setPage((current) => current + 1);
                }}
                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-gray-300 transition hover:border-blue-400/40 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
