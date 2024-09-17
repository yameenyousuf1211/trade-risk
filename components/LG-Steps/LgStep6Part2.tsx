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

  const handleChange = (event: any) => {
    const { value } = event.target;
    const formattedNumber = formatNumberWithCommas(value);
    setNumber(formattedNumber);
    setValue("lgDetails.amount", value);
  };

  const { data: currency } = useQuery({
    queryKey: ["currency"],
    queryFn: getCurrency,
    staleTime: 10 * 60 * 5000,
  });

  const currencyOptions = useMemo(
    () =>
      currency?.response.map((curr: string, idx: number) => (
        <SelectItem key={`${curr}-${idx + 1}`} value={curr}>
          {curr}
        </SelectItem>
      )),
    [currency]
  );

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
          <Select
            onValueChange={(value) => setValue("lgDetails.currency", value)}
            defaultValue={lgDetailCurrency || "USD"}
          >
            <SelectTrigger className="bg-borderCol/80 w-20 !py-7">
              <SelectValue placeholder="USD" />
            </SelectTrigger>
            <SelectContent>{currencyOptions}</SelectContent>
          </Select>

          {/* Amount Input */}
          <label
            id="lgDetailAmount"
            className="border p-2 px-3 rounded-md w-[55%] flex items-center justify-between bg-white"
          >
            <p className="w-full text-sm text-lightGray">Enter Amount</p>
            <Input
              register={register}
              name="lgDetails.amount"
              type="text"
              value={number}
              onChange={handleChange}
              className="block bg-none text-sm text-end border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder=""
              onBlur={() =>
                setNumber((prev) =>
                  !prev || prev?.includes(".00") ? prev : prev + ".00"
                )
              }
            />
          </label>
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
              isLg={true}
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
              isLg={true}
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
