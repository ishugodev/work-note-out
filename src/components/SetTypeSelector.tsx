import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  Flame,
  TrendingUp,
  Dumbbell,
  Skull,
  ArrowDownCircle,
  LayoutTemplate,
} from "lucide-react";

interface SetTypeSelectorProps {
  value: SetType;
  onChange: (newType: SetType) => void;
}

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

export function SetTypeSelector({ value, onChange }: SetTypeSelectorProps) {
  const current = setTypeOptions.find((opt) => opt.value === value);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={`flex h-8 w-8 items-center justify-center gap-1 rounded-3xl bg-zinc-100 px-1 py-1 dark:bg-zinc-700  ${current?.color}`}
        >
          <span className="text-sm">
            {current?.label.charAt(0).toUpperCase()}
          </span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content className="z-50 min-w-[160px] rounded-md border bg-white p-2 shadow-md dark:bg-zinc-800">
        {setTypeOptions.map((option) => (
          <DropdownMenu.Item
            key={option.value}
            onSelect={() => onChange(option.value)}
            className={`flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 ${
              value === option.value
                ? "bg-zinc-100 font-medium dark:bg-zinc-700"
                : ""
            }`}
          >
            <span className={option.color}>{option.icon}</span>
            <span>{option.label}</span>
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
