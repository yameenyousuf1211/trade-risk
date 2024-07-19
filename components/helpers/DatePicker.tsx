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
import { useState } from "react";
import { ValidatingCalendar } from "../LCSteps/Step3Helpers";

export const DatePicker = ({
  setValue,
  maxDate,
  
}: {
  setValue: any;
  maxDate: Date | string | any;
}) => {
  const [date, setDate] = useState<Date>();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen} modal={true}> 
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-between text-left font-normal",
            !date &&
              "text-muted-foreground flex items-center justify-between w-full"
          )}
          id="validity"
        >
          {date ? format(date, "PPP") : <span>DD/MM/YYYY</span>}
          <CalendarIcon className="mr-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <ValidatingCalendar
          initialDate={date}
          maxDate={maxDate}
          onChange={(date) => {
            setDate(date);
            setValue("validity", date);
          }}
          onClose={() => setIsPopoverOpen(false)}
        />
      </PopoverContent>
    </Popover>
  );
};
