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
          className="flex h-5 w-5 items-center justify-center rounded border border-zinc-500 data-[state=checked]:bg-zinc-500"
        >
          <Checkbox.Indicator className="p-1 text-zinc-100">
            <Check className="h-4 w-4" />
          </Checkbox.Indicator>
        </Checkbox.Root>
      )}

      <div
        className={`relative w-full ${
          props.isChecked
            ? "text-zinc-500 after:pointer-events-none after:absolute after:left-0 after:top-1/2 after:h-[1px] after:w-full after:-translate-y-1/2 after:bg-zinc-500 after:content-['']"
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
          <div className="flex items-center gap-2">
            <span className="w-1/6">{props.data.sets}x</span>
            <div className="flex w-full items-center gap-2">
              <span className="whitespace-normal break-all">
                {props.data.name}
              </span>
              <span className="min-w-4 flex-1 border-b-[1px] border-b-zinc-400 dark:border-b-zinc-600" />
            </div>
            <span className="whitespace-nowrap">{props.data.kg}kg</span>
          </div>
        )}
      </div>
    </div>
  );
}
