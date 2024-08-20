"use client";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ValidatingCalendar } from "../LCSteps/Step3Helpers";

export const DatePicker = ({
  setValue,
  maxDate,
  name,
  isLg,
  disabled,
  value,
  isPast = false,
  placeholder,
  returnDate,
  onDateChange,
}: {
  setValue?: any;
  maxDate?: Date | string | any;
  name?: string;
  isLg?: boolean;
  disabled?: boolean;
  isPast?: boolean;
  value?: Date;
  placeholder?: string;
  returnDate?: boolean;
  onDateChange?: any;
}) => {
  const [date, setDate] = useState<Date>();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    if (value && !date) setDate(value);
  }, [value]);

  useEffect(() => {
    if (returnDate && onDateChange && date) {
      onDateChange(format(date, "PPP"));
    }
  }, [date, returnDate, onDateChange]);

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant={"outline"}
          className={cn(
            `w-full ${
              isLg
                ? "justify-end gap-2 border-none"
                : "justify-between text-left"
            } font-normal`,
            !date &&
              `flex items-center text-muted-foreground ${
                isLg ? "justify-end gap-2 border-none" : "justify-between"
              } w-full`,
          )}
          id={`${name || "validity"}`}
        >
          {date && date instanceof Date ? (
            format(date, "PPP")
          ) : (
            <>
              <span>{placeholder ? placeholder : ""}</span>
              <span>DD/MM/YYYY</span>
            </>
          )}
          <CalendarIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <ValidatingCalendar
          initialDate={date}
          maxDate={maxDate}
          isPast={isPast}
          onChange={(date) => {
            setDate(date);
            setValue?.(`${name || "validity"}`, date);
          }}
          onClose={() => setIsPopoverOpen(false)}
        />
      </PopoverContent>
    </Popover>
  );
};
