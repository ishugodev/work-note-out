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
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
        <label htmlFor="planName" className="text-zinc-400">
          Workout plan name
        </label>
        <input
          id="planName"
          type="text"
          className="bg-zinc-700 rounded-md p-1.5"
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
              className="bg-zinc-700 p-1.5 rounded-full"
            />

            <div className="flex items-center gap-0.5 w-full">
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
                    className="bg-zinc-700 flex rounded-md p-0.5 w-6 h-9 text-right"
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
                    className="bg-zinc-700 flex rounded-md p-0.5 w-6 h-9 text-right"
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
                    className="bg-zinc-700 flex rounded-md p-1.5 w-8 text-right appearance-none"
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
                className="bg-zinc-700 rounded-md p-1.5 min-w-24 w-full"
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
                    className="bg-zinc-700 flex rounded-md p-1.5 max-w-10 text-right"
                  />
                  <span>kg</span>
                </>
              )}

              <div
                className="flex items-center text-red-500"
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
          className="bg-zinc-700 text-zinc-400 flex justify-center p-2 rounded-md"
        >
          <Plus />
          <span>Add exercise</span>
        </Button>

        {isCreating && (
          <div className="flex justify-end">
            <Button
              className="bg-green-600 text-zinc-800 rounded-full p-2"
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
      <strong className="text-xl font-normal">{title}</strong>
      {exercises.map((exercise) => (
        <WorkoutLine key={exercise.id} data={exercise} readonly checkbox />
      ))}
    </Card>
  ) : (
    <Card
      onClick={handleEditPlan}
      className="flex flex-col gap-3 p-2 cursor-pointer"
    >
      <strong className="text-xl font-normal">{title}</strong>
      {exercises.map((exercise) => (
        <WorkoutLine key={exercise.id} data={exercise} readonly />
      ))}
    </Card>
  );
}
