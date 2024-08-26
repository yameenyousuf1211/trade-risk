import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
  isPast
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
            !date && "text-muted-foreground flex items-center justify-between w-full"
          )}
          id="validity"
        >
          {date && isValid(date) ? format(date, "PPP") : <span>DD/MM/YYYY</span>}
          <CalendarIcon className="mr-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <ValidatingCalendar
        disabled={disabled}
          initialDate={date}
          maxDate={maxDate}
          onChange={(newDate) => {
            setDate(newDate);
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
