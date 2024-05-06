"use client";
import { useState } from "react";
import { BgRadioInput, DDInput } from "./helpers";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Period = () => {
  const [date, setDate] = useState<Date>();

  return (
    <div className="flex items-start gap-x-4 my-5">
      <div className="border border-borderCol py-3 px-2 rounded-md w-2/3">
        <p className="font-semibold mb-2 ml-3">LC Period</p>
        <div className="flex items-center gap-x-4 justify-between border borer-borderCol rounded-md py-3 px-3 mb-3">
          <div className="w-full rounded-md flex items-center gap-x-2">
            <input
              type="radio"
              name="role"
              id="date-lc-issued"
              className="accent-primaryCol size-4"
            />
            <label htmlFor="date-lc-issued">Date LC Issued</label>
          </div>

          <div className="w-full rounded-md flex items-center gap-x-2">
            <input
              type="radio"
              name="role"
              id="expected-date-lc-issued"
              className="accent-primaryCol size-4"
            />
            <label htmlFor="expected-date-lc-issued">
              Expected date of LC issuance
            </label>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-fit justify-start text-left font-normal border-none",
                  !date &&
                    "text-muted-foreground flex items-center justify-between w-fit"
                )}
                id="period-lc-date"
              >
                {date ? format(date, "PPP") : <span>DD/MM/YYYY</span>}
                <CalendarIcon className="ml-2 mr-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <label
          id="period-expiry-date"
          className="border border-borderCol p-1 px-3 rounded-md w-full flex items-center justify-between"
        >
          <p>LC Expiry Date</p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-fit justify-start text-left font-normal border-none",
                  !date &&
                    "text-muted-foreground flex items-center justify-between w-fit"
                )}
                id="period-expiry-date"
              >
                {date ? format(date, "PPP") : <span>DD/MM/YYYY</span>}
                <CalendarIcon className="ml-2 mr-2 size-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </label>
      </div>
      <div className="border border-borderCol py-3 px-2 rounded-md w-1/3 h-full min-h-44">
        <p className="font-semibold ml-3">Port of Shipment</p>
        <div className="flex flex-col gap-y-2 mt-2">
          <DDInput
            id="port-country-select"
            label="Country"
            placeholder="Select a country"
          />
          <DDInput
            id="port-select-port"
            label="Select port"
            placeholder="Select port"
          />
        </div>
      </div>
    </div>
  );
};

export const Transhipment = () => {
  const [date, setDate] = useState<Date>();

  return (
    <div className="w-full flex items-start gap-x-4 justify-between mt-4">
      <div className="border border-borderCol py-3 px-2 rounded-md w-full">
        <p className="font-semibold mb-2 ml-3">Transhipment Allowed</p>
        <BgRadioInput
          id="transhipment-allowed-yes"
          label="Yes"
          name="transhipment-allowed"
          bg
        />
        <BgRadioInput
          id="transhipment-allowed-no"
          label="No"
          name="transhipment-allowed"
        />
      </div>
      <div className="border border-borderCol py-3 px-2 rounded-md w-full">
        <p className="font-semibold  mb-2 ml-3">
          Expecte Date to add Confirmation
        </p>
        <label
          id="expected-confirmation-date"
          className="border border-borderCol p-1 px-3 rounded-md w-full flex items-center justify-between "
        >
          <p>Select Date</p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-fit justify-start text-left font-normal border-none",
                  !date &&
                    "text-muted-foreground flex items-center justify-between w-fit"
                )}
                id="expected-confirmation-date"
              >
                {date ? format(date, "PPP") : <span>DD/MM/YYYY</span>}
                <CalendarIcon className="mr-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </label>

        <div className="flex items-center mt-2 gap-x-2 justify-between w-full">
          <Button className="flex flex-col gap-y-1 h-full w-full bg-[#1A1A26] hover:bg-[#1A1A26]/90">
            <p className="text-white">Tomorrow</p>
            <p className="text-sm text-white/80 font-thin">19 April</p>
          </Button>
          <Button className="flex flex-col gap-y-1 h-full w-full bg-[#1A1A26] hover:bg-[#1A1A26]/90">
            <p className="text-white">Next week</p>
            <p className="text-sm text-white/80 font-thin">25 April</p>
          </Button>
        </div>
      </div>
      <div className="border border-borderCol py-3 px-2 rounded-md w-full">
        <p className="font-semibold mb-2 ml-3">Product Description</p>
        <Textarea
          placeholder="Enter the description of the product (being imported under this LC)"
          className="border border-borderCol placeholder:text-para resize-none focus-visible:ring-0 focus-visible:ring-offset-0 "
          rows={4}
        />
      </div>
    </div>
  );
};

export const DiscountBanks = () => {
  return (
    <div className="flex items-center justify-between w-full mb-3 gap-x-4">
      {/* Issuing Bank */}
      <div className="border border-borderCol rounded-md py-3 px-2 w-full">
        <p className="font-semibold mb-2 ml-3">Issuing Bank</p>
        <div className="flex flex-col gap-y-2">
          <DDInput
            placeholder="Select a country"
            label="Country"
            id="select-issue-country-detail"
          />
          <DDInput
            placeholder="Select bank"
            label="Bank"
            id="select-issue-bank-detail"
          />
        </div>
      </div>
      {/* Advising Bank */}
      <div className="border border-borderCol rounded-md py-3 px-2 w-full">
        <p className="font-semibold mb-2 ml-3">Advising Bank</p>
        <div className="flex flex-col gap-y-2">
          <DDInput
            placeholder="Select a country"
            label="Country"
            id="select-advising-country-detail"
          />
          <DDInput
            placeholder="Select bank"
            label="Bank"
            id="select-advising-bank-detail"
          />
        </div>
      </div>
      {/* Confirming Bank */}
      <div className="border border-borderCol rounded-md py-3 px-2 w-full">
        <div className="flex items-center gap-x-2 justify-between mb-2">
          <p className="font-semibold  ml-3">Confirming Bank</p>
          <div>
            <input
              type="checkbox"
              id="same-as-advising"
              className="accent-primaryCol"
            />
            <label
              htmlFor="same-as-advising"
              className="ml-2 text-sm text-lightGray"
            >
              Same as advising bank
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-y-2">
          <DDInput
            placeholder="Select a country"
            label="Country"
            id="select-confirming-country-detail"
          />
          <DDInput
            placeholder="Select bank"
            label="Bank"
            id="select-confirming-bank-detail"
          />
        </div>
      </div>
    </div>
  );
};
