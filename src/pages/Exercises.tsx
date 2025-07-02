import { Plus, Search } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { NavigatorBar } from "@/components/NavigatorBar";
import { SideMenu } from "@/components/SideMenu";
import useWorkout from "@/hooks/useWorkout";

export function Exercises() {
  const [search, setSearch] = useState("");
  const { workoutData } = useWorkout();

  const groupedExercises = workoutData.exercises
    .filter((exercise) =>
      exercise.name.toLowerCase().includes(search.toLowerCase())
    )
    .reduce(
      (acc, exercise) => {
        const group = exercise.muscleGroup || "Sem grupo";
        if (!acc[group]) acc[group] = [];
        acc[group].push(exercise);
        return acc;
      },
      {} as Record<string, typeof workoutData.exercises>
    );

  function getMaxKg(exercise: Exercise): number {
    if (exercise.setConfig === "simple") {
      return exercise.simpleSet?.kg ?? 0;
    }

    if (exercise.setConfig === "detailed") {
      return Math.max(
        ...(exercise.detailedSets?.map((set) => set.kg ?? 0) ?? [0])
      );
    }

    return 0;
  }

  return (
    <div className="max-h-full min-h-screen bg-zinc-100 p-5 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
      <div
        id="exercises"
        className="mx-auto mb-32 mt-8 max-w-screen-sm animate-pageFadeIn"
      >
        <SideMenu />
        <h1 className="mb-4 animate-titleFadeIn text-2xl">Exercises view</h1>

        <div className="relative mb-4 flex items-center">
          <Button className="absolute -top-12 right-0 rounded-lg bg-zinc-200 px-3 py-2 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            Filter
          </Button>

          <div className="flex w-full items-center">
            <input
              placeholder="Search exercise"
              className="h-12 w-full rounded-xl border-none bg-zinc-200 p-3 text-base placeholder:text-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Search size={24} className="absolute right-3 text-zinc-400" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {Object.entries(groupedExercises).map(([group, exercises]) => (
            <div key={group}>
              <h2 className="mb-1 text-lg font-semibold capitalize">{group}</h2>
              <div className="flex flex-col gap-2">
                {exercises.map(
                  (exercise) =>
                    exercise.type === "reps" && (
                      <Card
                        key={exercise.id}
                        className="flex items-center justify-between gap-2 px-3 py-2"
                      >
                        <span className="max-w-[70%] hyphens-auto break-words">
                          {exercise.name}
                        </span>
                        <span className="w-full flex-1 border-b-[1px] border-b-zinc-400 dark:border-b-zinc-600" />
                        <span>{getMaxKg(exercise)} kg</span>
                      </Card>
                    )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-36 left-0 right-0 z-10 mx-auto flex max-w-screen-sm justify-end px-5">
        <Button className="rounded-full bg-green-400 p-2 text-zinc-100 shadow-[0_0_12px_1px_rgba(0,0,0,0.2)] dark:bg-green-600 dark:text-zinc-900">
          <Plus className="h-10 w-10 text-zinc-100" />
        </Button>
      </div>

      <NavigatorBar />
    </div>
  );
}
