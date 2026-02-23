"use client";

import { useState } from "react";
import { PopoverClose } from "@radix-ui/react-popover";
import { format } from "date-fns";
import { CalendarIcon, OctagonMinus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | null) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  showReset?: boolean;
  showIcon?: boolean;
}

export const DatePicker = ({
  value,
  onChange,
  disabled = false,
  className,
  placeholder = "Due date",
  showReset = false,
  showIcon = false,
}: DatePickerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger disabled={disabled} asChild>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className={cn(
            "w-full justify-start px-3 text-left font-normal",
            !value && "text-muted-foreground",
            className,
          )}
        >
          {showIcon && <CalendarIcon className="size-4 mr-2" />}
          {value ? format(value, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange(date as Date);
            setOpen(false);
          }}
          autoFocus
        />

        {showReset && value && (
          <PopoverClose asChild>
            <Button
              onClick={() => {
                onChange(null);
                setOpen(false);
              }}
              variant="secondary"
              size="sm"
              className="w-full"
            >
              <OctagonMinus className="size-4" />
              Reset Filter
            </Button>
          </PopoverClose>
        )}
      </PopoverContent>
    </Popover>
  );
};
