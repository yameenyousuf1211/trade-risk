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
}: {
  value: Date;
  setValue: any;
  maxDate: Date | string | any;
  name: string;
  disabled?: {
    before?: Date | undefined;
    after?: Date | undefined;
  };
  isPast?: boolean;
  isLg?: boolean;
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
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant={"outline"}
          className={cn(
            "w-full justify-between text-left font-normal",
            !date &&
              "text-muted-foreground flex items-center justify-between w-full"
          )}
          id="validity"
        >
          {isLg ? (
            <span className="flex items-center justify-between w-full">
              <span>Select Date</span>
              <span className="flex items-center space-x-2">
                <span>
                  {date && isValid(date)
                    ? format(date, "dd/MM/yyyy")
                    : "DD/MM/YYYY"}
                </span>
                <CalendarIcon className="h-4 w-4" />
              </span>
            </span>
          ) : (
            <span>
              {date && isValid(date) ? format(date, "PPP") : "DD/MM/YYYY"}
              <CalendarIcon className="h-4 w-4" />
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <ValidatingCalendar
          disabled={disabled}
          initialDate={date}
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
