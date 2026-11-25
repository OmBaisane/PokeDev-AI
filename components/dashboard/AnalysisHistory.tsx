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
  low: "border-amber-400/20 bg-amber-400/[0.07] text-amber-300",
  medium: "border-sky-400/20 bg-sky-400/[0.07] text-sky-300",
  high: "border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-300",
};

export default function AnalysisHistory() {
  const [history, setHistory] = useState<HistoryResponse | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  async function handleDelete(item: HistoryItem) {
    if (
      !window.confirm(
        "Delete this analysis and its original code snapshot permanently?",
      )
    ) {
      return;
    }

    setDeletingId(item.id);
    setDeleteError("");

    try {
      const response = await fetch(`/api/ai/history/${item.id}`, {
        method: "DELETE",
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Unable to delete this analysis.");
      }

      if (!history) return;

      const remainingItems = history.items.filter(
        (historyItem) => historyItem.id !== item.id,
      );

      const newTotal = Math.max(0, history.pagination.total - 1);

      if (remainingItems.length === 0 && page > 1) {
        setIsLoading(true);
        setPage((current) => current - 1);
      } else {
        setHistory({
          ...history,
          items: remainingItems,
          pagination: {
            ...history.pagination,
            total: newTotal,
            totalPages: Math.ceil(newTotal / history.pagination.pageSize),
          },
        });
      }
    } catch (err) {
      setDeleteError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="mt-10">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D6A84B]">
            Your saved analyses
          </p>

          <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#F5F2E9] sm:text-3xl">
            Analysis History
          </h2>

          <p className="mt-2 text-sm leading-6 text-white/40">
            Revisit your previous debugging sessions and learning progress.
          </p>
        </div>

        {history && (
          <span className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/2.5 px-3.5 py-2 text-xs font-semibold text-white/50">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D6A84B]" />
            {history.pagination.total}{" "}
            {history.pagination.total === 1 ? "analysis" : "analyses"}
          </span>
        )}
      </div>

      {isLoading && (
        <div
          role="status"
          className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-white/8 bg-[#111113]"
        >
          <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-[#D6A84B]/15 border-t-[#D6A84B]" />

          <p className="mt-5 text-sm text-white/45">
            Loading your analysis history...
          </p>
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-3xl border border-red-400/20 bg-red-400/4.5 p-6 sm:p-8">
          <p className="text-sm font-semibold text-red-300">
            Unable to load your history
          </p>

          <p role="alert" className="mt-2 text-sm leading-6 text-red-200/60">
            {error}
          </p>

          <button
            type="button"
            onClick={retry}
            className="mt-5 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-sm font-semibold text-white/75 transition hover:border-[#D6A84B]/30 hover:bg-[#D6A84B]/6 hover:text-[#E6BD69]"
          >
            Try again
          </button>
        </div>
      )}

      {!isLoading && !error && history && history.items.length === 0 && (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-[#111113] px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#D6A84B]/15 bg-[#D6A84B]/5 text-3xl">
            <span aria-hidden="true">📚</span>
          </div>

          <h3 className="mt-5 text-lg font-bold text-[#F5F2E9]">
            No saved analyses yet
          </h3>

          <p className="mt-2 max-w-sm text-sm leading-6 text-white/40">
            Your completed AI debugging sessions will appear here. Start your
            first analysis and build your learning history.
          </p>

          <Link
            href="/dashboard/debug-lab"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#D6A84B] px-5 py-3 text-sm font-bold text-[#17130B] transition hover:bg-[#E6BD69]"
          >
            Open AI Debug Lab
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}

      {!isLoading && !error && history && history.items.length > 0 && (
        <>
          {deleteError && (
            <p
              role="alert"
              className="mb-4 rounded-xl border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300"
            >
              {deleteError}
            </p>
          )}

          <div className="space-y-4">
            {history.items.map((item) => (
              <article
                key={item.id}
                className="group rounded-3xl border border-white/8 bg-[#111113] p-5 transition duration-300 hover:border-[#D6A84B]/25 hover:bg-[#131316] sm:p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-[#D6A84B]/20 bg-[#D6A84B]/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#E6BD69]">
                      {languageLabels[item.language]}
                    </span>

                    <span
                      className={`rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${confidenceStyles[item.confidence]}`}
                    >
                      {item.confidence} confidence
                    </span>
                  </div>

                  <time
                    dateTime={item.createdAt}
                    className="text-xs text-white/30"
                  >
                    {new Date(item.createdAt).toLocaleString()}
                  </time>
                </div>

                <h3 className="mt-5 text-base font-semibold leading-7 text-[#F5F2E9]">
                  {item.summary}
                </h3>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/6 pt-4">
                  <Link
                    href={`/dashboard/history/${item.id}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#D6A84B] transition hover:text-[#E6BD69]"
                  >
                    View analysis details
                    <span
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    disabled={deletingId !== null}
                    aria-label={`Delete analysis: ${item.summary}`}
                    className="rounded-lg border border-red-400/15 bg-red-400/[0.035] px-3 py-2 text-xs font-semibold text-red-300/75 transition hover:border-red-400/30 hover:bg-red-400/8 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {deletingId === item.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </article>
            ))}
          </div>

          {history.pagination.totalPages > 1 && (
            <div className="mt-7 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/[0.07] bg-[#111113] p-4">
              <button
                type="button"
                disabled={page <= 1 || deletingId !== null}
                onClick={() => {
                  setIsLoading(true);
                  setPage((current) => current - 1);
                }}
                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white/65 transition hover:border-[#D6A84B]/30 hover:text-[#E6BD69] disabled:cursor-not-allowed disabled:opacity-30"
              >
                ← Previous
              </button>

              <span className="text-xs font-medium tabular-nums text-white/40">
                Page {history.pagination.page} of{" "}
                {history.pagination.totalPages}
              </span>

              <button
                type="button"
                disabled={
                  page >= history.pagination.totalPages || deletingId !== null
                }
                onClick={() => {
                  setIsLoading(true);
                  setPage((current) => current + 1);
                }}
                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white/65 transition hover:border-[#D6A84B]/30 hover:text-[#E6BD69] disabled:cursor-not-allowed disabled:opacity-30"
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
