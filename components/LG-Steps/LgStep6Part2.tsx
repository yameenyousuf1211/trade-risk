import React, { useEffect, useMemo, useState } from "react";
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
import { toast } from "sonner";
import useStepStore from "@/store/lcsteps.store";
import { LG_DETAILS } from "@/utils/constant/lg";
import useLcIssuance from "@/store/issueance.store";

const LgStep6Part2: React.FC<LgStepsProps2> = ({
  register,
  watch,
  setStepCompleted,
  setValue,
  name,
}) => {
  const [number, setNumber] = useState("");
  const { data } = useLcIssuance();

  useEffect(() => {
    if (number && !number?.toString()?.includes(".00")) {
      setNumber((prev) => prev + ".00");
    }
  }, [number]);


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

  const lgDetailCurrency = watch(`${name}.lgDetailCurrency`);
  const lgDetailAmount = watch(`${name}.lgDetailAmount`);
  const cashMargin = watch(`${name}.cashMargin`);
  const lgTenorType = watch(`${name}.lgTenor.lgTenorType`);
  console.log("🚀 ~ cashMargin:", cashMargin);
  const lgTenorValue = watch(`${name}.lgTenor.lgTenorValue`);
  const expectedDate = watch(`${name}.expectedDate`);
  const lgExpiryDate = watch(`${name}.lgExpiryDate`);
  console.log("🚀 ~ expectedDate:", expectedDate);
  console.log("🚀 ~ lgExpiryDate:", lgExpiryDate);
  const { addStep, removeStep } = useStepStore();


  useEffect(() => {
    if (cashMargin && !cashMargin?.toString()?.includes(".00")) {
      setValue(`${name}.cashMargin`, cashMargin + ".00");
    }
  }, [cashMargin]);

  useEffect(() => {
    if (!lgDetailCurrency) setValue(`${name}.lgDetailCurrency`, "USD");
    if (!lgTenorType) setValue(`${name}.lgTenor.lgTenorType`, "Months");
  }, []);

  useEffect(() => {
    //@ts-ignore
    if (data[name]?.lgDetailAmount) {
      //@ts-ignore
      setValue(`${name}.lgDetailAmount`, data[name]?.lgDetailAmount);
      //@ts-ignore
      setNumber(formatNumberWithCommas(data[name]?.lgDetailAmount));
      //@ts-ignore
      setValue(`${name}.expectedDate`, data[name]?.expectedDate);
      //@ts-ignore
      setValue(`${name}.lgExpiryDate`, data[name]?.lgExpiryDate);
    }
  }, [data]);

  useEffect(() => {
    if (
      lgDetailAmount &&
      cashMargin &&
      lgTenorValue &&
      expectedDate &&
      lgExpiryDate
    ) {
      addStep(LG_DETAILS);
    } else removeStep(LG_DETAILS);
  }, [lgDetailAmount, cashMargin, lgTenorValue, expectedDate, lgExpiryDate]);

  // Function to format number with commas
  const formatNumberWithCommas = (value: string) => {
    value = value?.toString();
    const numberString = value.replace(/,/g, ""); // Remove existing commas
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const value = event.target.value;
    const filteredValue = value;
    setValue(name, !filteredValue ? 0 : parseInt(filteredValue));
  };

  const handleOnChangeForCommmas = (
    event: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const value = event.target.value;
    if (!isNaN(value.replace(/,/g, ""))) {
      setValue(name, !value ? "0" : formatNumberWithCommas(value));
    }
  };

  // Handler for input change
  const handleChange = (event: any) => {
    const { value } = event.target;
    handleOnChange(event, `${name}.lgDetailAmount`);
    if (!isNaN(value.replace(/,/g, ""))) {
      // Ensure the value is a valid number
      const formattedNumber = formatNumberWithCommas(value);
      setNumber(formattedNumber);
    }
  };

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
        <div className="flex items-center gap-2 mb-2">
          <Select
            onValueChange={(value) =>
              setValue(`${name}.lgDetailCurrency`, value)
            }
          >
            <SelectTrigger
              className="bg-borderCol/80 w-20 !py-7"
              defaultValue="USD"
            >
              <SelectValue placeholder="USD" />
            </SelectTrigger>
            <SelectContent>{currencyOptions}</SelectContent>
          </Select>
          <label
            id="lgDetailAmount"
            className="border p-2 px-3 rounded-md w-[55%] flex items-center justify-between bg-white"
          >
            <p className="w-full text-sm text-lightGray">Enter Amount</p>
            <Input
              register={register}
              name={`${name}.lgDetailAmount`}
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
          {/* <label
            id="cashMargin"
            className="border flex-1 p-1 pl-2 rounded-md flex items-center justify-between bg-white"
          >
            <p className="text-sm w-48 text-lightGray">Cash Margin Required</p>
            <Select
              onValueChange={(value) => setValue(`${name}.cashMargin`, value)}
            >
              <SelectTrigger
                className="bg-borderCol/80 w-20 mx-2 !py-6"
                defaultValue="USD"
              >
                <SelectValue placeholder="USD" />
              </SelectTrigger>
              <SelectContent>{currencyOptions}</SelectContent>
            </Select>
            <label
              id="cashMarginAmount"
              className="border p-1 px-3 rounded-md w-[55%] flex items-center justify-between bg-white"
            >
              <p className="w-full text-sm text-lightGray">Enter Amount</p>
              <Input
                register={register}
                name={`${name}.cashMargin`}
                onChange={(e) =>
                  handleOnChangeForCommmas(e, `${name}.cashMargin`)
                }
                value={cashMargin}
                onBlur={() =>
                  setValue(
                    `${name}.cashMargin`,
                    cashMargin?.includes(".00") || !cashMargin
                      ? cashMargin
                      : cashMargin + ".00"
                  )
                }
                type="text"
                className="block bg-none text-sm text-end border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder=""
              />
            </label>
          </label> */}

<label
            id="lgTenor"
            className="border flex-1 py-1 px-2 rounded-md flex items-center justify-between bg-white"
          >
            <p className="text-sm w-48 text-lightGray">LG Tenor</p>
            <Select
              onValueChange={(value) =>
                setValue(`${name}.lgTenor.lgTenorType`, value)
              }
            >
              <SelectTrigger
                className="bg-borderCol/80 w-28 mx-2 !py-6"
                defaultValue="Months"
              >
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
              className="border p-1 px-3 rounded-md w-[55%] flex items-center justify-between bg-white"
            >
              <p className="w-full text-sm text-lightGray">No.</p>
              <Input
                register={register}
                name={`${name}.lgTenor.lgTenorValue`}
                onChange={(e) =>
                  handleOnChange(e, `${name}.lgTenor.lgTenorValue`)
                }
                type="text"
                className="block bg-none text-sm text-end border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder=""
              />
            </label>
          </label>
        </div>
        <div className="flex items-center gap-3">
        
          <label
            id="expectedDate"
            className="border p-1 px-2 rounded-md w-[55%] flex items-center justify-between bg-white"
          >
            <p className="w-full text-sm text-lightGray">
              Expected Date to Issue LG
            </p>
            <DatePicker
              value={!expectedDate ? undefined : new Date(expectedDate)}
              maxDate={
                new Date(new Date().setFullYear(new Date().getFullYear() + 1))
              }
              isLg={true}
              name={`${name}.expectedDate`}
              setValue={setValue}
            />
          </label>
          <label
            id="lgExpiryDate"
            className="border p-1 px-2 rounded-md w-[55%] flex items-center justify-between bg-white"
          >
            <p className="w-full text-sm text-lightGray">LG Expiry Date</p>
            <DatePicker
              value={!lgExpiryDate ? undefined : new Date(lgExpiryDate)}
              disabled={!expectedDate}
              maxDate={
                new Date(
                  new Date(expectedDate).setFullYear(
                    new Date(expectedDate).getFullYear() + 1
                  )
                )
              }
              isLg={true}
              name={`${name}.lgExpiryDate`}
              setValue={setValue}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default LgStep6Part2;
