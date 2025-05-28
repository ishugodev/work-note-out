import { Slot } from "@radix-ui/react-slot";
import { Box, Card as RadixCard } from "@radix-ui/themes";
import React from "react";

interface CardProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  asChild?: boolean;
}

export function Card(props: CardProps) {
  const Component = props.asChild ? Slot : RadixCard;

  return (
    <Box className="rounded-xl bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
      <Component {...props}>{props.children}</Component>
    </Box>
  );
}
