import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Close } from "@radix-ui/react-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Bolt, GripVertical, Plus, X } from "lucide-react";
import { useState } from "react";

import { Button } from "./Button";
import { Modal } from "./Modal";
import { SetTypeSelector } from "./SetTypeSelector";

interface SortableExerciseItemProps {
  id: string;
  index: number;
  exercise: Exercise;
  onEdit: (index: number, updated: Exercise) => void;
  onRemove: (index: number) => void;
  onToggleType: (index: number) => void;
  onToggleSetConfig: (index: number) => void;
  onAddNewDetailedSet: (index: number) => void;
  onUpdateSetType: (
    exerciseIndex: number,
    setIndex: number,
    newType: SetType
  ) => void;
  onToggleRepsRange: (index: number) => void;
}

export function SortableExerciseItem({
  id,
  index,
  exercise,
  onEdit,
  onRemove,
  onToggleType,
  onToggleSetConfig,
  onAddNewDetailedSet,
  onUpdateSetType,
  onToggleRepsRange,
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

  const [minFocused, setMinFocused] = useState(false);
  const [secFocused, setSecFocused] = useState(false);

  return (
    <div ref={setNodeRef} style={style}>
      <div className="flex w-full gap-1">
        <div>
          <Button
            type="button"
            {...attributes}
            {...listeners}
            className="h-full cursor-grab touch-none rounded-md bg-zinc-100 dark:bg-zinc-700"
          >
            <GripVertical className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
          </Button>
        </div>
        <div className="grid w-full gap-1">
          <div className="flex">
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="rounded-full p-2 hover:bg-zinc-200 dark:hover:bg-zinc-600"
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
                  className="flex cursor-pointer items-center justify-between rounded px-2 py-2 text-zinc-900 hover:bg-zinc-200 dark:text-zinc-100 dark:hover:bg-zinc-700"
                  onSelect={() => onToggleType(index)}
                >
                  {exercise.type === "time"
                    ? "Change to sets"
                    : "Change to time"}
                </DropdownMenuItem>
                {exercise.type === "reps" && (
                  <DropdownMenuItem
                    className="flex cursor-pointer items-center justify-between rounded px-2 py-2 text-zinc-900 hover:bg-zinc-200 dark:text-zinc-100 dark:hover:bg-zinc-700"
                    onClick={() => onToggleSetConfig(index)}
                  >
                    {exercise.setConfig === "simple"
                      ? "Switch to detailed set"
                      : "Switch to simple set"}
                  </DropdownMenuItem>
                )}
                {exercise.type === "reps" && (
                  <DropdownMenuItem
                    className="flex cursor-pointer items-center justify-between rounded px-2 py-2 text-zinc-900 hover:bg-zinc-200 dark:text-zinc-100 dark:hover:bg-zinc-700"
                    onClick={() => onToggleRepsRange(index)}
                  >
                    {exercise.repsRange === false
                      ? "Add reps range"
                      : "Remove reps range"}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  className="cursor-pointer rounded px-2 py-2 text-red-600 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  onClick={() => onRemove(index)}
                >
                  Delete exercise
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex gap-1">
            {exercise.type === "reps" && (
              <span
                className="w-fit rounded-xl bg-zinc-100
           px-2 text-sm text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400"
              >
                {exercise.setConfig}
              </span>
            )}

            {exercise.repsRange === true && (
              <span
                className="w-fit rounded-xl bg-zinc-100
           px-2 text-sm text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400"
              >
                with reps range
              </span>
            )}
          </div>

          <div>
            {exercise.type === "time" ? (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={0}
                  max={720}
                  value={
                    minFocused
                      ? exercise.min
                      : String(exercise.min).padStart(2, "0")
                  }
                  onChange={(e) =>
                    onEdit(index, {
                      ...exercise,
                      min: Number(e.target.value),
                    })
                  }
                  onFocus={(e) => {
                    setMinFocused(true);
                    e.target.select();
                  }}
                  onBlur={() => setMinFocused(false)}
                  className="flex h-9 w-8 rounded-md bg-zinc-100 p-1 text-right dark:bg-zinc-700"
                />
                <span>:</span>
                <input
                  type="number"
                  min={0}
                  max={59}
                  value={
                    secFocused
                      ? exercise.sec
                      : String(exercise.sec).padStart(2, "0")
                  }
                  onChange={(e) =>
                    onEdit(index, {
                      ...exercise,
                      sec: Number(e.target.value),
                    })
                  }
                  onFocus={(e) => {
                    setSecFocused(true);
                    e.target.select();
                  }}
                  onBlur={() => setSecFocused(false)}
                  className="flex h-9 w-8 rounded-md bg-zinc-100 p-1 text-right dark:bg-zinc-700"
                />
              </div>
            ) : (
              <div className="grid gap-1">
                {exercise.setConfig === "simple" ? (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-0.5">
                      <input
                        type="number"
                        min={0}
                        max={200}
                        value={exercise.simpleSet?.sets ?? 0}
                        onChange={(e) => {
                          const currentSimple = exercise.simpleSet ?? {
                            sets: 0,
                            reps: 0,
                            kg: 0,
                          };
                          onEdit(index, {
                            ...exercise,
                            simpleSet: {
                              ...currentSimple,
                              sets: Number(e.target.value),
                            },
                          });
                        }}
                        onFocus={(e) => e.target.select()}
                        className="h-9 w-8 cursor-pointer rounded-md bg-zinc-100 p-1.5 text-right dark:bg-zinc-700"
                      />
                      <span>x</span>

                      {exercise.repsRange ? (
                        <>
                          <input
                            type="number"
                            min={0}
                            max={400}
                            value={exercise.simpleSet?.minReps ?? 0}
                            onChange={(e) => {
                              const currentSimple = exercise.simpleSet ?? {
                                sets: 0,
                                kg: 0,
                              };
                              onEdit(index, {
                                ...exercise,
                                simpleSet: {
                                  ...currentSimple,
                                  minReps: Number(e.target.value),
                                },
                              });
                            }}
                            onFocus={(e) => e.target.select()}
                            className="h-9 w-8 cursor-pointer rounded-md bg-zinc-100 p-1 text-right dark:bg-zinc-700"
                          />
                          <span>-</span>
                          <input
                            type="number"
                            min={0}
                            max={400}
                            value={exercise.simpleSet?.maxReps ?? 0}
                            onChange={(e) => {
                              const currentSimple = exercise.simpleSet ?? {
                                sets: 0,
                                kg: 0,
                              };
                              onEdit(index, {
                                ...exercise,
                                simpleSet: {
                                  ...currentSimple,
                                  maxReps: Number(e.target.value),
                                },
                              });
                            }}
                            onFocus={(e) => e.target.select()}
                            className="h-9 w-8 cursor-pointer rounded-md bg-zinc-100 p-1.5 text-right dark:bg-zinc-700"
                          />
                        </>
                      ) : (
                        <>
                          <input
                            type="number"
                            min={0}
                            max={400}
                            value={exercise.simpleSet?.reps ?? 0}
                            onChange={(e) => {
                              const currentSimple = exercise.simpleSet ?? {
                                sets: 0,
                                kg: 0,
                              };
                              onEdit(index, {
                                ...exercise,
                                simpleSet: {
                                  ...currentSimple,
                                  reps: Number(e.target.value),
                                },
                              });
                            }}
                            onFocus={(e) => e.target.select()}
                            className="h-9 w-8 cursor-pointer rounded-md bg-zinc-100 p-1.5 text-right dark:bg-zinc-700"
                          />
                        </>
                      )}
                      <span>reps</span>
                    </div>

                    <div>
                      <input
                        type="number"
                        min={0}
                        max={5000}
                        value={
                          exercise.setConfig === "simple"
                            ? exercise.simpleSet?.kg
                            : exercise.detailedSets?.[0]?.kg
                        }
                        onChange={(e) =>
                          onEdit(index, {
                            ...exercise,
                            ...(exercise.setConfig === "simple"
                              ? {
                                  simpleSet: {
                                    ...exercise.simpleSet,
                                    kg: Number(e.target.value),
                                  },
                                }
                              : {
                                  detailedSets: [
                                    {
                                      ...exercise.detailedSets?.[0],
                                      kg: Number(e.target.value),
                                    },
                                    ...(exercise.detailedSets?.slice(1) ?? []),
                                  ],
                                }),
                          })
                        }
                        onFocus={(e) => e.target.select()}
                        className="w-10 rounded-md bg-zinc-100 p-1.5 text-right dark:bg-zinc-700"
                      />
                      <span>kg</span>
                    </div>
                  </div>
                ) : (
                  exercise.detailedSets?.map((set, i) => (
                    <div key={i} className="flex items-center gap-0.5">
                      <div className="">{i + 1}º</div>
                      <SetTypeSelector
                        value={set.setType ?? "normal"}
                        onChange={(newType) =>
                          onUpdateSetType(index, i, newType)
                        }
                      />
                      {exercise.repsRange ? (
                        <>
                          <input
                            type="number"
                            min={0}
                            max={400}
                            value={set.minReps ?? 0}
                            onChange={(e) => {
                              const updatedSets =
                                exercise.detailedSets?.map((s, j) =>
                                  j === i
                                    ? { ...s, minReps: Number(e.target.value) }
                                    : s
                                ) ?? [];
                              onEdit(index, {
                                ...exercise,
                                detailedSets: updatedSets,
                              });
                            }}
                            onFocus={(e) => e.target.select()}
                            className="h-9 w-7 cursor-pointer rounded-md bg-zinc-100 p-1 text-right dark:bg-zinc-700"
                          />
                          <span>-</span>
                          <input
                            type="number"
                            min={0}
                            max={400}
                            value={set.maxReps ?? 0}
                            onChange={(e) => {
                              const updatedSets =
                                exercise.detailedSets?.map((s, j) =>
                                  j === i
                                    ? { ...s, maxReps: Number(e.target.value) }
                                    : s
                                ) ?? [];
                              onEdit(index, {
                                ...exercise,
                                detailedSets: updatedSets,
                              });
                            }}
                            onFocus={(e) => e.target.select()}
                            className="h-9 w-7 cursor-pointer rounded-md bg-zinc-100 p-1.5 text-right dark:bg-zinc-700"
                          />
                        </>
                      ) : (
                        <>
                          <input
                            type="number"
                            min={0}
                            max={400}
                            value={set.reps ?? 0}
                            onChange={(e) => {
                              const updatedSets =
                                exercise.detailedSets?.map((s, j) =>
                                  j === i
                                    ? { ...s, reps: Number(e.target.value) }
                                    : s
                                ) ?? [];
                              onEdit(index, {
                                ...exercise,
                                detailedSets: updatedSets,
                              });
                            }}
                            onFocus={(e) => e.target.select()}
                            className="h-9 w-8 cursor-pointer rounded-md bg-zinc-100 p-1.5 text-right dark:bg-zinc-700"
                          />
                        </>
                      )}

                      <span>reps</span>

                      <input
                        type="number"
                        min={0}
                        max={5000}
                        value={set.kg}
                        onChange={(e) => {
                          const updatedKg = Number(e.target.value);
                          const updatedSets =
                            exercise.detailedSets?.map((s, j) =>
                              j === i ? { ...s, kg: updatedKg } : s
                            ) ?? [];

                          onEdit(index, {
                            ...exercise,
                            detailedSets: updatedSets,
                          });
                        }}
                        onFocus={(e) => e.target.select()}
                        className="flex h-9 w-9 rounded-md bg-zinc-100 p-1 text-right dark:bg-zinc-700"
                      />
                      <span>kg</span>

                      <Modal
                        trigger={
                          <Button className="flex h-9 w-9 items-center justify-center">
                            <X className="text-red-500" />
                          </Button>
                        }
                      >
                        <div className="flex flex-col gap-4 p-4">
                          <span>
                            Confirmar exclusão do <strong>{i + 1}º set</strong>?
                          </span>
                          <div className="flex justify-center gap-1 font-bold">
                            <span>{i + 1}º</span>
                            <span className="capitalize">
                              {set.setType} set
                            </span>
                            <span>{set.reps} reps</span>
                            <span>&nbsp;x&nbsp;</span>
                            <span>{set.kg} kg</span>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button
                              className="bg-red-500 text-white"
                              onClick={() => {
                                const updatedSets =
                                  exercise.detailedSets?.filter(
                                    (_, j) => j !== i
                                  ) ?? [];
                                onEdit(index, {
                                  ...exercise,
                                  detailedSets: updatedSets,
                                });
                              }}
                            >
                              Confirmar
                            </Button>
                            <Close asChild>
                              <Button className="text-white">Cancelar</Button>
                            </Close>
                          </div>
                        </div>
                      </Modal>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          {exercise.setConfig === "detailed" && exercise.type === "reps" && (
            <div>
              <Button
                className="flex w-full items-center justify-center gap-1 rounded-md bg-zinc-100 p-1.5 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400"
                type="button"
                onClick={() => onAddNewDetailedSet(index)}
              >
                <Plus className="h-5 w-5" />
                <div>Add new set</div>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
