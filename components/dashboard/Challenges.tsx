"use client";

import { useEffect, useMemo, useState } from "react";
import ProgressCelebration from "@/components/dashboard/ProgressCelebration";
import { useProgressCelebration } from "@/components/dashboard/useProgressCelebration";

type Language = "javascript" | "typescript" | "python";
type Difficulty = "beginner" | "intermediate" | "advanced";

type Challenge = {
  id: string;
  language: Language;
  difficulty: Difficulty;
  title: string;
  type: "output" | "debug" | "implementation";
  prompt: string;
  code: string;
  options: readonly string[];
};

type SubmissionResult = {
  correct?: boolean;
  alreadyCompleted?: boolean;
  xpAwarded?: number;
  totalXp?: number;
  pokemonName?: string | null;
  pokemonXp?: number;
  level?: number;
  evolutionStage?: number;
  explanation?: string;
  previousLevel?: number;
  previousEvolutionStage?: number;
  error?: string;
  message?: string;
};

const languageLabels: Record<Language, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
};

const difficultyLabels: Record<Difficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export default function Challenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [language, setLanguage] = useState<"all" | Language>("all");
  const [difficulty, setDifficulty] = useState<"all" | Difficulty>("all");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, SubmissionResult>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [loadError, setLoadError] = useState("");

  const { celebration, showProgressCelebration, dismissCelebration } =
    useProgressCelebration();

  useEffect(() => {
    let active = true;

    async function loadChallenges() {
      try {
        const response = await fetch("/api/challenges");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not load challenges.");
        }

        if (active) {
          setChallenges(data.challenges);
        }
      } catch (error) {
        if (active) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Could not load challenges.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadChallenges();

    return () => {
      active = false;
    };
  }, []);

  const filteredChallenges = useMemo(
    () =>
      challenges.filter(
        (challenge) =>
          (language === "all" || challenge.language === language) &&
          (difficulty === "all" || challenge.difficulty === difficulty),
      ),
    [challenges, language, difficulty],
  );

  async function submitAnswer(challenge: Challenge) {
    const answer = answers[challenge.id];

    if (!answer || submitting) {
      return;
    }

    setSubmitting(challenge.id);
    setResults((current) => {
      const next = { ...current };
      delete next[challenge.id];
      return next;
    });

    try {
      const response = await fetch("/api/challenges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          challengeId: challenge.id,
          answer,
        }),
      });

      const data: SubmissionResult = await response.json();

      if (response.ok || response.status === 409) {
        if (response.ok && data.correct && !data.alreadyCompleted) {
          showProgressCelebration(data);
        }
        setResults((current) => ({
          ...current,
          [challenge.id]: data,
        }));
      } else {
        setResults((current) => ({
          ...current,
          [challenge.id]: {
            correct: false,
            error: data.error || "Incorrect answer. Try again.",
          },
        }));
      }
    } catch {
      setResults((current) => ({
        ...current,
        [challenge.id]: {
          error: "Network error. Please try again.",
        },
      }));
    } finally {
      setSubmitting(null);
    }
  }

  return (
    <section>
      <div className="mb-8 flex flex-col gap-5 rounded-2xl border border-[#D6A84B]/15 bg-[#111113] p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D6A84B]">
            Practice arena
          </p>
          <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
            Choose your next challenge
          </h2>
          <p className="mt-2 text-sm text-white/45">
            Learn by solving problems, one challenge at a time.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:min-w-80">
          <label className="text-xs text-white/45">
            Language
            <select
              value={language}
              onChange={(event) =>
                setLanguage(event.target.value as "all" | Language)
              }
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#1A1A20] px-3 py-3 text-sm text-white outline-none focus:border-[#D6A84B]/60"
            >
              <option value="all">All languages</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
            </select>
          </label>

          <label className="text-xs text-white/45">
            Difficulty
            <select
              value={difficulty}
              onChange={(event) =>
                setDifficulty(event.target.value as "all" | Difficulty)
              }
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#1A1A20] px-3 py-3 text-sm text-white outline-none focus:border-[#D6A84B]/60"
            >
              <option value="all">All levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </label>
        </div>
      </div>

      {loading && (
        <p className="py-12 text-center text-sm text-white/45">
          Loading challenges...
        </p>
      )}

      {!loading && loadError && (
        <div className="rounded-xl border border-red-400/20 bg-red-400/5 p-5 text-sm text-red-300">
          {loadError}
        </div>
      )}

      {!loading && !loadError && filteredChallenges.length === 0 && (
        <p className="py-12 text-center text-sm text-white/45">
          No challenges match these filters.
        </p>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        {filteredChallenges.map((challenge, index) => {
          const result = results[challenge.id];
          const isSubmitting = submitting === challenge.id;
          const completed = result?.correct === true;

          const xpReward = {
            beginner: 25,
            intermediate: 50,
            advanced: 75,
          }[challenge.difficulty];

          return (
            <article
              key={challenge.id}
              className="rounded-2xl border border-white/10 bg-[#111113] p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D6A84B]">
                  Challenge {String(index + 1).padStart(2, "0")}
                </span>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-semibold text-white/55">
                    {languageLabels[challenge.language]}
                  </span>
                  <span className="rounded-full border border-[#D6A84B]/20 bg-[#D6A84B]/6 px-3 py-1 text-[10px] font-semibold text-[#E6BD69]">
                    {difficultyLabels[challenge.difficulty]}
                  </span>
                </div>
              </div>

              <h3 className="mt-5 text-lg font-bold text-white">
                {challenge.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/55">
                {challenge.prompt}
              </p>

              <pre className="mt-5 overflow-x-auto rounded-xl border border-white/[0.07] bg-[#09090C] p-4 text-xs leading-6 text-[#E6BD69]">
                <code>{challenge.code}</code>
              </pre>

              <div className="mt-5 space-y-2.5">
                {challenge.options.map((option, optionIndex) => {
                  const selected = answers[challenge.id] === option;

                  return (
                    <label
                      key={option}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition ${
                        selected
                          ? "border-[#D6A84B]/50 bg-[#D6A84B]/[0.07] text-white"
                          : "border-white/[0.07] bg-white/1.5 text-white/65 hover:border-white/20"
                      } ${completed ? "cursor-default" : ""}`}
                    >
                      <input
                        type="radio"
                        name={challenge.id}
                        value={option}
                        checked={selected}
                        disabled={completed || isSubmitting}
                        onChange={() =>
                          setAnswers((current) => ({
                            ...current,
                            [challenge.id]: option,
                          }))
                        }
                        className="mt-0.5 accent-[#D6A84B]"
                      />
                      <span className="min-w-0 wrap-break-word">
                        <span className="mr-2 text-xs text-white/30">
                          {String.fromCharCode(65 + optionIndex)}.
                        </span>
                        {option}
                      </span>
                    </label>
                  );
                })}
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-semibold text-[#E6BD69]">
                  +{xpReward} XP
                </span>

                <button
                  type="button"
                  disabled={!answers[challenge.id] || isSubmitting || completed}
                  onClick={() => void submitAnswer(challenge)}
                  className="rounded-xl bg-[#D6A84B] px-5 py-2.5 text-xs font-bold text-[#17130B] transition hover:bg-[#E6BD69] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isSubmitting
                    ? "Checking..."
                    : completed
                      ? "Completed"
                      : "Submit answer"}
                </button>
              </div>

              {result && (
                <div
                  aria-live="polite"
                  className={`mt-5 rounded-xl border p-4 ${
                    result.correct
                      ? "border-emerald-400/20 bg-emerald-400/5"
                      : "border-red-400/20 bg-red-400/5"
                  }`}
                >
                  <p
                    className={`text-sm font-bold ${
                      result.correct ? "text-emerald-300" : "text-red-300"
                    }`}
                  >
                    {result.alreadyCompleted
                      ? "Already completed"
                      : result.correct
                        ? `Correct! +${result.xpAwarded ?? 0} XP`
                        : "Not quite. Try again."}
                  </p>

                  {result.error && (
                    <p className="mt-2 text-xs leading-5 text-red-200/75">
                      {result.error}
                    </p>
                  )}

                  {result.message && (
                    <p className="mt-2 text-xs leading-5 text-white/60">
                      {result.message}
                    </p>
                  )}

                  {result.explanation && (
                    <p className="mt-3 text-xs leading-6 text-white/65">
                      {result.explanation}
                    </p>
                  )}

                  {result.correct && result.pokemonName && (
                    <p className="mt-2 text-xs text-[#E6BD69]">
                      {result.pokemonName} gained {result.pokemonXp} XP. Level{" "}
                      {result.level}.
                    </p>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>

      <ProgressCelebration
        celebration={celebration}
        onClose={dismissCelebration}
      />
    </section>
  );
}
