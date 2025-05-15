import * as Switch from "@radix-ui/react-switch";
import React, { ButtonHTMLAttributes, useState } from "react";

interface ModeToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon1: React.ReactNode;
  icon2: React.ReactNode;
  mode: "reps" | "time";
}

export function ModeToggle(props: ModeToggleProps) {
  const [isTimeMode, setIsTimeMode] = useState(props.mode === "time");

  function toggleMode() {
    setIsTimeMode((prev) => !prev);
  }

  return (
    <Switch.Root checked={isTimeMode} onCheckedChange={toggleMode} {...props}>
      <Switch.Thumb>{isTimeMode ? props.icon2 : props.icon1}</Switch.Thumb>
    </Switch.Root>
  );
}
