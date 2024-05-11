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
import { getBanks, getCountries, getPorts } from "@/services/apis/helpers.api";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export const Period = ({
  setValue,
  getValues,
}: {
  setValue: any;
  getValues: any;
}) => {
  const { data: countries, isLoading: countriesLoading } = useQuery({
    queryKey: ["countries"],
    queryFn: () => getCountries(),
  });

  const [valueChanged, setValueChanged] = useState(false);
  let shipmentCountry = getValues("shipmentPort.country");

  useEffect(() => {
    shipmentCountry = getValues("shipmentPort.country");
  }, [valueChanged]);

  const { data: shipmentPorts, isLoading: shipmentPortsLoading } = useQuery({
    queryKey: ["shipmentPorts", shipmentCountry],
    queryFn: () => getPorts(shipmentCountry),
    enabled: !!shipmentCountry,
  });

  const [lcPeriodDate, setLcPeriodDate] = useState<Date>();
  const [lcExpiryDate, setLcExpiryDate] = useState<Date>();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
  const [lcIssueType, setLcIssueType] = useState("");

  const handleRadioChange = (e: any) => {
    setLcIssueType(e.target.value);
  };
  // Function to update value in React Hook Form
  const updateValue = (name: string, value: any) => {
    setValue(name, value);
  };

  const handleSelectChange = (value: string) => {
    setValue("shipmentPort.port", value);
    setValueChanged((prev: boolean) => !prev);
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
              checked={lcIssueType === "date-lc-issued"}
              onChange={handleRadioChange}
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
              checked={lcIssueType === "expected-date"}
              onChange={handleRadioChange}
            />
            <label htmlFor="expected-date">Expected date of LC issuance</label>
          </div>
          {/* Popover for LC Period Date */}
          <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="w-fit justify-start text-left font-normal border-none text-[#B5B5BE]"
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
              {lcIssueType === "date-lc-issued" ? (
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
          className="border border-borderCol p-1 px-3 rounded-md w-full flex items-center justify-between"
        >
          <p>LC Expiry Date</p>
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
      <div className="border border-borderCol py-3 px-2 rounded-md w-1/3 h-full min-h-44 bg-[#F5F7F9]">
        <p className="font-semibold ml-3">Port of Shipment</p>
        <div className="flex flex-col gap-y-2 mt-2">
          <DDInput
            id="shipmentPort.country"
            label="Country"
            placeholder="Select a country"
            setValue={setValue}
            data={countries?.response}
            setValueChanged={setValueChanged}
          />
          <label
            id="shipmentPort.port"
            className="border border-borderCol p-1 px-3 rounded-md w-full flex items-center justify-between bg-white"
          >
            <p className="text-lightGray">Select port</p>
            <Select onValueChange={handleSelectChange}>
              <SelectTrigger
                disabled={
                  !shipmentPorts ||
                  !shipmentPorts?.response ||
                  !shipmentPorts.success
                }
                id="shipmentPort.port"
                className="w-fit border-none bg-transparent text-[#B5B5BE]"
              >
                <SelectValue placeholder="Select port" />
              </SelectTrigger>
              <SelectContent>
                {shipmentPorts &&
                  shipmentPorts.response &&
                  shipmentPorts.response.length > 0 &&
                  shipmentPorts.response?.map((val: any, idx: number) => (
                    <SelectItem
                      value={val.port_name}
                      key={`${val.port_name}-${idx}`}
                    >
                      {val.port_name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </label>
        </div>
      </div>
    </div>
  );
};

export const Transhipment = ({
  register,
  setValue,
  isDiscount,
}: {
  register: any;
  setValue: any;
  isDiscount?: boolean;
}) => {
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
            onClick={() => {
              setExpectedConfirmationDate(tomorrowDate);
              isDiscount
                ? setValue("expectedDiscountingDate", tomorrowDate)
                : setValue("expectedConfirmationDate", tomorrowDate);
            }}
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
            onClick={() => {
              setExpectedConfirmationDate(nextWeekDate);
              isDiscount
                ? setValue("expectedDiscountingDate", nextWeekDate)
                : setValue("expectedConfirmationDate", nextWeekDate);
            }}
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

export const DiscountBanks = ({
  countries,
  setValue,
  getValues,
}: {
  countries: any;
  setValue: any;
  getValues: any;
}) => {
  const [valueChanged, setValueChanged] = useState(false);

  let issuingCountry = getValues("issuingBank.country");
  let advisingCountry = getValues("advisingBank.country");
  let confirmingCountry = getValues("confirmingBank.country");
  let confirmingBank = getValues("confirmingBank.bank");

  const [confirmingBankValue,setConfirmingBankValue] = useState<string>('')


  useEffect(() => {
    issuingCountry = getValues("issuingBank.country");
    advisingCountry = getValues("advisingBank.country");
    confirmingCountry = getValues("confirmingBank.country");
  }, [valueChanged]);

  const { data: issuingBanks } = useQuery({
    queryKey: ["issuing-banks", issuingCountry],
    queryFn: () => getBanks(issuingCountry),
    enabled: !!issuingCountry,
  });

  const { data: advisingBanks } = useQuery({
    queryKey: ["advising-banks", advisingCountry],
    queryFn: () => getBanks(advisingCountry),
    enabled: !!advisingCountry,
  });

  const { data: confirmingBanks } = useQuery({
    queryKey: ["confirming-banks", confirmingCountry],
    queryFn: () => getBanks(confirmingCountry),
    enabled: !!confirmingCountry,
  });

  const handleSameAsAdvisingBank = () => {
    const advisingCountry = getValues("advisingBank.country");
    const advisingBank = getValues("advisingBank.bank");
    const confirmingBank = getValues("confirmingBank.bank");
    const confirmingCountry = getValues("confirmingBank.country");

    if (!advisingBank || !advisingCountry)
      return toast.error("Please select advising bank first");
    if (confirmingBank && confirmingCountry) {
      setValue("confirmingBank.country", undefined);
      setValue("confirmingBank.bank", undefined);
    } else {
      setValue("confirmingBank.country", advisingCountry);
      setValue("confirmingBank.bank", advisingBank);


    }
    setValueChanged(!valueChanged)

  };



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
            data={countries}
            setValue={setValue}
            setValueChanged={setValueChanged}
          />
          <DDInput
            placeholder="Select bank"
            label="Bank"
            id="issuingBank.bank"
            setValue={setValue}
            setValueChanged={setValueChanged}
            disabled={
              !issuingBanks || !issuingBanks?.response || !issuingBanks.success
            }
            data={issuingBanks?.response}
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
            data={countries}
            setValue={setValue}
            setValueChanged={setValueChanged}
          />
          <DDInput
            placeholder="Select bank"
            label="Bank"
            id="advisingBank.bank"
            setValue={setValue}
            setValueChanged={setValueChanged}
            disabled={
              !advisingBanks ||
              !advisingBanks?.response ||
              !advisingBanks.success
            }
            data={advisingBanks?.response}
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
              onChange={handleSameAsAdvisingBank}
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
            value={confirmingCountry}
            id="confirmingBank.country"
            data={countries}
            setValue={setValue}
            setValueChanged={setValueChanged}
          />
          <DDInput
            placeholder="Select bank"
            label="Bank"
            id="confirmingBank.bank"
            value={confirmingBank}
            setValue={setValue}
            setValueChanged={setValueChanged}
            disabled={
              !confirmingBanks ||
              !confirmingBanks?.response ||
              !confirmingBanks.success
            }
            data={confirmingBanks?.response}
          />
        </div>
      </div>
    </div>
  );
};
