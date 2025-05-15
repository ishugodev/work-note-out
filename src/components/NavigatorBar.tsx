import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { House, ClipboardList } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { value: "/", icon: <House size={32} />, label: "home" },
  { value: "/workout", icon: <ClipboardList size={32} />, label: "workout" },
  // { value: "/exercises", icon: <ScrollText size={32} />, label: "exercises" },
  // { value: "/history", icon: <History size={32} />, label: "history" },
];

export function NavigatorBar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex justify-center">
      <ToggleGroup.Root
        className="bg-zinc-800 p-3 rounded-xl flex gap-4 max-w-fit fixed bottom-10 shadow-[0_0_12px_2px_rgba(0,0,0,0.2)]"
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
            className="bg-zinc-700 text-zinc-400 p-3 rounded-lg data-[state=on]:bg-zinc-900 data-[state=on]:text-zinc-100"
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
