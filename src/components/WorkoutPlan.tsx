import { Check, Plus, Repeat2, Timer, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import useWorkout from "@/hooks/useWorkout";

import { Button } from "./Button";
import { Card } from "./Card";
import { ModeToggle } from "./ModeToggle";
import { WorkoutLine } from "./WorkoutLine";


interface WorkoutPlanProps {
  mode: "create" | "edit" | "view" | "working";
  planId: string;
}

export function WorkoutPlan({ mode, planId }: WorkoutPlanProps) {
  const { workoutData, addExercise, removeExercise, addWorkout, editWorkout } =
    useWorkout();
  const [title, setTitle] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const navigate = useNavigate();

  const isCreating = mode === "create";
  const isEditing = mode === "edit";
  const isViewing = mode === "view";
  const isWorking = mode === "working";

  useEffect(() => {
    if (!isCreating) {
      const plan = workoutData.plannedWorkouts.find(
        (workout) => workout.id === planId
      );
      if (plan) {
        setTitle(plan.name);
        setExercises(plan.exercises);
      }
    }
  }, [planId, workoutData.plannedWorkouts, isCreating]);

  useEffect(() => {
    if (isEditing) {
      const plan = workoutData.plannedWorkouts.find(
        (workout) => workout.id === planId
      );

      if (plan) {
        setTitle(plan.name);
        setExercises(plan.exercises);
      }
    }
  }, [planId, workoutData.plannedWorkouts, isEditing]);

  function handleEditPlanName(name: string) {
    setTitle(name);

    if (isEditing) {
      const plan = workoutData.plannedWorkouts.find(
        (plan) => plan.id === planId
      );
      if (!plan) return;

      const updatedPlan: WorkoutPlan = { ...plan, name };
      editWorkout(planId, updatedPlan);
    }
  }

  function handleAddExercise() {
    const newExercise: Exercise = {
      id: String(Date.now()),
      type: "reps",
      name: "",
      sets: 0,
      min: 0,
      sec: 0,
      reps: 0,
      kg: 0,
      restTime: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setExercises((prev) => {
      const updatedExercises = [...prev, newExercise];

      if (isEditing) {
        const updatedPlan = workoutData.plannedWorkouts.find(
          (plan) => plan.id === planId
        );
        if (updatedPlan) {
          const newPlan = { ...updatedPlan, exercises: updatedExercises };
          editWorkout(planId, newPlan);
        }
      }

      return updatedExercises;
    });
  }

  function handleEditExercise(index: number, updatedExercise: Exercise) {
    const updatedExercises = [...exercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      ...updatedExercise,
    };
    setExercises(updatedExercises);

    if (isEditing) {
      const updatedPlan = workoutData.plannedWorkouts.find(
        (plan) => plan.id === planId
      );
      if (updatedPlan) {
        const updatedPlanExercises = updatedPlan.exercises.map(
          (exercise: Exercise) =>
            exercise.id === updatedExercise.id
              ? { ...exercise, ...updatedExercise }
              : exercise
        );

        const newPlan = { ...updatedPlan, exercises: updatedPlanExercises };
        editWorkout(planId, newPlan);
      }
    }
  }

  function handleRemoveExercise(index: number) {
    setExercises((prev) => prev.filter((_, i) => i !== index));
    removeExercise(exercises[index].id);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const updatedWorkoutPlan: WorkoutPlan = {
      id: planId || uuidv4(),
      name: title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      exercises,
    };

    if (isCreating) {
      exercises.forEach((exercise) => addExercise(exercise));
      addWorkout(updatedWorkoutPlan);
      alert("Workout plan added successfully!");
      navigate("/workout");
    }
  }

  function toggleMode(index: number) {
    setExercises((prev) =>
      prev.map((exercise, i) =>
        i === index
          ? { ...exercise, type: exercise.type === "reps" ? "time" : "reps" }
          : exercise
      )
    );
  }

  function handleEditPlan() {
    if (isViewing) {
      navigate(`/workout/editplan/${planId}`);
    }
  }

  return isCreating || isEditing ? (
    <Card className="p-2">
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
        <label htmlFor="planName" className="dark:text-zinc-400">
          Workout plan name
        </label>
        <input
          id="planName"
          type="text"
          className="rounded-md bg-zinc-100 p-1.5 dark:bg-zinc-700"
          value={title}
          onChange={(e) => handleEditPlanName(e.target.value)}
          required
        />

        {exercises.map((exercise, index) => (
          <div className="flex gap-0.5" key={exercise.id}>
            <ModeToggle
              icon1={<Repeat2 />}
              icon2={<Timer />}
              mode={exercise.type}
              onClick={() => toggleMode(index)}
              className="rounded-full bg-zinc-100 p-1.5 dark:bg-zinc-700"
            />

            <div className="flex w-full items-center gap-0.5">
              {exercise.type === "time" ? (
                <>
                  <input
                    type="number"
                    value={exercise.min > 0 ? exercise.min : ""}
                    onChange={(e) =>
                      handleEditExercise(index, {
                        ...exercise,
                        min: Number(e.target.value),
                      })
                    }
                    className="flex h-9 w-6 rounded-md bg-zinc-100 p-0.5 text-right dark:bg-zinc-700"
                  />
                  <span>:</span>
                  <input
                    type="number"
                    value={exercise.sec > 0 ? exercise.sec : ""}
                    onChange={(e) =>
                      handleEditExercise(index, {
                        ...exercise,
                        sec: Number(e.target.value),
                      })
                    }
                    className="flex h-9 w-6 rounded-md bg-zinc-100  p-0.5 text-right dark:bg-zinc-700"
                  />
                </>
              ) : (
                <>
                  <input
                    type="number"
                    value={exercise.reps > 0 ? exercise.reps : ""}
                    onChange={(e) =>
                      handleEditExercise(index, {
                        ...exercise,
                        reps: Number(e.target.value),
                      })
                    }
                    className="flex w-8 appearance-none rounded-md bg-zinc-100 p-1.5 text-right dark:bg-zinc-700"
                  />
                  <span>x</span>
                </>
              )}

              <input
                type="text"
                value={exercise.name}
                onChange={(e) =>
                  handleEditExercise(index, {
                    ...exercise,
                    name: e.target.value,
                  })
                }
                placeholder="Name exercises"
                className="w-full min-w-24 rounded-md bg-zinc-100 p-1.5 dark:bg-zinc-700"
              />

              {exercise.type !== "time" && (
                <>
                  <input
                    type="number"
                    value={exercise.kg > 0 ? exercise.kg : ""}
                    onChange={(e) =>
                      handleEditExercise(index, {
                        ...exercise,
                        kg: Number(e.target.value),
                      })
                    }
                    className="flex max-w-10 rounded-md bg-zinc-100 p-1.5 text-right dark:bg-zinc-700"
                  />
                  <span>kg</span>
                </>
              )}

              <div
                className="flex cursor-pointer items-center text-red-600 dark:text-red-500"
                onClick={() => handleRemoveExercise(index)}
              >
                <X />
              </div>
            </div>
          </div>
        ))}

        <Button
          onClick={handleAddExercise}
          type="button"
          className="flex justify-center rounded-md bg-zinc-100 p-2 dark:bg-zinc-700 dark:text-zinc-400"
        >
          <Plus />
          <span>Add exercise</span>
        </Button>

        {isCreating && (
          <div className="flex justify-end">
            <Button
              className="rounded-full bg-green-400 p-2 text-zinc-100 dark:bg-green-600 dark:text-zinc-800"
              type="submit"
            >
              <Check />
            </Button>
          </div>
        )}
      </form>
    </Card>
  ) : isWorking ? (
    <Card onClick={handleEditPlan} className="flex flex-col gap-3 p-2">
      <strong className="hyphens-auto break-all text-xl font-normal">
        {title}
      </strong>
      {exercises.map((exercise) => (
        <WorkoutLine key={exercise.id} data={exercise} readonly checkbox />
      ))}
    </Card>
  ) : (
    <Card
      onClick={handleEditPlan}
      className="flex cursor-pointer flex-col gap-3 p-2"
    >
      <strong className="hyphens-auto break-all text-xl font-normal">
        {title}
      </strong>
      {exercises.map((exercise) => (
        <WorkoutLine key={exercise.id} data={exercise} readonly />
      ))}
    </Card>
  );
}
