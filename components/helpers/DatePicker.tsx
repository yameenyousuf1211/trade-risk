import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, isValid } from "date-fns";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { ValidatingCalendar } from "../LCSteps/Step3Helpers";

export const DatePicker = ({
  setValue,
  maxDate,
  name,
  value,
  disabled,
  isPast,
  isLg,
  startDate,
  endDate,
  extraClassName,
  leftText = true,
}: {
  value: Date;
  setValue: any;
  maxDate: Date | string | any;
  name: string;
  startDate?: Date;
  leftText?: boolean;
  endDate?: Date;
  disabled?: {
    before?: Date | undefined;
    after?: Date | undefined;
  };
  isPast?: boolean;
  isLg?: boolean;
  extraClassName?: string;
}) => {
  const [date, setDate] = useState<Date | undefined>(value);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Sync local state with prop `value`
  useEffect(() => {
    if (value) {
      setDate(new Date(value));
    }
  }, [value]);

  return (
    <Popover open={isPopoverOpen}>
      <PopoverTrigger asChild onClick={() => setIsPopoverOpen(!isPopoverOpen)}>
        <Button
          onClick={() => setIsPopoverOpen(!isPopoverOpen)}
          disabled={disabled}
          variant={"outline"}
          className={cn(
            "w-full justify-between text-left font-normal flex items-center",
            !date && "text-muted-foreground",
            extraClassName // Apply extraClassName here
          )}
          id="validity"
        >
          {leftText && <span className="flex-grow">Select Date</span>}
          <span className="flex items-center">
            {date && isValid(date) ? (
              format(date, "PPP")
            ) : (
              <span className="text-[#B5B5BE]">DD/MM/YYYY</span>
            )}
            <CalendarIcon
              className="ml-2 h-3.5 w-3.5 mb-0.5"
              color={date && isValid(date) ? "black" : "#B5B5BE"}
            />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <ValidatingCalendar
          disabled={disabled}
          initialDate={date}
          startDate={startDate}
          endDate={endDate}
          maxDate={maxDate}
          onChange={(newDate) => {
            setDate(newDate);
            if (isLg) {
              setValue(newDate);
              return;
            }
            if (name) {
              setValue(name, newDate);
            } else if (newDate) {
              setValue("validity", newDate);
            }
          }}
          onClose={() => setIsPopoverOpen(false)}
        />
      </PopoverContent>
    </Popover>
  );
};
