import { Slot } from "@radix-ui/react-slot";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export function Button({ asChild, children, ...props }: ButtonProps) {
  const Component = asChild ? Slot : 'button';

  return (
    <Component className="bg-zinc-800 p-4" {...props}>
      {children}
    </Component>
  );
}
