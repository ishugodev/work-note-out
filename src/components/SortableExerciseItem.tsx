import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Bolt, GripVertical } from "lucide-react";

import { Button } from "./Button";

interface SortableExerciseItemProps {
  id: string;
  index: number;
  exercise: Exercise;
  onEdit: (index: number, updated: Exercise) => void;
  onRemove: (index: number) => void;
  onToggleType: (index: number) => void;
}

export function SortableExerciseItem({
  id,
  index,
  exercise,
  onEdit,
  onRemove,
  onToggleType,
}: SortableExerciseItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} className="flex gap-0.5">
      <div className="flex w-full items-center gap-0.5">
        <Button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none"
        >
          <GripVertical className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
        </Button>

        {exercise.type === "time" ? (
          <>
            <input
              type="number"
              value={exercise.min > 0 ? exercise.min : ""}
              onChange={(e) =>
                onEdit(index, {
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
                onEdit(index, {
                  ...exercise,
                  sec: Number(e.target.value),
                })
              }
              className="flex h-9 w-6 rounded-md bg-zinc-100 p-0.5 text-right dark:bg-zinc-700"
            />
          </>
        ) : (
          <>
            <input
              type="number"
              value={exercise.reps > 0 ? exercise.reps : ""}
              onChange={(e) =>
                onEdit(index, {
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
            onEdit(index, {
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
                onEdit(index, {
                  ...exercise,
                  kg: Number(e.target.value),
                })
              }
              className="flex max-w-10 rounded-md bg-zinc-100 p-1.5 text-right dark:bg-zinc-700"
            />
            <span>kg</span>
          </>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="rounded-full p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-600"
            >
              <Bolt className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="bottom"
            align="end"
            className="z-50 min-w-[150px] rounded-md bg-white p-1 shadow-md dark:bg-zinc-800"
          >
            <DropdownMenuItem
              className="flex cursor-pointer items-center justify-between rounded px-2 py-1 text-sm text-zinc-900 hover:bg-zinc-200 dark:text-zinc-100 dark:hover:bg-zinc-700"
              onSelect={() => onToggleType(index)}
            >
              {exercise.type === "time" ? "Switch to reps" : "Switch to time"}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer rounded px-2 py-1 text-sm text-red-600 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              onClick={() => onRemove(index)}
            >
              Delete exercise
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
