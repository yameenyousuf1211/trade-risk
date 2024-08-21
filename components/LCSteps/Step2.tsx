"use client";
import { useEffect, useState } from "react";
import { BgRadioInput } from "./helpers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCurrency } from "@/services/apis/helpers.api";
import { useQuery } from "@tanstack/react-query";
const numberToText = require("number-to-text");
require("number-to-text/converters/en-us");
import {
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";
import useStepStore from "@/store/lcsteps.store";
import { AMOUNT } from "@/utils/constant/lg";

export const Step2 = ({
  register,
  setValue,
  setStepCompleted,
  days,
  setDays,
  watch,
}: {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  setStepCompleted: (index: number, status: boolean) => void;
  days: number;
  setDays: React.Dispatch<React.SetStateAction<number>>;
  watch: UseFormWatch<any>;
}) => {
  const { data: currency } = useQuery({
    queryKey: ["currency"],
    queryFn: () => getCurrency(),
  });

  let amount = watch("amount");
  let currencyVal = watch("currency");
  let paymentTerms = watch("paymentTerms");
  let extraInfo = watch("extraInfo");

  const [currencyValue, setCurrencyValue] = useState<string | number>(
    amount || ""
  );
  const [rawValue, setRawValue] = useState("");
  const [otherValue, setOtherValue] = useState(extraInfo?.other || "shipment");
  const { addStep, removeStep } = useStepStore();

  useEffect(() => {
    if (paymentTerms === "Sight LC") {
      setValue("extraInfo", undefined);
    }
  }, [paymentTerms]);

  const handleChange = (e: any) => {
    const { value } = e.target;

    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly) {
      const formattedValue = parseInt(digitsOnly).toLocaleString();
      setCurrencyValue(formattedValue);
      setRawValue(digitsOnly);
      setValue("amount", digitsOnly);
    } else {
      setCurrencyValue("");
      setRawValue("");
      setValue("amount", "");
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
    if (amount) {
      const digitsOnly = amount?.toString().replace(/\D/g, "");
      if (digitsOnly) {
        const formattedValue = parseInt(digitsOnly).toLocaleString();
        setCurrencyValue(formattedValue);
        setRawValue(amount);
        setValue("amount", amount.toString());
      }
    }
  }, [amount]);

  useEffect(() => {
    if (amount && paymentTerms) {
      addStep(AMOUNT);
    } else removeStep(AMOUNT);
  }, [amount, paymentTerms]);

  useEffect(() => {
    // Update extraInfo in the form state when `days` or `otherValue` changes
    console.log("days", days, "otherValue", otherValue);
    
    setValue("extraInfo", { days, other: otherValue });
  }, [days, otherValue]);

  return (
    <div
      id="step2"
      className="py-3 px-2 border border-borderCol rounded-lg w-full scroll-target"
    >
      <div className="flex items-center gap-x-2 ml-3 mb-3">
        <p className="text-sm size-6 rounded-full bg-primaryCol center text-white font-semibold">
          2
        </p>
        <p className="font-semibold text-[16px] text-lightGray">Amount</p>
      </div>

      <div className="flex items-center gap-x-2 justify-between w-full mb-3 border border-borderCol py-2 px-3 rounded-md bg-[#F5F7F9]">
        <div className="flex items-center gap-x-2">
          <Select
            onValueChange={(value) => {
              setValue("currency", value);
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
            className="border border-borderCol focus-visible:ring-0 focus-visible:ring-offset-0  flex h-10 w-full rounded-md  bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <p className="font-semibold text-sm">
          {rawValue && numberToText.convertToText(rawValue.toString())}{" "}
          <span className="text-primaryCol uppercase">
            {currencyVal
              ? currencyVal === "USD"
                ? "US Dollars"
                : currencyVal
              : "US Dollars"}
          </span>
        </p>
      </div>

      <div className="border border-borderCol px-2 py-3 rounded-md bg-[#F5F7F9]">
        <h5 className="font-semibold text-sm ml-3">Payment Terms</h5>
        <div className="flex items-center flex-wrap xl:flex-nowrap  gap-x-3 w-full mt-2">
          <BgRadioInput
            id="payment-sight"
            label="Sight LC"
            name="paymentTerms"
            value="Sight LC"
            register={register}
            checked={paymentTerms === "Sight LC"}
          />
          <BgRadioInput
            id="payment-usance"
            label="Usance LC"
            name="paymentTerms"
            value="Usance LC"
            register={register}
            checked={paymentTerms === "Usance LC"}
          />
          <BgRadioInput
            id="payment-deferred"
            label="Deferred LC"
            name="paymentTerms"
            value="Deferred LC"
            register={register}
            checked={paymentTerms === "Deferred LC"}
          />
          <BgRadioInput
            id="payment-upas"
            label="UPAS LC (Usance payment at sight)"
            name="paymentTerms"
            value="UPAS LC"
            register={register}
            checked={paymentTerms === "UPAS LC"}
          />
        </div>
        {/* Days input */}
        {paymentTerms && paymentTerms !== "Sight LC" && (
          <>
            <div className="flex items-center gap-x-2 my-3 ml-2">
              <div className="border-b-2 border-black flex items-center">
                <input
                  placeholder="enter days"
                  inputMode="numeric"
                  name="days"
                  type="number"
                  max={3}
                  value={days}
                  className="text-sm text-lightGray border-none focus-visible:ring-0 focus-visible:ring-offset-0 max-w-[150px] bg-[#F5F7F9] outline-none"
                  onChange={(e: any) => {
                    if (e.target.value > 999) return;
                    else setDays(Number(e.target.value));
                  }}
                />
                <div className="flex items-center gap-x-1">
                  <button
                    type="button"
                    className="rounded-sm border border-para size-6 center mb-2"
                    onClick={() => {
                      if (days >= 999) return;
                      else setDays((prev: any) => Number(prev) + 1);
                    }}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="rounded-sm border border-para size-6 center mb-2"
                    onClick={() => {
                      if (days >= 999) return;
                      else
                        setDays((prev: any) =>
                          Number(prev) > 1 ? Number(prev) - 1 : 1
                        );
                    }}
                  >
                    -
                  </button>
                </div>
              </div>
              <p className="font-semibold">days from</p>
            </div>
            <div className="flex items-center gap-x-3 justify-between">
              <BgRadioInput
                id="payment-shipment"
                label="BL Date/Shipment Date"
                name="extraInfo.other"
                value="shipment"
                register={register}
                checked={otherValue === "shipment"}
                onChange={() => setOtherValue("shipment")}
              />
              <BgRadioInput
                id="payment-acceptance"
                label="Acceptance Date"
                name="extraInfo.other"
                value="acceptance"
                register={register}
                checked={otherValue === "acceptance"}
                onChange={() => setOtherValue("acceptance")}
              />
            </div>
            <div className="flex items-center gap-x-3 justify-between">
              <BgRadioInput
                id="payment-negotiation"
                label="Negotiation Date"
                name="extraInfo.other"
                value="negotiation"
                register={register}
                checked={otherValue === "negotiation"}
                onChange={() => setOtherValue("negotiation")}
              />
              <BgRadioInput
                id="payment-invoice"
                label="Invoice Date"
                name="extraInfo.other"
                value="invoice"
                register={register}
                checked={otherValue === "invoice"}
                onChange={() => setOtherValue("invoice")}
              />
              <BgRadioInput
                id="payment-extra-sight"
                label="Sight"
                name="extraInfo.other"
                value="sight"
                register={register}
                checked={otherValue === "sight"}
                onChange={() => setOtherValue("sight")}
              />
            </div>
            <div
              className={`flex bg-white items-end gap-x-5 px-3 py-4 w-full rounded-md mb-2 border border-borderCol ${
                otherValue === "others" && "!bg-[#EEE9FE]"
              }`}
            >
              <label
                htmlFor="payment-others"
                className=" flex items-center gap-x-2 text-sm text-lightGray"
              >
                <input
                  type="radio"
                  value="others"
                  {...register("extraInfo.other")}
                  id="payment-others"
                  checked={otherValue === "others"}
                  className="accent-primaryCol size-4"
                  onChange={() => setOtherValue("others")}
                />
                Others
              </label>
              <input
                type="text"
                name="ds"
                value={otherValue}
                onChange={(e: any) => setOtherValue(e.target.value)}
                className="text-sm bg-transparent !border-b-2 !border-b-neutral-300 rounded-none border-transparent focus-visible:ring-0 focus-visible:ring-offset-0 outline-none w-[80%]"
                disabled={otherValue !== "others"}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
