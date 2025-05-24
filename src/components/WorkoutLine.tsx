import * as Checkbox from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

interface WorkoutLineProps {
  data: Exercise;
  readonly?: boolean;
  checkbox?: boolean;
  isChecked?: boolean;
  onCheckedChange?: () => void;
}

export function WorkoutLine(props: WorkoutLineProps) {
  const isTimeMode = props.data.type === "time";
  const formatTime = (time: number) => time.toString().padStart(2, "0");

  return (
    <div className="flex items-center gap-2 text-sm">
      {props.checkbox && (
        <Checkbox.Root
          checked={props.isChecked}
          onCheckedChange={props.onCheckedChange}
          className="flex h-5 w-5 items-center justify-center rounded border border-zinc-600 data-[state=checked]:bg-zinc-600 dark:border-zinc-500 dark:data-[state=checked]:bg-zinc-500"
        >
          <Checkbox.Indicator className="p-1 text-zinc-100">
            <Check className="h-4 w-4" />
          </Checkbox.Indicator>
        </Checkbox.Root>
      )}

      <div
        className={`relative flex-1 ${
          props.isChecked
            ? "text-zinc-400 after:pointer-events-none after:absolute after:left-0 after:top-1/2 after:h-[2px] after:w-full after:-translate-y-1/2 after:bg-zinc-600 after:content-[''] dark:text-zinc-600 dark:after:bg-zinc-500"
            : ""
        }`}
      >
        {props.readonly && isTimeMode ? (
          <div className="flex items-center gap-2">
            <div className="w-1/6">
              <span>{formatTime(props.data.min)}</span>
              <span>:</span>
              <span>{formatTime(props.data.sec)}</span>
            </div>
            <span className="break-all">{props.data.name}</span>
          </div>
        ) : (
          <div className="flex flex-1 items-center gap-2">
            <span className="w-1/6">{props.data.reps}x</span>
            <span className="break-words">{props.data.name}</span>
            <span className="w-full flex-1 border-b-[1px] border-b-zinc-400 dark:border-b-zinc-600" />
            <span>{props.data.kg}kg</span>
          </div>
        )}
      </div>
    </div>
  );
}
