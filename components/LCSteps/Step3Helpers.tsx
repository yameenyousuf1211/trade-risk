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
import useLcIssuance from "@/store/issueance.store";

export const ValidatingCalendar = ({
  initialDate,
  onChange,
  onClose,
  isPast,
  maxDate,
  startDate = new Date(),
  endDate,
  isEndDate = false,
  disabled,
}: {
  initialDate: Date | undefined;
  onChange: (date: Date) => void;
  onClose: any;
  isPast?: boolean;
  maxDate?: Date | string | undefined;
  startDate?: Date | string;
  endDate?: Date | string;
  disabled?: {
    before?: Date | undefined;
    after?: Date | undefined;
  };
  isEndDate?: boolean;
}) => {
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const date = new Date();
  date.setDate(5);

  const handleDateSelect = (date: Date) => {
    const today = new Date();
    if (isPast && date > today)
      return toast.error("Please dont select a date from future");
    // if (!isPast && date < today && !isEndDate)
    //   return toast.error("Please don't select a past date ");
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
      // @ts-ignore
      disabled={disabled}
      // @ts-ignore
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
  console.log(watch("expectedConfirmationDate"), "expectedConfirmationDate");

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [portCountries, setPortCountries] = useState<string[]>([]);
  const [ports, setPorts] = useState<string[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
  console.log(watch(), "START____DATE");

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
      const allPortCountries = portsData.response.map(
        (port: any) => port.country,
      );
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

  const handleRadioChange = (e: any) => {
    setValue("period.expectedDate", e.target.value);
    setValue("period.startDate", null);
    setValue("period.endDate", null);
    // Reset LC Expiry Date when LC Issued Date or Expected Date changes
    setEndDate(null);
  };

  const updateValue = (name: string, value: any) => {
    setValue(name, value);
  };

  const handleExpiryDateSelect = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to avoid issues with time comparison
    const lcStartDateMidnight = lcStartDate ? new Date(lcStartDate) : null;
    lcStartDateMidnight?.setHours(0, 0, 0, 0); // Reset lcStartDate time for comparison

    // if (date < today) {
    //   return toast.error(
    //     "LC Expiry Date cannot be in the past or today's date",
    //   );
    // }
    setEndDate(date);
    updateValue("period.endDate", date);
  };

  useEffect(() => {
    if (lcPeriodType === "yes") {
      setStartDate(new Date());
    }
  }, [lcPeriodType]);

  return (
    <div className="my-5 flex h-full items-start gap-x-4">
      <div className="w-[60%] rounded-md border border-borderCol bg-[#F5F7F9] px-2 py-3">
        {/* <p className="font-semibold mb-2 ml-3">LC Period</p> */}
        <p className="mb-2 ml-3 font-semibold"> LC Issuance</p>

        <div className="mb-3 flex items-center justify-between gap-x-4 rounded-md border border-borderCol bg-white px-3 py-2">
          <div className="flex w-full items-center gap-x-2 rounded-md">
            <input
              type="radio"
              id="date-lc-issued"
              className="size-4 accent-primaryCol"
              name="period.expectedDate"
              value="yes"
              checked={lcPeriodType === "yes"}
              onChange={handleRadioChange}
            />
            <label
              htmlFor="date-lc-issued"
              className="text-sm font-normal text-lightGray"
            >
              Date LC Issued
            </label>
          </div>
          <div className="flex w-full items-center gap-x-2 rounded-md">
            <input
              type="radio"
              id="expected-date"
              className="size-4 !bg-white accent-primaryCol"
              name="period.expectedDate"
              value="no"
              checked={lcPeriodType === "no"}
              onChange={handleRadioChange}
            />
            <label
              htmlFor="expected-date"
              className="text-sm font-normal text-lightGray"
            >
              Expected date of LC issuance
            </label>
          </div>
          {/* Popover for LC Period Date */}
          <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={`w-fit justify-start border-none text-left font-normal ${
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
              <ValidatingCalendar
                initialDate={lcStartDate}
                onChange={(date) => {
                  updateValue("period.startDate", date);
                  setStartDate(startDate);
                  // Reset LC Expiry Date when LC Start Date changes
                  setEndDate(null);
                  setValue("period.endDate", null);
                }}
                disabled={{
                  after: lcPeriodType === "yes" ? new Date() : undefined,
                  before:
                    lcPeriodType === "no"
                      ? new Date(new Date().setDate(new Date().getDate() + 1))
                      : undefined,
                }}
                onClose={() => setDatePopoverOpen(false)}
                isPast={lcPeriodType === "yes"}
              />
            </PopoverContent>
          </Popover>
        </div>
        {/* LC Expiry Date */}
        <label
          id="period-expiry-date"
          className="flex w-full items-center justify-between rounded-md border border-borderCol bg-white p-1 px-3"
        >
          <p className="text-sm font-normal text-lightGray">LC Expiry Date</p>
          {/* Popover for LC Expiry Date */}
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={`w-fit justify-start border-none text-left font-normal ${
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
                startDate={lcStartDate}
                initialDate={lcEndDate}
                disabled={{
                  before: lcStartDate
                    ? new Date(
                        new Date(lcStartDate).setDate(
                          new Date(lcStartDate).getDate() + 1,
                        ),
                      )
                    : undefined, // Disable lcStartDate + 1 and all dates before it
                }}
                onChange={handleExpiryDateSelect}
                onClose={() => setIsPopoverOpen(false)}
              />
            </PopoverContent>
          </Popover>
        </label>
      </div>
      {/* Port of Shipment */}
      <div className="h-[178px] min-h-40 w-[40%] rounded-md border border-borderCol bg-[#F5F7F9] px-2 py-3">
        <p className="ml-3 font-semibold">Port of Shipment</p>
        <div className="mt-2 flex flex-col gap-y-2">
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

  const expectedDateName = isDiscount
    ? "expectedDiscountingDate"
    : "expectedConfirmationDate";

  let expectedDate = watch(expectedDateName);

  const setDate = (date: Date | string) => {
    setValue(expectedDateName, date);
  };

  const { data } = useLcIssuance();
  const initialExpectedDate: string = data[expectedDate as keyof typeof data];

  useEffect(() => {
    if (initialExpectedDate && !expectedDate) {
      setDate(new Date(initialExpectedDate));
    }
  }, [data, initialExpectedDate]);

  let lcStartDate = watch("period.startDate");
  let lcEndDate = watch("period.endDate");

  // useEffect(() => {
  //   if (lcEndDate || lcStartDate) setDate(undefined);
  // }, [lcStartDate, lcEndDate]);

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const currentDate = new Date();
  const nextWeekDate = addDays(
    period?.startDate ? period?.startDate : currentDate,
    7,
  );
  const twoWeeksDate = addDays(
    period?.startDate ? period?.startDate : currentDate,
    14,
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
    <div className="flex w-full flex-col gap-6">
      <div className="mt-4 flex w-full items-start justify-between gap-x-4">
        <div className="w-full rounded-md border border-borderCol bg-[#F5F7F9] px-2 py-3">
          <p className="mb-2 ml-3 text-[16px] font-semibold">
            Transhipment Allowed
          </p>
          <div className="flex gap-2">
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
        </div>

        <div className="h-[120px] w-full rounded-md border border-borderCol bg-[#F5F7F9] px-2 py-3">
          <p className="mb-2 ml-3 text-[16px] font-semibold">
            {isDiscount
              ? "Expected Date for Discounting"
              : "Expected Date to add Confirmation"}
          </p>
          <label
            id="expected-confirmation-date"
            className="flex w-full items-center justify-between rounded-md border border-borderCol bg-white p-1 px-3"
          >
            <p className="text-sm font-normal text-lightGray">Select Date</p>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-fit justify-start border-none text-left font-normal",
                    !expectedDate &&
                      "flex w-fit items-center justify-between text-sm text-muted-foreground",
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
                  disabled={{
                    before: new Date(lcStartDate),
                    after: new Date(lcEndDate),
                  }}
                />
              </PopoverContent>
            </Popover>
          </label>
        </div>
      </div>
      <div className="h-full w-full rounded-md border border-borderCol bg-[#F5F7F9] px-2 py-3">
        <div className="mb-2 flex items-center gap-x-2">
          <p className="ml-3 font-semibold">Product Description</p>
          {showDescErr && (
            <span className="text-[12px] text-red-500">
              Only digits are not allowed
            </span>
          )}
        </div>
        <Textarea
          name="productDescription"
          register={register}
          onChange={(e) => handleDescChange(e.target.value)}
          placeholder="Enter the description of the product (being imported under this LC)"
          className="resize-none border border-borderCol bg-white placeholder:text-para focus-visible:ring-0 focus-visible:ring-offset-0"
          rows={4}
        />
      </div>
    </div>
  );
};
