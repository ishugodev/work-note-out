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
import { NumberPicker } from "./NumberPicker";

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
    <div ref={setNodeRef} style={style}>
      <div className="flex w-full items-center gap-1">
        <Button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none"
        >
          <GripVertical className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
        </Button>

        {exercise.type === "time" ? (
          <div className="flex items-center gap-0.5">
            <NumberPicker
              min={0}
              max={120}
              value={exercise.min}
              onValueChange={(value) =>
                onEdit(index, {
                  ...exercise,
                  min: value,
                })
              }
              formatAsTime
              className="flex h-9 w-8 rounded-md bg-zinc-100 p-1 text-right dark:bg-zinc-700"
            />
            <span>:</span>
            <NumberPicker
              min={0}
              max={59}
              value={exercise.sec}
              onValueChange={(value) =>
                onEdit(index, {
                  ...exercise,
                  sec: value,
                })
              }
              formatAsTime
              className="flex h-9 w-8 rounded-md bg-zinc-100 p-1 text-right dark:bg-zinc-700"
            />
          </div>
        ) : (
          <>
            <NumberPicker
              min={1}
              max={200}
              value={exercise.sets}
              onValueChange={(value) =>
                onEdit(index, {
                  ...exercise,
                  sets: value,
                })
              }
              className="h-9 min-w-8 cursor-pointer rounded-md bg-zinc-100 dark:bg-zinc-700"
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
          className="w-full rounded-md bg-zinc-100 p-1.5 dark:bg-zinc-700"
        />

        {exercise.type !== "time" && (
          <>
            <input
              type="number"
              min={0}
              max={5000}
              value={exercise.kg}
              onChange={(e) =>
                onEdit(index, {
                  ...exercise,
                  kg: Number(e.target.value),
                })
              }
              onFocus={(e) => e.target.select()}
              className="flex min-w-10 rounded-md bg-zinc-100 p-1.5 text-right dark:bg-zinc-700"
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
            className="z-50 min-w-[150px] rounded-md bg-white p-2 shadow-md dark:bg-zinc-800"
          >
            <DropdownMenuItem
              className="flex cursor-pointer items-center justify-between rounded px-2 py-1 text-zinc-900 hover:bg-zinc-200 dark:text-zinc-100 dark:hover:bg-zinc-700"
              onSelect={() => onToggleType(index)}
            >
              {exercise.type === "time" ? "Switch to sets" : "Switch to time"}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer rounded px-2 py-1 text-red-600 hover:bg-zinc-200 dark:hover:bg-zinc-700"
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
