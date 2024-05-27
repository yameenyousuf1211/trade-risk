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

export const ValidatingCalendar = ({
  initialDate,
  onChange,
  onClose,
  isPast,
  maxDate,
}: {
  initialDate: Date | undefined;
  onChange: (date: Date) => void;
  onClose: any;
  isPast?: boolean;
  maxDate?: Date | string | undefined;
}) => {
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const handleDateSelect = (date: Date) => {
    const today = new Date();
    if (isPast && date > today)
      return toast.error("Please dont select a date from future");
    if (!isPast && date < today)
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
      onSelect={handleDateSelect}
      initialFocus
    />
  );
};

export const Period = ({
  setValue,
  getValues,
  countries,
  flags,
  valueChanged,
  setValueChanged,
}: {
  setValue: any;
  getValues: any;
  countries: string[];
  flags: string[];
  valueChanged?: boolean;
  setValueChanged?: any;
}) => {
  let shipmentCountry = getValues("shipmentPort.country");
  let shipmentPort = getValues("shipmentPort.port");
  let lcStartDate = getValues("lcPeriod.startDate");
  let lcEndDate = getValues("lcPeriod.endDate");
  let lcPeriodType = getValues("lcPeriod.expectedDate");

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
      if (success) setPorts(response[0].ports);
      else setPorts([]);
    };

    shipmentCountry && fetchPorts();
  }, [shipmentCountry]);

  const [lcPeriodDate, setLcPeriodDate] = useState<Date>();
  const [lcExpiryDate, setLcExpiryDate] = useState<Date>();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
  const [lcIssueType, setLcIssueType] = useState("");

  const handleRadioChange = (e: any) => {
    setLcIssueType(e.target.value);
    setValue("lcPeriod.expectedDate", e.target.value);
  };

  const updateValue = (name: string, value: any) => {
    setValue(name, value);
  };

  useEffect(() => {
    shipmentCountry = getValues("shipmentPort.country");
    setLcPeriodDate(lcStartDate);
    setLcExpiryDate(lcEndDate);
    if (lcStartDate && lcEndDate) {
      setValue("lcPeriod.startDate", new Date(lcStartDate));
      setValue("lcPeriod.endDate", new Date(lcEndDate));
      setValue("expectedConfirmationDate", new Date(lcEndDate));
    }
    setValue("lcPeriod.expectedDate", lcPeriodType === true ? "yes" : "no");
    lcPeriodType = getValues("lcPeriod.expectedDate");
    lcStartDate && lcStartDate && setLcIssueType(lcPeriodType);
  }, [valueChanged]);

  return (
    <div className="flex items-start gap-x-4 my-5 h-full">
      <div className="border border-borderCol py-3 px-2 rounded-md w-[60%] bg-[#F5F7F9]">
        <p className="font-semibold mb-2 ml-3">LC Period</p>
        <div className="flex bg-white items-center gap-x-4 justify-between border border-borderCol rounded-md py-2 px-3 mb-3">
          <div className="w-full rounded-md flex items-center gap-x-2">
            <input
              type="radio"
              id="date-lc-issued"
              className="accent-primaryCol size-4"
              name="lcPeriod.expectedDate"
              value="yes"
              checked={lcIssueType === "yes"}
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
              name="lcPeriod.expectedDate"
              value="no"
              checked={lcIssueType === "no"}
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
                className="w-fit justify-start text-left font-normal border-none text-[#B5B5BE]"
                id="period-lc-date"
                disabled={!lcIssueType}
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
              {lcIssueType === "yes" ? (
                <ValidatingCalendar
                  initialDate={lcPeriodDate}
                  onChange={(date) => {
                    setLcPeriodDate(date);
                    updateValue("lcPeriod.startDate", date);
                  }}
                  onClose={() => setDatePopoverOpen(false)}
                  isPast
                />
              ) : (
                <ValidatingCalendar
                  initialDate={lcPeriodDate}
                  onChange={(date) => {
                    setLcPeriodDate(date);
                    updateValue("lcPeriod.startDate", date);
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
                  updateValue("lcPeriod.endDate", date);
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
            setValueChanged={setValueChanged}
          />
          <DDInput
            id="shipmentPort.port"
            label="Port"
            value={shipmentPort}
            placeholder="Select port"
            setValue={setValue}
            setValueChanged={setValueChanged}
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
  getValues,
  valueChanged,
}: {
  register: any;
  setValue: any;
  isDiscount?: boolean;
  getValues?: any;
  valueChanged?: boolean;
}) => {
  const [expectedConfirmationDate, setExpectedConfirmationDate] =
    useState<Date>();
  let expectedDate = isDiscount
    ? getValues("expectedDiscountingDate")
    : getValues("expectedConfirmationDate");
  useEffect(() => {
    setExpectedConfirmationDate(expectedDate);

    if (expectedDate) {
      isDiscount
        ? setValue("expectedDiscountingDate", new Date(expectedDate))
        : setValue("expectedConfirmationDate", new Date(expectedDate));
    }
  }, [valueChanged]);
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
  const nextWeekDate = addDays(currentDate, 7);
  const twoWeeksDate = addDays(currentDate, 14);

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
                  !expectedConfirmationDate &&
                    "text-muted-foreground flex items-center text-sm justify-between w-fit"
                )}
                id="expected-confirmation-date"
              >
                {expectedConfirmationDate ? (
                  format(expectedConfirmationDate, "PPP")
                ) : (
                  <span className="text-sm">DD/MM/YYYY</span>
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
          {/* Next week */}
          <Button
            type="button"
            className="flex flex-col gap-y-1 h-full w-full bg-[#1A1A26] hover:bg-[#1A1A26]/90"
            onClick={() => {
              setExpectedConfirmationDate(nextWeekDate);
              isDiscount
                ? setValue("expectedDiscountingDate", nextWeekDate)
                : setValue("expectedConfirmationDate", nextWeekDate);
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
              setExpectedConfirmationDate(twoWeeksDate);
              isDiscount
                ? setValue("expectedDiscountingDate", twoWeeksDate)
                : setValue("expectedConfirmationDate", twoWeeksDate);
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
