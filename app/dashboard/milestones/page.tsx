import { connection } from "next/server";
import { getPokemonElementTheme } from "@/lib/pokemon/theme";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import LearningMilestones from "@/components/dashboard/LearningMilestones";
import { requireVerifiedUser } from "@/lib/auth/permissions";

export const instant = false;

export default async function MilestonesPage() {
  await connection();
  const user = await requireVerifiedUser();

  return (
    <main
      data-element-theme={getPokemonElementTheme(user.selectedPokemon)}
      className="min-h-screen bg-[#0B0B0D] text-[#F5F2E9]"
    >
      <DashboardHeader userName={user.name} activePage="milestones" />

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <LearningMilestones />
      </div>
    </main>
  );
}
