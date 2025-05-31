import { Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/Button";
import { NavigatorBar } from "@/components/NavigatorBar";
import { SideMenu } from "@/components/SideMenu";
import { WeekWorkout } from "@/components/WeekWorkout";
import { WorkoutPlan } from "@/components/WorkoutPlan";
import useWorkout from "@/hooks/useWorkout";

export function Workout() {
  const { workoutData, addWeeklyPlan, editWeeklyPlan, removeWeeklyPlan } =
    useWorkout();
  const [focusedWeekId, setFocusedWeekId] = useState("");

  const handleAddWeeklyPlan = () => {
    addWeeklyPlan();
  };

  const handleRemoveWeeklyPlan = (planId: string) => {
    const confirmDelete = confirm(
      "Do you want to delete the week that you selected?"
    );
    if (confirmDelete) {
      alert("You deleted the week!");
      removeWeeklyPlan(planId);
    }
  };

  const handleSetFocusedWeekId = (id: string) => {
    setFocusedWeekId(id);
  };

  const toggleWorkout = (day: Weekday, workoutId: string) => {
    if (!focusedWeekId) return;

    const plan = workoutData.weeklyPlans.find((p) => p.id === focusedWeekId);
    if (!plan) return;

    const dayData = plan.days[day] ?? { id: uuidv4(), workoutId: [] };

    const updatedDay: WeeklyPlanDay = {
      ...dayData,
      workoutId: dayData.workoutId.includes(workoutId)
        ? dayData.workoutId.filter((id) => id !== workoutId)
        : [...dayData.workoutId, workoutId],
    };

    const clonedPlan = deepCloneWeeklyPlan(plan);
    clonedPlan.days[day] = updatedDay;
    clonedPlan.updatedAt = new Date().toISOString();

    editWeeklyPlan(clonedPlan.id, clonedPlan);
  };

  const deepCloneWeeklyPlan = (plan: WeeklyPlan): WeeklyPlan => {
    const clonedDays: WeeklyPlan["days"] = {};

    for (const [day, data] of Object.entries(plan.days)) {
      clonedDays[day as Weekday] = {
        id: data.id,
        workoutId: [...data.workoutId],
      };
    }

    return {
      id: plan.id,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
      days: clonedDays,
    };
  };

  return (
    <div className="min-h-screen bg-zinc-100 p-5 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
      <div
        id="workout"
        className="mx-auto mb-32 mt-8 max-w-screen-sm animate-pageFadeIn"
      >
        <SideMenu />
        <h1 className="mb-4 text-2xl font-semibold">Workout</h1>

        <p className="mb-2 font-medium text-zinc-600 dark:text-zinc-400">
          Week plans
        </p>
        <div className="grid gap-3">
          {workoutData.weeklyPlans.length > 0 ? (
            workoutData.weeklyPlans.map((plan, index) => {
              return (
                <div key={plan.id}>
                  {workoutData.weeklyPlans.length > 1 && (
                    <div className="mb-2 flex items-center justify-between">
                      <p>{index + 1}º week</p>
                      <Button
                        className="cursor-pointer font-medium text-red-600 dark:text-red-500"
                        onClick={() => handleRemoveWeeklyPlan(plan.id)}
                      >
                        delete week
                      </Button>
                    </div>
                  )}
                  <WeekWorkout
                    key={plan.id}
                    id={plan.id}
                    focusedId={focusedWeekId}
                    plan={plan}
                    onClick={handleSetFocusedWeekId}
                    toggleWorkout={toggleWorkout}
                  />
                </div>
              );
            })
          ) : (
            <p className="text-zinc-500 dark:text-zinc-400">
              No weekly plans yet.
            </p>
          )}
        </div>

        <Button
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-200 px-3 py-2 font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
          onClick={handleAddWeeklyPlan}
        >
          <Plus size={16} />
          <span>Add week</span>
        </Button>

        <p className="mb-4 mt-6 font-medium text-zinc-500 dark:text-zinc-400">
          Workout plan
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workoutData.plannedWorkouts.length > 0 ? (
            workoutData.plannedWorkouts.map((plan) => (
              <WorkoutPlan key={plan.id} planId={plan.id} mode="view" />
            ))
          ) : (
            <p className="text-zinc-500 dark:text-zinc-400">
              No workout plans yet.
            </p>
          )}
        </div>

        <Button
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-200 px-3 py-2 font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
          asChild
        >
          <Link to="/workout/addplan">
            <Plus size={16} />
            <span>Add workout plan</span>
          </Link>
        </Button>
      </div>

      <NavigatorBar />
    </div>
  );
}
