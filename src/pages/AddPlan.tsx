import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { GoBack } from "@/components/GoBack";
import { NavigatorBar } from "@/components/NavigatorBar";
import { WorkoutPlan } from "@/components/WorkoutPlan";

export function AddPlan() {
  const [nextPlanId, setNextPlanId] = useState<string>("");

  useEffect(() => {
    setNextPlanId(uuidv4());
  }, []);

  return (
    <div className="max-h-full min-h-screen bg-zinc-100 p-5 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
      <div className="mx-auto mb-32 mt-8 max-w-screen-sm">
        <GoBack url="/workout" />
        <div id="addPlan" className="mb-32 mt-8">
          <h1 className="mb-4 text-2xl">Add workout plan</h1>

          <WorkoutPlan planId={nextPlanId} mode="create" />
        </div>

        <NavigatorBar />
      </div>
    </div>
  );
}
