import { Button } from "@/components/Button";
import { NavigatorBar } from "@/components/NavigatorBar";
import { WeekWorkout } from "@/components/WeekWorkout";
import { Plus } from "lucide-react";
import useWorkout from "@/hooks/useWorkout";
import { useState } from "react";
import { WorkoutPlan } from "@/components/WorkoutPlan";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export function Workout() {
  const { workoutData, addWeeklyPlan, editWeeklyPlan, removeWeeklyPlan } = useWorkout();
  const [focusedWeekId, setFocusedWeekId] = useState('');

  const handleAddWeeklyPlan = () => {
    addWeeklyPlan();
  };

  const handleRemoveWeeklyPlan = (planId: string) => {
    const confirmDelete = confirm("Do you want to delete the week that you selected?");
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
    <div className="p-5 min-h-screen bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
      <div id="workout" className="mt-8 max-w-screen-lg mx-auto mb-32">
        <h1 className="text-2xl mb-4 font-semibold">Workout</h1>

        <p className="text-zinc-500 mb-2 dark:text-zinc-400">Week plans</p>
        <div className="grid gap-3">
          {workoutData.weeklyPlans.length > 0 ? (
            workoutData.weeklyPlans.map((plan, index) => {
              return (
                <div key={plan.id}>
                  {workoutData.weeklyPlans.length > 1 && (
                    <div className="flex justify-between items-center mb-2">
                      <p>{index + 1}º week</p>
                      <Button className="text-red-500 cursor-pointer" onClick={() => handleRemoveWeeklyPlan(plan.id)}>
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
            <p className="text-zinc-500 dark:text-zinc-400">No weekly plans yet.</p>
          )}
        </div>

        <Button
          className="flex justify-center items-center gap-2 w-full px-3 py-2 mt-4 bg-zinc-800 text-zinc-400 rounded-xl"
          onClick={handleAddWeeklyPlan}
        >
          <Plus size={16} />
          <span>Add week</span>
        </Button>

        <p className="text-zinc-500 mt-6 mb-4 dark:text-zinc-400">Workout plan</p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workoutData.plannedWorkouts.length > 0 ? (
            workoutData.plannedWorkouts.map((plan) => (
              <WorkoutPlan key={plan.id} planId={plan.id} mode="view" />
            ))
          ) : (
            <p className="text-zinc-500 dark:text-zinc-400">No workout plans yet.</p>
          )}
        </div>

        <Button
          className="flex justify-center items-center gap-2 w-full px-3 py-2 mt-6 bg-zinc-800 text-zinc-400 rounded-xl"
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
