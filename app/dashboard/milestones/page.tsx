import { Suspense } from "react";
import { connection } from "next/server";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import LearningMilestones from "@/components/dashboard/LearningMilestones";
import { requireVerifiedUser } from "@/lib/auth/permissions";

function MilestonesLoading() {
  return (
    <div className="space-y-8">
      <div className="h-72 animate-pulse rounded-3xl border border-white/10 bg-white/3" />
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-52 animate-pulse rounded-2xl border border-white/10 bg-white/3"
          />
        ))}
      </div>
    </div>
  );
}

async function MilestonesContent() {
  await connection();
  const user = await requireVerifiedUser();

  return (
    <>
      <DashboardHeader userName={user.name} activePage="milestones" />
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <LearningMilestones />
      </main>
    </>
  );
}

export default function MilestonesPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white">
      <Suspense fallback={<MilestonesLoading />}>
        <MilestonesContent />
      </Suspense>
    </div>
  );
}
