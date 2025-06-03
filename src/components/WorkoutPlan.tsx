import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Check, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import useWorkout from "@/hooks/useWorkout";

import { Button } from "./Button";
import { Card } from "./Card";
import { SortableExerciseItem } from "./SortableExerciseItem";
import { WorkoutLine } from "./WorkoutLine";

interface WorkoutPlanProps {
  mode: "create" | "edit" | "view" | "working";
  planId: string;
}

export function WorkoutPlan({ mode, planId }: WorkoutPlanProps) {
  const {
    workoutData,
    removeExercise,
    addWorkout,
    editWorkout,
    toggleExerciseCheck,
  } = useWorkout();
  const [title, setTitle] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const navigate = useNavigate();

  const isCreating = mode === "create";
  const isEditing = mode === "edit";
  const isViewing = mode === "view";
  const isWorking = mode === "working";

  const sensors = useSensors(useSensor(PointerSensor));

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
    if (isViewing || isWorking) {
      navigate(`/workout/editplan/${planId}`);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = exercises.findIndex((item) => item.id === active.id);
    const newIndex = exercises.findIndex((item) => item.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newExercises = arrayMove(exercises, oldIndex, newIndex);
      setExercises(newExercises);

      if (isEditing) {
        const plan = workoutData.plannedWorkouts.find(
          (plan) => plan.id === planId
        );
        if (plan) {
          const newPlan = { ...plan, exercises: newExercises };
          editWorkout(planId, newPlan);
        }
      }
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

        <DndContext
          sensors={sensors}
          modifiers={[restrictToVerticalAxis]}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={exercises.map((e) => e.id)}
            strategy={verticalListSortingStrategy}
          >
            {exercises.map((exercise, index) => (
              <SortableExerciseItem
                key={exercise.id}
                id={exercise.id}
                exercise={exercise}
                index={index}
                onEdit={handleEditExercise}
                onRemove={handleRemoveExercise}
                onToggleType={toggleMode}
              />
            ))}
          </SortableContext>
        </DndContext>

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
    <Card className="flex flex-col gap-3 p-2">
      <div className="flex items-center justify-between">
        <strong className="hyphens-auto break-all text-xl font-normal">
          {title}
        </strong>
        <Button
          onClick={handleEditPlan}
          className="cursor-pointer rounded-md bg-zinc-300 px-2 dark:bg-zinc-600"
        >
          Edit
        </Button>
      </div>
      {exercises.map((exercise) => (
        <WorkoutLine
          key={exercise.id}
          data={exercise}
          readonly
          checkbox
          isChecked={
            workoutData.checkedTodayWorkouts[
              new Date().toISOString().split("T")[0]
            ]?.includes(exercise.id) || false
          }
          onCheckedChange={() => toggleExerciseCheck(exercise.id)}
        />
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
