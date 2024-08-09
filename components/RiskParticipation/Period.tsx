import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ValidatingCalendar } from "../LCSteps/Step3Helpers";

//TODO: add types
export default function Period({
  watch,
  setValue,
}: {
  watch: any;
  setValue: any;
}) {
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
  const [startDate, setStartDate] = useState<any>("");

  let lcPeriodType = watch("period.expectedDate");

  const updateValue = (name: string, value: any) => {
    setValue(name, value);
  };

  const handleRadioChange = (e: any) => {
    setValue("period.expectedDate", e.target.value);
  };

  let lcStartDate = watch("period.startDate");

  return (
    <div className="flex flex-col gap-y-4 justify-between border border-borderCol rounded-md py-2 px-3 mb-3 bg-[#F5F7F9]">
      <div className="flex  items-center">
        <div className="w-full rounded-md flex items-center gap-x-2">
          <input
            type="radio"
            id="date-lc-issued"
            className="accent-primaryCol size-4"
            name="period.expectedDate"
            value="yes"
            checked={lcPeriodType === "yes"}
            onChange={handleRadioChange}
          />
          <label
            htmlFor="date-lc-issued"
            className="text-sm text-lightGray font-normal"
          >
            Date LC Issued
          </label>
        </div>
        <div className="w-full rounded-md flex items-center gap-x-2">
          <input
            type="radio"
            id="expected-date"
            className="accent-primaryCol !bg-white size-4"
            name="period.expectedDate"
            value="no"
            checked={lcPeriodType === "no"}
            onChange={handleRadioChange}
          />
          <label
            htmlFor="expected-date"
            className="text-sm text-lightGray font-normal"
          >
            Expected date of LC issuance
          </label>
        </div>
      </div>
      <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={`w-fit justify-start text-left font-normal border-none ${
              lcStartDate ? "text-black" : "text-[#B5B5BE] "
            }`}
            id="period-lc-date"
            disabled={!lcPeriodType}
          >
            {lcStartDate ? format(lcStartDate, "PPP") : <span>DD/MM/YYYY</span>}
            <CalendarIcon className="ml-2 mr-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          {lcPeriodType === "yes" ? (
            <ValidatingCalendar
              initialDate={lcStartDate}
              onChange={(date) => {
                updateValue("period.startDate", date);
                setStartDate(date);
              }}
              onClose={() => setDatePopoverOpen(false)}
              isPast
            />
          ) : (
            <ValidatingCalendar
              initialDate={lcStartDate}
              onChange={(date) => {
                updateValue("period.startDate", date);
                setStartDate(date);
              }}
              onClose={() => setDatePopoverOpen(false)}
            />
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
