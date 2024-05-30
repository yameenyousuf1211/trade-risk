"use client";
import { toast } from "sonner";
import { DDInput } from "../LCSteps/helpers";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBanks } from "@/services/apis/helpers.api";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { ValidatingCalendar } from "../LCSteps/Step3Helpers";

export const DiscountBanks = ({
  countries,
  setValue,
  getValues,
  flags,
  value,
}: {
  countries: string[];
  flags: string[];
  setValue?: any;
  getValues?: any;
  value?: any;
  valueSetter?: any;
}) => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="flex items-center justify-between w-full mb-3 gap-x-4 flex-wrap xl:flex-nowrap">
      {/* Issuing Bank */}
      <div className="border border-borderCol rounded-md py-3 px-2 w-full bg-[#F5F7F9]">
        <p className="font-semibold mb-2 ml-3 text-sm text-[#1A1A26]">
          LC Issuing Bank
        </p>
        <div className="flex flex-col gap-y-2">
          <DDInput
            placeholder="Select a country"
            label="Country"
            id="issuingBank.country"
            // value={issuingCountry}
            data={countries}
            flags={flags}
            setValue={setValue}
          />
          <DDInput
            placeholder="Select bank"
            label="Bank"
            id="issuingBank.bank"
            // value={issuingBank}
            setValue={setValue}
            disabled={true}
            // disabled={
            //   !issuingBanks || !issuingBanks?.response || !issuingBanks.success
            // }
            // data={
            //   issuingBanks && issuingBanks.success && issuingBanks?.response
            // }
          />
        </div>
      </div>
      {/* Advising Bank */}
      <div className="border border-borderCol rounded-md py-3 px-2 w-full bg-[#F5F7F9]">
        <p className="font-semibold mb-2 ml-3 text-sm text-[#1A1A26]">
          LC Advising Bank
        </p>
        <div className="flex flex-col gap-y-2">
          <DDInput
            placeholder="Select a country"
            label="Country"
            id="advisingBank.country"
            // value={advisingCountry}
            data={countries}
            flags={flags}
            setValue={setValue}
          />
          <DDInput
            placeholder="Select bank"
            label="Bank"
            id="advisingBank.bank"
            // value={advisingBank}
            setValue={setValue}
            disabled={true}
            // disabled={
            //   !advisingBanks ||
            //   !advisingBanks?.response ||
            //   !advisingBanks.success
            // }
            // data={
            //   advisingBanks && advisingBanks.success && advisingBanks.response
            // }
          />
        </div>
      </div>
      {/* Confirming Bank */}
      <div className="border border-borderCol rounded-md py-3 px-2 w-full bg-[#F5F7F9]">
        <div className="flex items-center gap-x-2 justify-between mb-2 px-3 xl:px-0">
          <p className="font-semibold text-sm text-[#1A1A26]">
            Confirming Bank
          </p>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="same-as-advising"
              className="accent-primaryCol"
              checked={isChecked}
              //   onChange={handleCheckboxChange}
            />
            <label
              htmlFor="same-as-advising"
              className="ml-1  text-[12px] text-lightGray"
            >
              Same as advising bank
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-y-2">
          <DDInput
            placeholder="Select a country"
            label="Country"
            // value={confirmingCountry}
            id="confirmingBank.country"
            data={countries}
            flags={flags}
            setValue={setValue}
          />
          <DDInput
            placeholder="Select bank"
            label="Bank"
            id="confirmingBank.bank"
            // value={confirmingBank}
            setValue={setValue}
            disabled
            // disabled={
            //   !confirmingBanks ||
            //   !confirmingBanks?.response ||
            //   !confirmingBanks.success
            // }
            // data={
            //   confirmingBanks &&
            //   confirmingBanks.success &&
            //   confirmingBanks.response
            // }
          />
        </div>
      </div>
    </div>
  );
};

export const DateInput = ({
  title,
  noBorder,
}: {
  title: string;
  noBorder?: boolean;
}) => {
  const [lcExpiryDate, setLcExpiryDate] = useState<Date>();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <div
      className={`${
        !noBorder && "border border-borderCol"
      } pt-3 px-2 rounded-md w-full bg-[#F5F7F9]`}
    >
      <p className="text-sm font-semibold mb-2 ml-2">{title}</p>
      <label
        id="name"
        className="border border-borderCol bg-white p-1 px-3 rounded-md w-full flex items-center justify-between mb-2"
      >
        <p className="w-full text-sm text-lightGray">Select Date</p>
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className="w-fit justify-start text-left font-normal border-none text-[#B5B5BE]"
              id="period-expiry-date"
            >
              {lcExpiryDate ? (
                format(lcExpiryDate, "PPP")
              ) : (
                <span>DD/MM/YYYY</span>
              )}
              <CalendarIcon className="ml-2 mr-2 size-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <ValidatingCalendar
              initialDate={lcExpiryDate}
              onChange={(date) => {
                setLcExpiryDate(date);
                // updateValue("lcPeriod.endDate", date);
              }}
              onClose={() => setIsPopoverOpen(false)}
            />
          </PopoverContent>
        </Popover>
      </label>
    </div>
  );
};

export const BankRadioInput = ({
  id,
  label,
  checked,
  name,
  value,
}: {
  id: string;
  label: string;
  name: string;
  value: string;
  checked: boolean;
}) => {
  return (
    <label
      htmlFor={id}
      className={`px-3 py-4 w-full transition-colors duration-100 ${
        checked ? "bg-[#DCE5FD]" : "border border-borderCol bg-white"
      } rounded-md flex items-center gap-x-3 mb-2 text-lightGray text-sm w-full`}
    >
      <input
        type="radio"
        id={id}
        value={value}
        name={name}
        checked={checked}
        className="accent-[#255EF2] size-4"
      />
      {label}
    </label>
  );
};
