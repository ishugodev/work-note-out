import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import React from "react";

import { Button } from "./Button";

interface ModalProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
}

export function Modal(props: ModalProps) {
  return (
    <Dialog.Root>
      <ModalTrigger disabled={props.disabled}>{props.trigger}</ModalTrigger>
      <ModalContent>{props.children}</ModalContent>
    </Dialog.Root>
  );
}

interface ModalTriggerProps {
  children: React.ReactNode;
  disabled?: boolean;
}

function ModalTrigger(props: ModalTriggerProps) {
  return (
    <Dialog.Trigger asChild disabled={props.disabled}>
      <div
        className={`cursor-pointer ${props.disabled ? "pointer-events-none" : ""}`}
      >
        {props.children}
      </div>
    </Dialog.Trigger>
  );
}

interface ModalContentProps {
  children: React.ReactNode;
}

function ModalContent(props: ModalContentProps) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70" />
      <Dialog.Content
        className="fixed inset-0 m-auto h-fit w-[calc(100%-2rem)] rounded-lg bg-zinc-200 dark:text-zinc-100 text-zinc-800 p-2 dark:bg-zinc-800"
        aria-describedby={undefined}
      >
        {props.children}
        <Dialog.Close asChild>
          <Button
            className="absolute right-2 top-2 items-center justify-center"
            aria-label="Close"
          >
            <X />
          </Button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
