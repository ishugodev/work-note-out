import * as Dialog from "@radix-ui/react-dialog";
import { useState, useEffect, HtmlHTMLAttributes, useMemo } from "react";
import Picker from "react-mobile-picker";

interface NumberPickerProps extends HtmlHTMLAttributes<HTMLInputElement> {
  min?: number;
  max?: number;
  value: number;
  onValueChange?: (value: number) => void;
  formatAsTime?: boolean;
}

export function NumberPicker({
  min = 1,
  max = 50,
  value,
  onValueChange,
  formatAsTime = false,
  ...rest
}: NumberPickerProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(String(value));
  const [confirmedValue, setConfirmedValue] = useState(value);
  const [editing, setEditing] = useState(false);

  const numbers = useMemo(() => {
    const nums: string[] = [];
    for (let i = min; i <= max; i++) {
      nums.push(String(i));
    }
    return nums;
  }, [min, max]);

  useEffect(() => {
    setSelected(String(value));
    setConfirmedValue(value);
  }, [value]);

  function confirmSelection() {
    const num = Number(selected);
    setOpen(false);
    setConfirmedValue(num);
    if (onValueChange) onValueChange(num);
  }

  function handleEditConfirm(raw: string) {
    const num = Number(raw);
    const clamped = Math.min(Math.max(num, min), max);
    const clampedStr = String(clamped);
    setEditing(false);
    setSelected(clampedStr);
  }

  function formatNumber(num: number) {
    return num < 10 ? `0${num}` : String(num);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <input
          readOnly
          value={formatAsTime ? formatNumber(confirmedValue) : confirmedValue}
          className={`w-24 cursor-pointer rounded border px-3 py-2 text-xl focus:outline-none`}
          {...rest}
        />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        <Dialog.Content
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-0 m-auto h-fit w-[calc(100%-8rem)] max-w-screen-sm rounded-lg bg-zinc-200 p-3 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
        >
          <div className="text-center">
            <Dialog.Title className="text-lg font-medium">
              Select a number
            </Dialog.Title>
            <Dialog.Description className="text-sm">
              Tap the number or scroll to adjust
            </Dialog.Description>
          </div>
          <div>
            <Picker
              value={{ number: selected }}
              onChange={(val) => setSelected(val.number)}
              wheelMode="normal"
              className="text-zinc-600"
            >
              <Picker.Column name="number">
                {numbers.map((num) =>
                  num === selected ? (
                    <Picker.Item key={num} value={num}>
                      {editing ? (
                        <input
                          ref={(el) => {
                            if (el) el.select();
                          }}
                          type="number"
                          defaultValue={selected}
                          min={min}
                          max={max}
                          autoFocus
                          onBlur={(e) => handleEditConfirm(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleEditConfirm(
                                (e.target as HTMLInputElement).value
                              );
                            }
                          }}
                          className="w-16 rounded bg-transparent text-center font-bold text-zinc-100 outline-none"
                        />
                      ) : (
                        <span
                          className="cursor-pointer p-2 font-medium text-zinc-900 dark:text-zinc-100"
                          onClick={() => setEditing(true)}
                        >
                          {num}
                        </span>
                      )}
                    </Picker.Item>
                  ) : (
                    <Picker.Item key={num} value={num}>
                      {num}
                    </Picker.Item>
                  )
                )}
              </Picker.Column>
            </Picker>
          </div>

          <button
            onClick={confirmSelection}
            className="mt-4 w-full rounded bg-zinc-300 py-2 font-medium text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100"
          >
            Confirm
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
