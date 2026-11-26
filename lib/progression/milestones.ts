import "server-only";

export const LEARNING_MILESTONES = [
  {
    id: "first-analysis",
    title: "First Analysis",
    description: "Complete your first AI code analysis.",
    requirement: "Complete 1 AI analysis",
    category: "analysis",
    target: 1,
  },
  {
    id: "analysis-apprentice",
    title: "Analysis Apprentice",
    description: "Build your debugging skills through repeated AI analyses.",
    requirement: "Complete 5 AI analyses",
    category: "analysis",
    target: 5,
  },
  {
    id: "first-challenge",
    title: "First Challenge",
    description: "Solve your first coding challenge.",
    requirement: "Complete 1 coding challenge",
    category: "challenge",
    target: 1,
  },
  {
    id: "challenge-explorer",
    title: "Challenge Explorer",
    description: "Keep sharpening your skills by solving more challenges.",
    requirement: "Complete 5 coding challenges",
    category: "challenge",
    target: 5,
  },
  {
    id: "dedicated-developer",
    title: "Dedicated Developer",
    description: "Build consistency across analysis and coding practice.",
    requirement: "Complete 10 combined activities",
    category: "combined",
    target: 10,
  },
] as const;

export type LearningMilestone = (typeof LEARNING_MILESTONES)[number];

export function isMilestoneEligible(
  milestone: LearningMilestone,
  progress: {
    completedAnalyses: number;
    completedChallenges: number;
  },
): boolean {
  switch (milestone.category) {
    case "analysis":
      return progress.completedAnalyses >= milestone.target;

    case "challenge":
      return progress.completedChallenges >= milestone.target;

    case "combined":
      return (
        progress.completedAnalyses + progress.completedChallenges >=
        milestone.target
      );
  }
}
