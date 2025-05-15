import { useState } from "react";

import * as Checkbox from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

interface WorkoutLineProps {
  data: Exercise;
  readonly?: boolean;
  checkbox?: boolean;
}

export function WorkoutLine(props: WorkoutLineProps) {
  const [checked, setChecked] = useState(false);

  const isTimeMode = props.data.type === "time";
  const formatTime = (time: number) => time.toString().padStart(2, "0");

  return (
    <div className="flex items-center gap-2 text-sm">
      {props.checkbox && (
        <Checkbox.Root
          checked={checked}
          onCheckedChange={(checked) => setChecked(!!checked)}
          className="w-5 h-5 border border-zinc-500 rounded flex items-center justify-center data-[state=checked]:bg-zinc-500"
        >
          <Checkbox.Indicator className="text-zinc-100 p-1">
            <Check className="w-4 h-4" />
          </Checkbox.Indicator>
        </Checkbox.Root>
      )}

      <div
        className={`relative flex-1 ${
          checked
            ? "text-zinc-600 after:content-[''] after:absolute after:top-1/2 after:left-0 after:w-full after:h-[2px] after:bg-zinc-500 after:-translate-y-1/2 after:pointer-events-none"
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
          <div className="flex items-center gap-2 flex-1">
            <span className="w-1/6">{props.data.reps}x</span>
            <span className="break-words">{props.data.name}</span>
            <span className="border-b-[1px] border-b-zinc-400 w-full flex-1 dark:border-b-zinc-600" />
            <span className={`text-zinc-400 ${checked ? "text-zinc-600" : ""}`}>{props.data.kg}kg</span>
          </div>
        )}
      </div>
    </div>
  );
}
