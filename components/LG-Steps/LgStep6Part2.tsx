import React, { useEffect, useState } from "react";
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
  const { addStep, removeStep } = useStepStore();

  // Watch for lgDetails object fields
  const lgDetailCurrency = watch("lgDetails.currency");
  const lgDetailAmount = watch("lgDetails.amount");
  const lgTenorType = watch("lgDetails.lgTenor.lgTenorType");
  const lgTenorValue = watch("lgDetails.lgTenor.lgTenorValue");
  const expectedDate = watch("lgDetails.expectedDateToIssueLg");
  const lgExpiryDate = watch("lgDetails.lgExpiryDate");
  const [currencyValue, setCurrencyValue] = useState<string | number>(
    lgDetailAmount || ""
  );
  const [rawValue, setRawValue] = useState("");

  useEffect(() => {
    if (lgDetailAmount && lgTenorValue && expectedDate && lgExpiryDate) {
      addStep(LG_DETAILS);
    } else {
      removeStep(LG_DETAILS);
    }
  }, [lgDetailAmount, lgTenorValue, expectedDate, lgExpiryDate]);

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
      setCurrencyValue(numericValue.toString().replace(/,/g, ""));
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
      const digitsOnly = lgDetailAmount?.toString().replace(/\D/g, "");
      if (digitsOnly) {
        const formattedValue = parseInt(digitsOnly).toLocaleString();
        setCurrencyValue(formattedValue);
        setRawValue(lgDetailAmount);
        setValue("lgDetails.amount", lgDetailAmount.toString());
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
        {/* Container to ensure equal height and spacing */}
        <div className="flex gap-2 w-full">
          {/* Currency and Amount Input */}
          <div className="flex items-center gap-2 w-1/2">
            <Select
              onValueChange={(value) => {
                setValue("lgDetails.currency", value);
              }}
              defaultValue={"USD"}
            >
              <SelectTrigger className="w-[100px] bg-borderCol/80 h-12">
                <SelectValue placeholder="USD" />
              </SelectTrigger>
              <SelectContent>
                {currency &&
                  currency.response.length > 0 &&
                  currency.response.map((curr: string, idx: number) => (
                    <SelectItem key={`${curr}-${idx + 1}`} value={curr}>
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
              placeholder="Enter Amount"
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="flex h-12 w-full rounded-md border border-borderCol bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* LG Tenor Input */}
          <div className="flex items-center justify-between gap-2 w-1/2 h-12 border p-1 pl-3 pr-2 rounded-md bg-white">
            <p className="text-sm w-28 text-lightGray">LG Tenor</p>
            <div className="flex items-center gap-2 w-1/2 justify-end">
              <Select
                onValueChange={(value) =>
                  setValue("lgDetails.lgTenor.lgTenorType", value)
                }
                defaultValue={lgTenorType || "Months"}
              >
                <SelectTrigger className="bg-borderCol/80 w-28 !py-5">
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
                className="border rounded-md w-[40%] flex items-center justify-between bg-white"
              >
                <Input
                  register={register}
                  name="lgDetails.lgTenor.lgTenorValue"
                  type="text"
                  className="block bg-none text-sm border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="No."
                />
              </label>
            </div>
          </div>
        </div>

        {/* Expected Date and Expiry Date */}
        <div className="flex items-center gap-2 mt-4">
          <label
            id="expectedDate"
            className="border p-1 px-2 rounded-md w-[50%] flex items-center justify-between bg-white"
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
              disabled={{
                before: new Date(new Date().setDate(new Date().getDate() + 1)), // Disables all dates before and including today
              }}
            />
          </label>
          <label
            id="lgExpiryDate"
            className="border p-1 px-2 rounded-md w-[50%] flex items-center justify-between bg-white"
          >
            <p className="w-full text-sm text-lightGray">LG Expiry Date</p>
            <DatePicker
              value={lgExpiryDate}
              extraClassName="border-0 text-right justify-end"
              leftText={false}
              name="lgDetails.lgExpiryDate"
              setValue={setValue}
              disabled={{
                before: new Date(expectedDate), // Disables all dates before and including today
              }}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default LgStep6Part2;
