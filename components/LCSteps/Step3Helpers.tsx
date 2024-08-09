"use client";
import { useEffect, useState } from "react";
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
import { getAllPortData, getPorts } from "@/services/apis/helpers.api";
import { useQuery } from "@tanstack/react-query";
import {
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";

export const ValidatingCalendar = ({
  initialDate,
  onChange,
  onClose,
  isPast,
  maxDate,
  startDate,
  endDate,
  isEndDate = false,
}: {
  initialDate: Date | undefined;
  onChange: (date: Date) => void;
  onClose: any;
  isPast?: boolean;
  maxDate?: Date | string | undefined;
  startDate?: Date | string;
  endDate?: Date | string;
  isEndDate?: boolean;
}) => {
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const date = new Date();
  date.setDate(5);

  const handleDateSelect = (date: Date) => {
    const today = new Date();
    if (isPast && date > today)
      return toast.error("Please dont select a date from future");
    if (!isPast && date < today && !isEndDate)
      return toast.error("Please don't select a past date ");
    if (maxDate) {
      const max = new Date(maxDate);
      if (date > max)
        return toast.error("Please select a date that comes before LC expiry");
    }
    setSelectedDate(date);
    onChange(date);
    onClose();
  };

  return (
    <Calendar
      mode="single"
      selected={selectedDate}
      defaultMonth={(startDate as Date) && (startDate as Date)} // Start the calendar from this date
      disabled={{
        before: startDate ? new Date(startDate) : undefined,
        after: endDate ? new Date(endDate) : undefined,
      }} // @ts-ignore
      onSelect={handleDateSelect}
      initialFocus
    />
  );
};

export const Period = ({
  setValue,
  watch,
  flags,
}: {
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  flags: string[];
}) => {
  let shipmentCountry = watch("shipmentPort.country");
  let shipmentPort = watch("shipmentPort.port");
  let lcStartDate = watch("period.startDate");
  let lcEndDate = watch("period.endDate");
  let lcPeriodType = watch("period.expectedDate");
  const [startDate, setStartDate] = useState<any>("");
  const [endDate, setEndDate] = useState<any>("");

  const [portCountries, setPortCountries] = useState<string[]>([]);
  const [ports, setPorts] = useState<string[]>([]);

  const { data: portsData } = useQuery({
    queryKey: ["port-countries"],
    queryFn: () => getAllPortData(),
  });

  useEffect(() => {
    if (
      portsData &&
      portsData.success &&
      portsData.response &&
      portsData.response.length > 0
    ) {
      const allPortCountries = portsData.response.map((port: any) => {
        return port.country;
      });
      setPortCountries(allPortCountries);
    }
  }, [portsData]);

  useEffect(() => {
    const fetchPorts = async () => {
      const { success, response } = await getPorts(shipmentCountry);
      if (success) setPorts(response[0]?.ports);
      else setPorts([]);
    };

    shipmentCountry && fetchPorts();
  }, [shipmentCountry]);

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);

  const handleRadioChange = (e: any) => {
    setValue("period.expectedDate", e.target.value);
  };

  const updateValue = (name: string, value: any) => {
    setValue(name, value);
  };

  return (
    <div className="flex items-start gap-x-4 my-5 h-full">
      <div className="border border-borderCol py-3 px-2 rounded-md w-[60%] bg-[#F5F7F9]">
        {/* <p className="font-semibold mb-2 ml-3">LC Period</p> */}
        <p className="font-semibold mb-2 ml-3"> LC Issuance</p>

        <div className="flex bg-white items-center gap-x-4 justify-between border border-borderCol rounded-md py-2 px-3 mb-3">
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
          {/* Popover for LC Period Date */}
          <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={`w-fit justify-start text-left font-normal border-none ${
                  lcStartDate ? "text-black" : "text-[#B5B5BE]"
                }`}
                id="period-lc-date"
                disabled={!lcPeriodType}
              >
                {lcStartDate ? (
                  format(lcStartDate, "PPP")
                ) : (
                  <span>DD/MM/YYYY</span>
                )}
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
        {/* LC Expiry Date */}
        <label
          id="period-expiry-date"
          className="border bg-white border-borderCol p-1 px-3 rounded-md w-full flex items-center justify-between"
        >
          <p className="text-sm text-lightGray font-normal">LC Expiry Date</p>
          {/* Popover for LC Expiry Date */}
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={`w-fit justify-start text-left font-normal border-none ${
                  lcEndDate ? "text-black" : "text-[#B5B5BE]"
                }`}
                id="period-expiry-date"
              >
                {lcEndDate ? format(lcEndDate, "PPP") : <span>DD/MM/YYYY</span>}
                <CalendarIcon className="ml-2 mr-2 size-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <ValidatingCalendar
                isEndDate={true}
                startDate={startDate}
                initialDate={lcEndDate}
                onChange={(date) => {
                  updateValue("period.endDate", date);
                  // setStartDate("");
                }}
                onClose={() => setIsPopoverOpen(false)}
              />
            </PopoverContent>
          </Popover>
        </label>
      </div>
      {/* Port of Shipment */}
      <div className="border border-borderCol py-3 px-2 rounded-md w-[40%] h-[178px] min-h-40 bg-[#F5F7F9]">
        <p className="font-semibold ml-3">Port of Shipment</p>
        <div className="flex flex-col gap-y-2 mt-2">
          <DDInput
            id="shipmentPort.country"
            label="Country"
            value={shipmentCountry}
            placeholder="Select a country"
            setValue={setValue}
            data={portCountries}
            disabled={portCountries.length <= 0}
            flags={flags}
          />
          <DDInput
            id="shipmentPort.port"
            label="Port"
            value={shipmentPort}
            placeholder="Select port"
            setValue={setValue}
            disabled={!ports || ports.length === 0}
            data={ports}
          />
        </div>
      </div>
    </div>
  );
};

export const Transhipment = ({
  register,
  setValue,
  isDiscount,
  watch,
}: {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  isDiscount?: boolean;
  watch: UseFormWatch<any>;
}) => {
  const transhipment = watch("transhipment");
  const { period } = watch();

  let expectedDate = isDiscount
    ? watch("expectedDiscountingDate")
    : watch("expectedConfirmationDate");

  const setDate = (date: Date | string) => {
    isDiscount
      ? setValue("expectedDiscountingDate", date)
      : setValue("expectedConfirmationDate", date);
  };
  let lcStartDate = watch("period.startDate");
  let lcEndDate = watch("period.endDate");

  useEffect(() => {
    if(lcEndDate|| lcStartDate)setDate(undefined);
  }, [lcStartDate,lcEndDate]);

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const currentDate = new Date();
  const nextWeekDate = addDays(
    period?.startDate ? period?.startDate : currentDate,
    7
  );
  const twoWeeksDate = addDays(
    period?.startDate ? period?.startDate : currentDate,
    14
  );

  const [showDescErr, setShowDescErr] = useState(false);

  const handleDescChange = (desc: string) => {
    if (/^\d+$/.test(desc)) setShowDescErr(true);
    else setShowDescErr(false);
    if (/^\d+$/.test(desc)) {
      return;
    } else {
      setValue("productDescription", desc);
    }
  };

  return (
    <div className="w-full flex items-start gap-x-4 justify-between mt-4">
      <div className="border border-borderCol py-3 px-2 rounded-md w-full bg-[#F5F7F9] h-44">
        <p className="text-[16px] font-semibold mb-2 ml-3">
          Transhipment Allowed
        </p>
        <BgRadioInput
          id="transhipment-allowed-yes"
          label="Yes"
          name="transhipment"
          value={"yes"}
          register={register}
          checked={transhipment === "yes"}
        />
        <BgRadioInput
          id="transhipment-allowed-no"
          label="No"
          name="transhipment"
          value={"no"}
          register={register}
          checked={transhipment === "no"}
        />
      </div>

      <div className="border border-borderCol py-3 px-2 rounded-md w-full bg-[#F5F7F9] h-44">
        <p className="text-[16px] font-semibold mb-2 ml-3">
          {isDiscount
            ? "Expected Date for Discounting"
            : "Expected Date to add Confirmation"}
        </p>
        <label
          id="expected-confirmation-date"
          className="border border-borderCol p-1 px-3 rounded-md w-full flex items-center justify-between "
        >
          <p className="text-sm text-lightGray font-normal">Select Date</p>
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-fit justify-start text-left font-normal border-none",
                  !expectedDate &&
                    "text-muted-foreground flex items-center text-sm justify-between w-fit"
                )}
                id="expected-confirmation-date"
              >
                {expectedDate ? (
                  format(expectedDate, "PPP")
                ) : (
                  <span className="text-sm">DD/MM/YYYY</span>
                )}
                <CalendarIcon className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <ValidatingCalendar
                startDate={period?.startDate}
                endDate={period?.endDate}
                initialDate={expectedDate}
                onChange={(date) => {
                  setDate(date);
                }}
                onClose={() => setIsPopoverOpen(false)}
              />
            </PopoverContent>
          </Popover>
        </label>

        <div className="flex items-center mt-2 gap-x-2 justify-between w-full">
          {/* Next week */}
          <Button
            type="button"
            className="flex flex-col gap-y-1 h-full w-full bg-[#1A1A26] hover:bg-[#1A1A26]/90"
            onClick={() => {
              setDate(nextWeekDate);
            }}
          >
            <p className="text-white text-[12px] font-semibold">Next week</p>
            <p className="text-[10px] text-white/80 font-normal -mt-1">
              {" "}
              {format(nextWeekDate, "d MMMM")}
            </p>
          </Button>
          {/* 2 weeks */}
          <Button
            type="button"
            className="flex flex-col gap-y-1 h-full w-full bg-[#1A1A26] hover:bg-[#1A1A26]/90"
            onClick={() => {
              setDate(twoWeeksDate);
            }}
          >
            <p className="text-white text-[12px] font-semibold">Two Weeks</p>
            <p className="text-[10px] text-white/80 font-normal -mt-1">
              {" "}
              {format(twoWeeksDate, "d MMMM")}
            </p>
          </Button>
        </div>
      </div>

      <div className="border border-borderCol py-3 px-2 rounded-md w-full bg-[#F5F7F9] h-full">
        <div className="mb-2 flex items-center gap-x-2">
          <p className="font-semibold ml-3">Product Description</p>
          {showDescErr && (
            <span className="text-red-500 text-[12px]">
              Only digits are not allowed
            </span>
          )}
        </div>
        <Textarea
          name="productDescription"
          register={register}
          onChange={(e) => handleDescChange(e.target.value)}
          placeholder="Enter the description of the product (being imported under this LC)"
          className="bg-white border border-borderCol placeholder:text-para resize-none focus-visible:ring-0 focus-visible:ring-offset-0 "
          rows={4}
        />
      </div>
    </div>
  );
};
