"use client";
import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { ValidatingCalendar } from "../LCSteps/Step3Helpers";
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

const DateInput = ({
  title,
  name,
  value,
  setValue,
}: {
  title: string;
  name: string;
  value: Date;
  noBorder?: boolean;
  setValue: any;
}) => {
  const [lcExpiryDate, setLcExpiryDate] = useState<Date>();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <label
      id="name"
      className="border border-borderCol bg-white p-1 px-3 rounded-md w-full flex items-center justify-between mb-2"
    >
      <p className="w-full text-sm text-lightGray">{title}</p>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className="w-fit justify-start text-left font-normal border-none text-[#B5B5BE]"
            id="period-expiry-date"
          >
            {value ? (
              format(value, "PPP")
            ) : (
              <span>DD/MM/YYYY</span>
            )}
            <CalendarIcon className="ml-2 mr-2 size-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <ValidatingCalendar
            initialDate={value}
            onChange={(date) => {
              setLcExpiryDate(date);
              setValue(name, date);
            }}
            onClose={() => setIsPopoverOpen(false)}
          />
        </PopoverContent>
      </Popover>
    </label>
  );
};

interface Props {
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
}

export const IssuanceStep4 = ({ register, watch, setValue }: Props) => {
  const { period } = watch();
  return (
    <div
      id="step4"
      className="pt-3 pb-1 px-2 border border-borderCol rounded-lg w-full"
    >
      <div className="flex items-center gap-x-2 ml-2 mb-3">
        <p className="text-sm size-6 rounded-full bg-primaryCol center text-white font-semibold">
          4
        </p>
        <p className="font-semibold text-[16px] text-lightGray">LG Period</p>
      </div>
      <div className="flex items-center justify-between gap-x-2">
        <DateInput
          value={period?.startDate}
          name="period.startDate"
          setValue={setValue}
          title="Date Issued / Expected Date of Issuance"
        />
        <DateInput
          value={period?.endDate}
          name="period.endDate"
          setValue={setValue}
          title="LG Expiry Date"
        />
      </div>
    </div>
  );
};
