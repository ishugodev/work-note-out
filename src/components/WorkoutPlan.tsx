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

import { useMuscleGroupDetector } from "@/hooks/useMuscleGroupDetector";
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
    toggleSetConfig,
  } = useWorkout();
  const detectMuscleGroup = useMuscleGroupDetector();
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
      muscleGroup: "",
      min: 0,
      sec: 0,
      setConfig: "simple",
      repsRange: false,
      simpleSet: {
        sets: 0,
        reps: 0,
        kg: 0,
      },
      detailedSets: [
        {
          setType: "normal",
          reps: 0,
          kg: 0,
        },
      ],
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

    const newName = updatedExercise.name;
    const detectedGroup = detectMuscleGroup(newName);
    const prevGroup = updatedExercises[index].muscleGroup;

    updatedExercises[index] = {
      ...updatedExercises[index],
      ...updatedExercise,
      muscleGroup:
        detectedGroup !== "desconhecido" && detectedGroup !== ""
          ? detectedGroup
          : prevGroup,
    };

    setExercises(updatedExercises);

    if (isEditing) {
      const updatedPlan = workoutData.plannedWorkouts.find(
        (plan) => plan.id === planId
      );
      if (updatedPlan) {
        const updatedPlanExercises = updatedExercises;

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

    const updatedExercises = exercises.map((exercise) => ({
      ...exercise,
      muscleGroup: detectMuscleGroup(exercise.name),
      updatedAt: new Date().toISOString(),
    }));

    const updatedWorkoutPlan: WorkoutPlan = {
      id: planId || uuidv4(),
      name: title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      exercises: updatedExercises,
    };

    if (isCreating) {
      addWorkout(updatedWorkoutPlan);
      alert("Workout plan added successfully!");
      navigate("/workout");
    }
  }

  function handleToggleMode(index: number) {
    setExercises((prev) =>
      prev.map((exercise, i) =>
        i === index
          ? { ...exercise, type: exercise.type === "reps" ? "time" : "reps" }
          : exercise
      )
    );
  }

  function handleToggleSetConfig(index: number) {
    if (isCreating) {
      setExercises((prev) =>
        prev.map((exercise, i) =>
          i === index
            ? {
                ...exercise,
                setConfig:
                  exercise.setConfig === "simple" ? "detailed" : "simple",
              }
            : exercise
        )
      );
      return;
    }

    const id = exercises[index].id;
    toggleSetConfig(id);

    const plan = workoutData.plannedWorkouts.find((p) => p.id === planId);

    if (plan) {
      setExercises(plan.exercises);
    }
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

  function handleAddDetailedSet(index: number) {
    const updatedExercises = [...exercises];
    const currentExercise = updatedExercises[index];

    const newSet = {
      setType: "normal" as SetType,
      reps: 0,
      kg: 0,
    };
    const currentSets = currentExercise.detailedSets ?? [];

    updatedExercises[index] = {
      ...currentExercise,
      detailedSets: [...currentSets, newSet],
    };

    setExercises(updatedExercises);

    if (isEditing) {
      const plan = workoutData.plannedWorkouts.find((p) => p.id === planId);
      if (plan) {
        const updatedPlan = { ...plan, exercises: updatedExercises };
        editWorkout(planId, updatedPlan);
      }
    }
  }

  function handleUpdateSetType(
    exerciseIndex: number,
    setIndex: number,
    newType: SetType
  ) {
    const updatedExercises = [...exercises];
    const sets = [...(updatedExercises[exerciseIndex].detailedSets ?? [])];

    sets[setIndex] = {
      ...sets[setIndex],
      setType: newType,
    };

    updatedExercises[exerciseIndex] = {
      ...updatedExercises[exerciseIndex],
      detailedSets: sets,
    };

    setExercises(updatedExercises);

    if (isEditing) {
      const plan = workoutData.plannedWorkouts.find((p) => p.id === planId);
      if (plan) {
        const updatedPlan = { ...plan, exercises: updatedExercises };
        editWorkout(planId, updatedPlan);
      }
    }
  }

  function handleToggleRepsRange(index: number) {
    const updatedExercises = [...exercises];

    updatedExercises[index] = {
      ...updatedExercises[index],
      repsRange: !updatedExercises[index].repsRange,
    };

    setExercises(updatedExercises);

    if (isEditing) {
      const plan = workoutData.plannedWorkouts.find((p) => p.id === planId);
      if (plan) {
        const updatedPlan = { ...plan, exercises: updatedExercises };
        editWorkout(planId, updatedPlan);
      }
    }
  }

  return isCreating || isEditing ? (
    <Card className="p-2">
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
        <div className="grid gap-2">
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
        </div>

        <div className="grid gap-3.5">
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
                  onToggleType={handleToggleMode}
                  onToggleSetConfig={handleToggleSetConfig}
                  onAddNewDetailedSet={handleAddDetailedSet}
                  onUpdateSetType={handleUpdateSetType}
                  onToggleRepsRange={handleToggleRepsRange}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>

        <Button
          onClick={handleAddExercise}
          type="button"
          className="flex items-center justify-center gap-1 rounded-md bg-zinc-100 p-2 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400"
        >
          <Plus className="h-5 w-5" />
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
