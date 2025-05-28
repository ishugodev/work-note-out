// components/Sidebar.tsx
import * as Dialog from "@radix-ui/react-dialog";
import { X, Menu } from "lucide-react";
import { ReactNode } from "react";

import { usePWAInstallPrompt } from "@/hooks/usePWAInstallPrompt";

import { Button } from "./Button";

interface SideMenuProps {
  children?: ReactNode;
}

export function SideMenu({ children }: SideMenuProps) {
  const { canInstall, promptInstall } = usePWAInstallPrompt();

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="text-zinc-100 dark:text-zinc-100">
          <Menu size={24} />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50" />
        <Dialog.Content className="data-[state=open]:animate-slideIn fixed left-0 top-0 z-50 h-full w-64 bg-zinc-100 p-6 text-zinc-900 shadow-xl dark:bg-zinc-900 dark:text-zinc-100">
          <div className="mb-6 flex items-center justify-between">
            <Dialog.Title className="text-xl font-bold">Menu</Dialog.Title>
            <Dialog.Description className="sr-only">
              Sidebar navigation menu with links and actions.
            </Dialog.Description>
            <Dialog.Close asChild>
              <button className="p-1">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <nav className="flex flex-col gap-4">
            <a href="/" className="">
              Home
            </a>
            {canInstall && (
              <Button
                className="rounded-md bg-zinc-800 p-2"
                onClick={promptInstall}
              >
                Install app
              </Button>
            )}
            {children}
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
