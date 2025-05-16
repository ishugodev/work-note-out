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
    <div className="min-h-screen max-h-full p-5 bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
      <GoBack url="/workout" />
      <div id="addPlan" className="mt-8 mb-32">
        <h1 className="text-2xl mb-4">Add workout plan</h1>
        
        <WorkoutPlan planId={nextPlanId} mode="create" />
      </div>

      <NavigatorBar />
    </div>
  );
}
