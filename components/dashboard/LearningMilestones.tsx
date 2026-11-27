"use client";

import { useCallback, useEffect, useState } from "react";
import ProgressCelebration from "@/components/dashboard/ProgressCelebration";
import { useProgressCelebration } from "@/components/dashboard/useProgressCelebration";

type Milestone = {
  id: string;
  title: string;
  description: string;
  requirement: string;
  category: "analysis" | "challenge" | "combined";
  target: number;
  reward: number;
  completed: boolean;
  eligible: boolean;
};

type MilestoneResponse = {
  milestones: Milestone[];
  progress: {
    completedAnalyses: number;
    completedChallenges: number;
  };
  completedMilestones: number;
};

async function fetchMilestoneData(): Promise<MilestoneResponse> {
  const response = await fetch("/api/milestones", {
    cache: "no-store",
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Unable to load milestones.");
  }

  return result;
}

function getCurrentProgress(
  milestone: Milestone,
  progress: MilestoneResponse["progress"],
) {
  switch (milestone.category) {
    case "analysis":
      return progress.completedAnalyses;
    case "challenge":
      return progress.completedChallenges;
    case "combined":
      return progress.completedAnalyses + progress.completedChallenges;
  }
}

export default function LearningMilestones() {
  const [data, setData] = useState<MilestoneResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  const { celebration, showProgressCelebration, dismissCelebration } =
    useProgressCelebration();

  const loadMilestones = useCallback(async () => {
    try {
      const result = await fetchMilestoneData();
      setData(result);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load learning milestones.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial loading is kept inside the async effect callback.
  useEffect(() => {
    let cancelled = false;

    async function loadInitialMilestones() {
      try {
        const result = await fetchMilestoneData();

        if (!cancelled) {
          setData(result);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load learning milestones.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadInitialMilestones();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleClaim(milestoneId: string) {
    try {
      setClaimingId(milestoneId);
      setFeedback("");
      setError("");

      const response = await fetch("/api/milestones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ milestoneId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to claim reward.");
      }

      if (!result.alreadyCompleted) {
        showProgressCelebration(result);
      }

      setFeedback(
        result.alreadyCompleted
          ? "This milestone has already been completed."
          : `Milestone completed! You earned ${result.xpAwarded} XP.`,
      );

      await loadMilestones();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to claim milestone reward.",
      );
    } finally {
      setClaimingId(null);
    }
  }

  const totalMilestones = data?.milestones.length ?? 0;
  const completedCount = data?.completedMilestones ?? 0;
  const completionPercentage =
    totalMilestones > 0
      ? Math.min(100, (completedCount / totalMilestones) * 100)
      : 0;

  return (
    <section className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-[#D6A84B]/20 bg-linear-to-br from-[#191714] via-[#111113] to-[#101014] p-6 sm:p-9">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#D6A84B]/[0.07] blur-3xl" />

        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#D6A84B]">
            Your learning journey
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Learning Milestones
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">
            Complete real development activities, unlock milestones and earn XP
            to help your Pokémon grow stronger.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/[0.07] bg-black/20 p-4">
              <p className="text-xs text-white/40">Completed milestones</p>
              <p className="mt-2 text-2xl font-bold text-white">
                {loading ? "—" : `${completedCount}/${totalMilestones}`}
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-black/20 p-4">
              <p className="text-xs text-white/40">AI analyses</p>
              <p className="mt-2 text-2xl font-bold text-white">
                {loading ? "—" : (data?.progress.completedAnalyses ?? 0)}
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-black/20 p-4">
              <p className="text-xs text-white/40">Challenges solved</p>
              <p className="mt-2 text-2xl font-bold text-white">
                {loading ? "—" : (data?.progress.completedChallenges ?? 0)}
              </p>
            </div>
          </div>

          <div className="mt-7">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-semibold text-white/55">
                Overall milestone progress
              </span>
              <span className="font-bold text-[#E6BD69]">
                {loading ? "—" : `${Math.round(completionPercentage)}%`}
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full bg-linear-to-r from-[#B98932] to-[#F0D28B] transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.07] px-4 py-3 text-sm text-emerald-300"
        >
          {feedback}
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-400/20 bg-red-400/[0.07] px-4 py-3 text-sm text-red-300"
        >
          {error}
          <button
            type="button"
            onClick={() => void loadMilestones()}
            className="ml-3 font-semibold underline underline-offset-4"
          >
            Retry
          </button>
        </div>
      )}

      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D6A84B]">
            Progression rewards
          </p>
          <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
            Your Milestone Collection
          </h2>
        </div>
        <span className="shrink-0 text-xs text-white/35">100 XP each</span>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-52 animate-pulse rounded-2xl border border-white/6 bg-white/2.5"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {data?.milestones.map((milestone, index) => {
            const current = getCurrentProgress(milestone, data.progress);
            const percentage = Math.min(
              100,
              (current / milestone.target) * 100,
            );
            const isClaiming = claimingId === milestone.id;

            return (
              <article
                key={milestone.id}
                className={`rounded-2xl border p-5 transition ${
                  milestone.completed
                    ? "border-emerald-400/20 bg-emerald-400/[0.035]"
                    : milestone.eligible
                      ? "border-[#D6A84B]/30 bg-[#D6A84B]/[0.035]"
                      : "border-white/[0.07] bg-[#111113]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${
                        milestone.completed
                          ? "bg-emerald-400/10 text-emerald-300"
                          : milestone.eligible
                            ? "bg-[#D6A84B]/10 text-[#E6BD69]"
                            : "bg-white/5 text-white/45"
                      }`}
                    >
                      {milestone.completed
                        ? "✓"
                        : milestone.eligible
                          ? "★"
                          : "◇"}
                    </div>

                    <div>
                      <h3 className="font-bold text-white">
                        {milestone.title}
                      </h3>
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-white/35">
                        Milestone {String(index + 1).padStart(2, "0")}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                      milestone.completed
                        ? "bg-emerald-400/10 text-emerald-300"
                        : milestone.eligible
                          ? "bg-[#D6A84B]/10 text-[#E6BD69]"
                          : "bg-white/5 text-white/40"
                    }`}
                  >
                    {milestone.completed
                      ? "COMPLETED"
                      : milestone.eligible
                        ? "UNLOCKED"
                        : "LOCKED"}
                  </span>
                </div>

                <p className="mt-5 min-h-10 text-sm leading-5 text-white/55">
                  {milestone.description}
                </p>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <p className="text-xs text-white/45">
                    {milestone.requirement}
                  </p>
                  <p className="shrink-0 text-sm font-bold text-[#E6BD69]">
                    +{milestone.reward} XP
                  </p>
                </div>

                <div className="mt-3">
                  <div className="mb-2 flex justify-between text-[10px] text-white/40">
                    <span>Progress</span>
                    <span>
                      {Math.min(current, milestone.target)}/{milestone.target}
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        milestone.completed ? "bg-emerald-400" : "bg-[#D6A84B]"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                <div className="mt-5">
                  {milestone.completed ? (
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                      <span>✓</span>
                      Reward claimed successfully
                    </div>
                  ) : milestone.eligible ? (
                    <button
                      type="button"
                      onClick={() => void handleClaim(milestone.id)}
                      disabled={claimingId !== null}
                      className="w-full rounded-xl bg-[#D6A84B] px-4 py-3 text-sm font-bold text-[#15120B] transition hover:bg-[#E6BD69] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isClaiming ? "Claiming reward..." : "Claim 100 XP"}
                    </button>
                  ) : (
                    <div className="rounded-xl border border-white/6 bg-white/2.5 px-4 py-3 text-center text-xs font-semibold text-white/35">
                      Complete the requirement to unlock
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <ProgressCelebration
        celebration={celebration}
        onClose={dismissCelebration}
      />
    </section>
  );
}
