import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { House, ClipboardList } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { value: "/", icon: <House size={32} />, label: "home" },
  // { value: "/exercises", icon: <List size={32} />, label: "exercises" },
  { value: "/workout", icon: <ClipboardList size={32} />, label: "workout" },
  // { value: "/history", icon: <History size={32} />, label: "history" },
];

export function NavigatorBar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex justify-center">
      <ToggleGroup.Root
        className="fixed bottom-10 flex max-w-fit gap-4 rounded-xl bg-zinc-200 p-3 shadow-[0_0_12px_1px_rgba(0,0,0,0.2)] dark:bg-zinc-800"
        type="single"
        value={location.pathname}
        onValueChange={(value) => {
          if (value) {
            navigate(value);
          }
        }}
      >
        {navItems.map((item) => (
          <ToggleGroup.Item
            key={item.value}
            className="rounded-lg bg-zinc-300 p-3 text-zinc-400 data-[state=on]:bg-zinc-100 data-[state=on]:text-zinc-900 dark:bg-zinc-700 dark:text-zinc-400 dark:data-[state=on]:bg-zinc-900 dark:data-[state=on]:text-zinc-100"
            value={item.value}
            aria-label={item.label}
          >
            {item.icon}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
    </div>
  );
}
