import React, { useEffect, useState, useMemo } from "react";
import { LgStepsProps2 } from "@/types/lg";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { getCurrency } from "@/services/apis/helpers.api";
import { useQuery } from "@tanstack/react-query";
import { DatePicker } from "../helpers";
import useStepStore from "@/store/lcsteps.store";
import { LG_DETAILS } from "@/utils/constant/lg";

const LgStep6Part2: React.FC<LgStepsProps2> = ({
  register,
  watch,
  setStepCompleted,
  setValue,
}) => {
  const [number, setNumber] = useState("");
  const { addStep, removeStep } = useStepStore();

  // Watch for lgDetails object fields
  const lgDetailCurrency = watch("lgDetails.currency");
  const lgDetailAmount = watch("lgDetails.amount");
  const lgTenorType = watch("lgDetails.LgTenor.type"); // Now watching lgDetails.lgTenorType
  const lgTenorValue = watch("lgDetails.number"); // Now watching lgDetails.lgTenorValue
  const expectedDate = watch("lgDetails.expectedDateToIssueLg");
  const lgExpiryDate = watch("lgDetails.lgExpiryDate");
  const [currencyValue, setCurrencyValue] = useState<string | number>(
    lgDetailAmount || ""
  );
  const [rawValue, setRawValue] = useState("");

  useEffect(() => {
    console.log(lgExpiryDate, "lgExpiryDate");
    if (lgDetailAmount && lgTenorValue && expectedDate && lgExpiryDate) {
      addStep(LG_DETAILS);
    } else {
      removeStep(LG_DETAILS);
    }
  }, [lgDetailAmount, lgTenorValue, expectedDate, lgExpiryDate]);

  // Function to format number with commas
  const formatNumberWithCommas = (value: string) => {
    const numberString = value.replace(/,/g, "");
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const { data: currency } = useQuery({
    queryKey: ["currency"],
    queryFn: getCurrency,
    staleTime: 10 * 60 * 5000,
  });

  const handleChange = (e: any) => {
    const { value } = e.target;

    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly) {
      const formattedValue = parseInt(digitsOnly).toLocaleString();
      setCurrencyValue(formattedValue);
      setRawValue(digitsOnly);
      setValue("lgDetails.amount", digitsOnly);
    } else {
      setCurrencyValue("");
      setRawValue("");
      setValue("lgDetails.amount", "");
    }
  };

  const handleFocus = () => {
    if (rawValue) {
      const numericValue = parseFloat(rawValue);
      if (numericValue % 1 === 0) {
        setCurrencyValue(numericValue.toString().replace(/,/g, ""));
      } else {
        setCurrencyValue(numericValue.toString().replace(/,/g, ""));
      }
    }
  };

  const handleBlur = () => {
    if (rawValue) {
      const numericValue = parseFloat(rawValue);
      const formattedValue = numericValue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      setCurrencyValue(formattedValue);
    }
  };

  useEffect(() => {
    if (lgDetailAmount) {
      const digitsOnly = lgDetailAmount?.toString().replace(/\D/g, ""); // Remove non-digit characters
      if (digitsOnly) {
        const formattedValue = parseInt(digitsOnly).toLocaleString(); // Format with commas and add ".00"
        setCurrencyValue(formattedValue); // Set formatted value with ".00"
        setRawValue(lgDetailAmount); // Set raw value without formatting

        setValue("lgDetails.amount", lgDetailAmount.toString()); // Set the raw amount in the form state
      }
    }
  }, [lgDetailAmount]);

  return (
    <div
      id="lg-step6"
      className="py-3 px-2 border border-borderCol rounded-lg w-full scroll-target"
    >
      <div className="flex items-center gap-x-2 ml-3 mb-3">
        <p className="text-sm size-6 rounded-full bg-primaryCol center text-white font-semibold">
          6
        </p>
        <p className="font-semibold text-[16px] text-lightGray">LG Details</p>
      </div>
      <div className="rounded-lg">
        {/* Currency Selection */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-x-2 ">
            <Select
              onValueChange={(value) => {
                setValue("lgDetails.currency", value);
              }}
            >
              <SelectTrigger className="w-[100px] bg-borderCol/80">
                <SelectValue placeholder="USD" />
              </SelectTrigger>
              <SelectContent>
                {currency &&
                  currency.response.length > 0 &&
                  currency.response.map((curr: string, idx: number) => (
                    <SelectItem
                      defaultValue="USD"
                      key={`${curr}-${idx + 1}`}
                      value={curr}
                    >
                      {curr}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <input
              type="text"
              inputMode="numeric"
              {...register("amount")}
              value={currencyValue}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="flex h-10 w-[55%] w-full rounded-md border border-borderCol bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <label
            id="lgTenor"
            className="border flex-1 py-1 px-2 rounded-md flex items-center justify-between bg-white"
          >
            <p className="text-sm w-48 text-lightGray">LG Tenor</p>
            <Select
              onValueChange={
                (value) => setValue("lgDetails.LgTenor.type", value) // Update lgTenorType directly
              }
              defaultValue={lgTenorType || "Months"}
            >
              <SelectTrigger className="bg-borderCol/80 w-28 mx-2 !py-6">
                <SelectValue placeholder="Months" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Months">Months</SelectItem>
                <SelectItem value="Days">Days</SelectItem>
                <SelectItem value="Years">Years</SelectItem>
              </SelectContent>
            </Select>
            <label
              id="lgTenorValue"
              className="border p-1 px-3 rounded-md w-[30%] flex items-center justify-between bg-white"
            >
              <p className="w-full text-sm text-lightGray">No.</p>
              <Input
                register={register}
                name="lgDetails.number" // Updated lgTenorValue
                type="text"
                className="block bg-none text-sm text-end border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder=""
              />
            </label>
          </label>
        </div>

        {/* Expected Date and Expiry Date */}
        <div className="flex items-center gap-3">
          <label
            id="expectedDate"
            className="border p-1 px-2 rounded-md w-[55%] flex items-center justify-between bg-white"
          >
            <p className="w-full text-sm text-lightGray">
              Expected Date to Issue LG
            </p>
            <DatePicker
              value={expectedDate}
              extraClassName="border-0 text-right justify-end"
              leftText={false}
              name="lgDetails.expectedDateToIssueLg"
              setValue={setValue}
            />
          </label>
          <label
            id="lgExpiryDate"
            className="border p-1 px-2 rounded-md w-[55%] flex items-center justify-between bg-white"
          >
            <p className="w-full text-sm text-lightGray">LG Expiry Date</p>
            <DatePicker
              value={lgExpiryDate}
              extraClassName="border-0 text-right justify-end"
              leftText={false}
              name="lgDetails.lgExpiryDate"
              setValue={setValue}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default LgStep6Part2;
