import * as Dialog from "@radix-ui/react-dialog";
import { CircleCheck } from "lucide-react";

import useWorkout from "@/hooks/useWorkout";

import { Card } from "./Card";
import { Modal } from "./Modal";

interface WeekWorkoutProps {
  id: string;
  focusedId?: string;
  plan: WeeklyPlan;
  onClick?: (id: string) => void;
  toggleWorkout: (day: Weekday, workoutId: string) => void;
}

export function WeekWorkout({
  id,
  plan,
  onClick,
  toggleWorkout,
}: WeekWorkoutProps) {
  const { workoutData } = useWorkout();

  const handleToggleWorkout = (day: Weekday, workoutId: string) => {
    toggleWorkout(day, workoutId);
  };

  return (
    <div className="flex flex-col gap-2" onClick={() => onClick?.(id)}>
      {(["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as Weekday[]).map(
        (day) => {
          const currentDay = plan.days[day];

          return (
            <Modal
              key={day}
              trigger={
                <Card className="flex cursor-pointer p-2 text-sm">
                  <span className="w-1/5 capitalize text-zinc-600 dark:text-zinc-400">
                    {day}
                  </span>
                  {currentDay?.workoutId?.length ? (
                    <div className="break-all dark:text-zinc-100">
                      {currentDay?.workoutId
                        .map(
                          (id) =>
                            workoutData.plannedWorkouts.find((w) => w.id === id)
                              ?.name
                        )
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                  ) : (
                    <div className="text-zinc-600 dark:text-zinc-400">
                      Click to add workout plan
                    </div>
                  )}
                </Card>
              }
            >
              <Dialog.Title className="text-xl capitalize">{day}</Dialog.Title>

              <div className="mt-3 grid grid-cols-2 gap-2">
                {workoutData.plannedWorkouts.length > 0 ? (
                  workoutData.plannedWorkouts.map((workout) => {
                    const isSelected = plan.days[day]?.workoutId.includes(
                      workout.id
                    );
                    return (
                      <Card
                        key={workout.id}
                        className={`flex cursor-pointer justify-between rounded-lg text-zinc-800 dark:text-zinc-100 bg-zinc-300 p-1.5 dark:bg-zinc-700`}
                        onClick={() => handleToggleWorkout(day, workout.id)}
                      >
                        <p className="w-4/5 break-words">{workout.name}</p>
                        {isSelected && (
                          <CircleCheck className="text-green-600 dark:text-green-500" />
                        )}
                      </Card>
                    );
                  })
                ) : (
                  <p className="dark:text-zinc-400">No workout planned</p>
                )}
              </div>
            </Modal>
          );
        }
      )}
    </div>
  );
}
