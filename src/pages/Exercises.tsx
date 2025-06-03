import { Search } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { NavigatorBar } from "@/components/NavigatorBar";
import { SideMenu } from "@/components/SideMenu";
import useWorkout from "@/hooks/useWorkout";

export function Exercises() {
  const [search, setSearch] = useState("");
  const { workoutData } = useWorkout();

  return (
    <div className="max-h-full min-h-screen bg-zinc-100 p-5 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
      <div
        id="exercises"
        className="mx-auto mb-32 mt-8 max-w-screen-sm animate-pageFadeIn"
      >
        <SideMenu />
        <h1 className="mb-4 text-2xl">Exercises</h1>

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
          {workoutData.exercises
            .filter((exercise) =>
              exercise.name.toLowerCase().includes(search.toLowerCase())
            )
            .map(
              (exercise) =>
                exercise.type === "reps" && (
                  <Card
                    key={exercise.id}
                    className="flex items-center justify-between gap-2 px-3 py-2"
                  >
                    <span className="max-w-[70%] hyphens-auto break-all">
                      {exercise.name}
                    </span>
                    <span className="w-full flex-1 border-b-[1px] border-b-zinc-400 dark:border-b-zinc-600" />
                    <span>{exercise.kg} kg</span>
                  </Card>
                )
            )}
        </div>
      </div>

      <NavigatorBar />
    </div>
  );
}
