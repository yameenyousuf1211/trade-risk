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
import { format, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getCountries } from "@/services/apis/helpers.api";
import { useQuery } from "@tanstack/react-query";

export const ValidatingCalendar = ({
  initialDate,
  onChange,
  onClose,
}: {
  initialDate: Date | undefined;
  onChange: (date: Date) => void;
  onClose: any;
}) => {
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const handleDateSelect = (date: Date) => {
    const today = new Date();
    if (date < today) return toast.error("Please don't select a past date ");

    setSelectedDate(date);
    onChange(date);
    onClose();
  };

  return (
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={handleDateSelect}
      initialFocus
    />
  );
};

export const Period = ({ register, setValue }: any) => {
  const { data: countries, isLoading: countriesLoading } = useQuery({
    queryKey: ["countries"],
    queryFn: () => getCountries(),
  });

  const [lcPeriodDate, setLcPeriodDate] = useState<Date>();
  const [lcExpiryDate, setLcExpiryDate] = useState<Date>();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);

  // Function to update value in React Hook Form
  const updateValue = (name: string, value: any) => {
    setValue(name, value);
  };

  return (
    <div className="flex items-start gap-x-4 my-5">
      <div className="border border-borderCol py-3 px-2 rounded-md w-2/3 bg-[#F5F7F9]">
        <p className="font-semibold mb-2 ml-3">LC Period</p>
        <div className="flex items-center gap-x-4 justify-between border border-borderCol rounded-md py-3 px-3 mb-3">
          <div className="w-full rounded-md flex items-center gap-x-2">
            <input
              type="radio"
              id="date-lc-issued"
              value="date-lc-issued"
              className="accent-primaryCol size-4"
              name="lcPeriodType"
            />
            <label htmlFor="date-lc-issued">Date LC Issued</label>
          </div>
          <div className="w-full rounded-md flex items-center gap-x-2">
            <input
              type="radio"
              id="expected-date"
              value="expected-date"
              className="accent-primaryCol size-4"
              name="lcPeriodType"
            />
            <label htmlFor="expected-date">Expected date of LC issuance</label>
          </div>
          {/* Popover for LC Period Date */}
          <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="w-fit justify-start text-left font-normal border-none"
                id="period-lc-date"
              >
                {lcPeriodDate ? (
                  format(lcPeriodDate, "PPP")
                ) : (
                  <span>DD/MM/YYYY</span>
                )}
                <CalendarIcon className="ml-2 mr-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={lcPeriodDate}
                onSelect={(date) => {
                  setLcPeriodDate(date);
                  updateValue("lcPeriod.startDate", date);
                  setDatePopoverOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        {/* LC Expiry Date */}
        <label
          id="period-expiry-date"
          className="border border-borderCol p-1 px-3 rounded-md w-full flex items-center justify-between"
        >
          <p>LC Expiry Date</p>
          {/* Popover for LC Expiry Date */}
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="w-fit justify-start text-left font-normal border-none"
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
                  updateValue("lcPeriod.endDate", date);
                }}
                onClose={() => setIsPopoverOpen(false)}
              />
            </PopoverContent>
          </Popover>
        </label>
      </div>
      {/* Port of Shipment */}
      <div className="border border-borderCol py-3 px-2 rounded-md w-1/3 h-full min-h-44 bg-[#F5F7F9]">
        <p className="font-semibold ml-3">Port of Shipment</p>
        <div className="flex flex-col gap-y-2 mt-2">
          <DDInput
            id="shipmentPort.country"
            label="Country"
            placeholder="Select a country"
            register={register}
            data={countries?.response}
          />
          <DDInput
            label="Select port"
            id="shipmentPort.port"
            placeholder="Select port"
            register={register}
          />
        </div>
      </div>
    </div>
  );
};

export const Transhipment = ({ register, setValue, isDiscount }: any) => {
  const [expectedConfirmationDate, setExpectedConfirmationDate] =
    useState<Date>();
  const [checkedState, setCheckedState] = useState({
    "transhipment-allowed-yes": false,
    "transhipment-allowed-no": false,
  });

  const handleCheckChange = (id: string) => {
    setCheckedState((prevState) => ({
      ...prevState,
      "transhipment-allowed-yes": id === "transhipment-allowed-yes",
      "transhipment-allowed-no": id === "transhipment-allowed-no",
    }));
  };

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const currentDate = new Date();
  const tomorrowDate = addDays(currentDate, 1);
  const nextWeekDate = addDays(currentDate, 7);

  return (
    <div className="w-full flex items-start gap-x-4 justify-between mt-4">
      <div className="border border-borderCol py-3 px-2 rounded-md w-full bg-[#F5F7F9]">
        <p className="font-semibold mb-2 ml-3">Transhipment Allowed</p>
        <BgRadioInput
          id="transhipment-allowed-yes"
          label="Yes"
          name="transhipment"
          value={"yes"}
          register={register}
          checked={checkedState["transhipment-allowed-yes"]}
          handleCheckChange={handleCheckChange}
        />
        <BgRadioInput
          id="transhipment-allowed-no"
          label="No"
          name="transhipment"
          value={"no"}
          register={register}
          checked={checkedState["transhipment-allowed-no"]}
          handleCheckChange={handleCheckChange}
        />
      </div>

      <div className="border border-borderCol py-3 px-2 rounded-md w-full bg-[#F5F7F9]">
        <p className="font-semibold  mb-2 ml-3">
          {isDiscount
            ? "Expected Date for Discounting"
            : "Expected Date to add Confirmation"}
        </p>
        <label
          id="expected-confirmation-date"
          className="border border-borderCol p-1 px-3 rounded-md w-full flex items-center justify-between "
        >
          <p>Select Date</p>
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-fit justify-start text-left font-normal border-none",
                  !expectedConfirmationDate &&
                    "text-muted-foreground flex items-center justify-between w-fit"
                )}
                id="expected-confirmation-date"
              >
                {expectedConfirmationDate ? (
                  format(expectedConfirmationDate, "PPP")
                ) : (
                  <span>DD/MM/YYYY</span>
                )}
                <CalendarIcon className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <ValidatingCalendar
                initialDate={expectedConfirmationDate}
                onChange={(date) => {
                  setExpectedConfirmationDate(date);
                  isDiscount
                    ? setValue("expectedDiscountingDate", date)
                    : setValue("expectedConfirmationDate", date);
                }}
                onClose={() => setIsPopoverOpen(false)}
              />
            </PopoverContent>
          </Popover>
        </label>

        <div className="flex items-center mt-2 gap-x-2 justify-between w-full">
          <Button
            type="button"
            className="flex flex-col gap-y-1 h-full w-full bg-[#1A1A26] hover:bg-[#1A1A26]/90"
            onClick={() => setExpectedConfirmationDate(tomorrowDate)}
          >
            <p className="text-white">Tomorrow</p>
            <p className="text-sm text-white/80 font-thin">
              {" "}
              {format(tomorrowDate, "d MMMM")}
            </p>
          </Button>
          <Button
            type="button"
            className="flex flex-col gap-y-1 h-full w-full bg-[#1A1A26] hover:bg-[#1A1A26]/90"
            onClick={() => setExpectedConfirmationDate(nextWeekDate)}
          >
            <p className="text-white">Next week</p>
            <p className="text-sm text-white/80 font-thin">
              {" "}
              {format(nextWeekDate, "d MMMM")}
            </p>
          </Button>
        </div>
      </div>

      <div className="border border-borderCol py-3 px-2 rounded-md w-full bg-[#F5F7F9]">
        <p className="font-semibold mb-2 ml-3">Product Description</p>
        <Textarea
          name="productDescription"
          register={register}
          placeholder="Enter the description of the product (being imported under this LC)"
          className="bg-white border border-borderCol placeholder:text-para resize-none focus-visible:ring-0 focus-visible:ring-offset-0 "
          rows={4}
        />
      </div>
    </div>
  );
};

export const DiscountBanks = ({ register, countries }: any) => {
  return (
    <div className="flex items-center justify-between w-full mb-3 gap-x-4">
      {/* Issuing Bank */}
      <div className="border border-borderCol rounded-md py-3 px-2 w-full bg-[#F5F7F9]">
        <p className="font-semibold mb-2 ml-3">Issuing Bank</p>
        <div className="flex flex-col gap-y-2">
          <DDInput
            placeholder="Select a country"
            label="Country"
            id="issuingBank.country"
            register={register}
            data={countries}
          />
          <DDInput
            placeholder="Select bank"
            label="Bank"
            id="issuingBank.bank"
            register={register}
          />
        </div>
      </div>
      {/* Advising Bank */}
      <div className="border border-borderCol rounded-md py-3 px-2 w-full bg-[#F5F7F9]">
        <p className="font-semibold mb-2 ml-3">Advising Bank</p>
        <div className="flex flex-col gap-y-2">
          <DDInput
            placeholder="Select a country"
            label="Country"
            id="advisingBank.country"
            register={register}
            data={countries}
          />
          <DDInput
            placeholder="Select bank"
            label="Bank"
            id="advisingBank.bank"
            register={register}
          />
        </div>
      </div>
      {/* Confirming Bank */}
      <div className="border border-borderCol rounded-md py-3 px-2 w-full bg-[#F5F7F9]">
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
            id="confirmingBank.country"
            register={register}
            data={countries}
          />
          <DDInput
            placeholder="Select bank"
            label="Bank"
            id="confirmingBank.bank"
            register={register}
          />
        </div>
      </div>
    </div>
  );
};
