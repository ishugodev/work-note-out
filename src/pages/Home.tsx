import { useEffect, useState } from "react";

import { SideMenu } from "@/components/SideMenu";
import { WorkoutPlan } from "@/components/WorkoutPlan";
import useWorkout from "@/hooks/useWorkout";

import { NavigatorBar } from "../components/NavigatorBar";

export function Home() {
  const { workoutData } = useWorkout();
  const [todayWorkouts, setTodayWorkouts] = useState<WorkoutPlan[]>([]);

  useEffect(() => {
    if (!workoutData || !workoutData.weeklyPlans.length) return;

    const today = new Date()
      .toLocaleDateString("en-US", { weekday: "short" })
      .toLowerCase()
      .slice(0, 3) as Weekday;

    const resolvedIndex = workoutData.currentIndexWeek;

    const currentPlan = workoutData.weeklyPlans[resolvedIndex];

    const workoutIdsForToday = currentPlan?.days?.[today]?.workoutId || [];

    const allTodayWorkouts = workoutData.plannedWorkouts.filter((workout) =>
      workoutIdsForToday.includes(workout.id)
    );

    setTodayWorkouts(allTodayWorkouts);
  }, [workoutData]);

  return (
    <div className="max-h-full min-h-screen bg-zinc-100 p-5 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
      <div className="mx-auto mb-32 mt-8 max-w-screen-sm">
        <SideMenu />
        <h1 className="mb-4 text-2xl font-semibold">Your workout</h1>
        <p className="mb-2 font-medium text-zinc-500 dark:text-zinc-400">
          <span>
            {new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
              new Date()
            )}
            ,&nbsp;
          </span>
          <span>{new Date().toLocaleDateString()}</span>
        </p>
        {workoutData.weeklyPlans.length > 1 && (
          <p className="mb-2">{workoutData.currentIndexWeek + 1}º week</p>
        )}

        <section className="grid gap-3">
          {todayWorkouts.length > 0 ? (
            todayWorkouts.map((workout) => (
              <WorkoutPlan
                key={workout.id}
                planId={workout.id}
                mode="working"
              />
            ))
          ) : (
            <p>No workout planned for today.</p>
          )}
        </section>
      </div>

      <NavigatorBar />
    </div>
  );
}
