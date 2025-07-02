import * as Checkbox from "@radix-ui/react-checkbox";
import {
  ArrowDownCircle,
  Check,
  Dumbbell,
  Flame,
  LayoutTemplate,
  Skull,
  TrendingUp,
} from "lucide-react";

interface WorkoutLineProps {
  data: Exercise;
  readonly?: boolean;
  checkbox?: boolean;
  isChecked?: boolean;
  onCheckedChange?: () => void;
}

const setTypeColors = {
  normal: "text-zinc-600 dark:text-zinc-400",
  warmup: "text-orange-600 dark:text-orange-400",
  feeder: "text-purple-600 dark:text-purple-400",
  working: "text-green-600 dark:text-green-400",
  failure: "text-red-600 dark:text-red-400",
  drop: "text-blue-600 dark:text-blue-400",
  cluster: "text-yellow-600 dark:text-yellow-400",
};

const setTypeOptions: {
  value: SetType;
  label: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    value: "normal",
    label: "Normal set",
    icon: <Dumbbell size={16} />,
    color: "text-zinc-600 dark:text-zinc-400",
  },
  {
    value: "warmup",
    label: "Warmup set",
    icon: <Flame size={16} />,
    color: "text-orange-600 dark:text-orange-400",
  },
  {
    value: "feeder",
    label: "Feeder set",
    icon: <TrendingUp size={16} />,
    color: "text-purple-600 dark:text-purple-400",
  },
  {
    value: "working",
    label: "Working set",
    icon: <Dumbbell size={16} />,
    color: "text-green-600 dark:text-green-400",
  },
  {
    value: "failure",
    label: "Failure set",
    icon: <Skull size={16} />,
    color: "text-red-600 dark:text-red-400",
  },
  {
    value: "drop",
    label: "Drop Set",
    icon: <ArrowDownCircle size={16} />,
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    value: "cluster",
    label: "Cluster set",
    icon: <LayoutTemplate size={16} />,
    color: "text-yellow-600 dark:text-yellow-400",
  },
];

export function WorkoutLine(props: WorkoutLineProps) {
  const isTimeMode = props.data.type === "time";
  const formatTime = (time: number) => time.toString().padStart(2, "0");

  return (
    <div className="flex gap-2 text-sm">
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

      <div className={`relative w-full ${props.isChecked && "text-zinc-500"}`}>
        {props.readonly && isTimeMode ? (
          <div className="flex items-center gap-2">
            <div>
              <span>{formatTime(props.data.min)}</span>
              <span>:</span>
              <span>{formatTime(props.data.sec)}</span>
            </div>
            <span className="break-all">{props.data.name}</span>
          </div>
        ) : props.data.setConfig === "simple" ? (
          <div className="flex items-start gap-2">
            <div className="whitespace-nowrap">
              {props.data.simpleSet?.sets}x&nbsp;
              {props.data.repsRange
                ? `${props.data.simpleSet?.minReps ?? 0}-${props.data.simpleSet?.maxReps ?? 0}`
                : `${props.data.simpleSet?.reps ?? 0}`}
              &nbsp;reps
            </div>
            <span className="whitespace-normal break-words">
              {props.data.name}
            </span>
            <div className="flex w-full items-center gap-2">
              <span className="min-w-4 flex-1 border-b border-b-zinc-400 dark:border-b-zinc-600" />
              <span className="whitespace-nowrap">
                {props.data.simpleSet?.kg} kg
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <div className="flex gap-2">
              <span>{props.data.detailedSets?.length}x</span>
              <span className="break-all">{props.data.name}</span>
            </div>
            {(props.data.detailedSets ?? []).map((set, i) => (
              <div key={i} className="ml-2 flex items-center">
                <span>{i + 1}º</span>
                &nbsp;
                <div className="flex items-center gap-0.5">
                  <span
                    className={`capitalize ${props.isChecked ? "text-zinc-500" : setTypeColors[set.setType]}`}
                  >
                    {
                      setTypeOptions.find((opt) => opt.value === set.setType)
                        ?.icon
                    }
                  </span>
                  <span
                    className={`capitalize ${props.isChecked ? "text-zinc-500" : setTypeColors[set.setType]}`}
                  >
                    {set?.setType}
                  </span>
                </div>
                &nbsp;
                <span className="mx-2 flex-1 border-b border-zinc-400 dark:border-zinc-600" />
                <span>
                  {props.data.repsRange
                    ? `${set.minReps ?? 0}-${set.maxReps ?? 0} reps`
                    : `${set.reps ?? 0} reps`}
                </span>
                <span>&nbsp;x&nbsp;</span>
                <span className="whitespace-nowrap">{set?.kg} kg</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
