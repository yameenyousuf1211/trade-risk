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
  let extraInfo = watch("extraInfo") || { days: 0, other: "" };

  const [currencyValue, setCurrencyValue] = useState<string | number>(
    amount || "",
  );
  const [rawValue, setRawValue] = useState("");
  const [otherValue, setOtherValue] = useState("");
  const { addStep, removeStep } = useStepStore();

  useEffect(() => {
    if (paymentTerms === "Usance LC") {
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

  // useEffect(() => {
  //   // Update extraInfo in the form state when `days` or `otherValue` changes
  //   setValue("extraInfo", { days, other: otherValue });
  // }, [days, otherValue]);

  console.log("extraInfo", extraInfo);

  console.log("extraInfo", extraInfo);
  
  return (
    <div
      id="step2"
      className="scroll-target w-full rounded-lg border border-borderCol px-2 py-3"
    >
      <div className="mb-3 ml-3 flex items-center gap-x-2">
        <p className="center size-6 rounded-full bg-primaryCol text-sm font-semibold text-white">
          2
        </p>
        <p className="text-[16px] font-semibold text-lightGray">Amount</p>
      </div>

      <div className="mb-3 flex w-full items-center justify-between gap-x-2 rounded-md border border-borderCol bg-[#F5F7F9] px-3 py-2">
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
            className="flex h-10 w-full rounded-md border border-borderCol bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <p className="text-sm font-semibold">
          {rawValue && numberToText.convertToText(rawValue.toString())}{" "}
          <span className="uppercase text-primaryCol">
            {currencyVal
              ? currencyVal === "USD"
                ? "US Dollars"
                : currencyVal
              : "US Dollars"}
          </span>
        </p>
      </div>

      <div className="rounded-md border border-borderCol bg-[#F5F7F9] px-2 py-3">
        <h5 className="ml-3 text-sm font-semibold">Payment Terms</h5>
        <div className="mt-2 flex w-full flex-wrap items-center gap-x-3 xl:flex-nowrap">
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
            <div className="my-3 ml-2 flex items-center gap-x-2">
              <div className="flex items-center border-b-2 border-black">
                <input
                  placeholder="enter days"
                  inputMode="numeric"
                  name="days"
                  type="number"
                  max={3}
                  value={days}
                  className="max-w-[150px] border-none bg-[#F5F7F9] text-sm text-lightGray outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  onChange={(e: any) => {
                    if (e.target.value > 999) return;
                    else setDays(Number(e.target.value));
                  }}
                />
                <div className="flex items-center gap-x-1">
                  <button
                    type="button"
                    className="center mb-2 size-6 rounded-sm border border-para"
                    onClick={() => {
                      if (days >= 999) return;
                      else setDays((prev: any) => Number(prev) + 1);
                    }}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="center mb-2 size-6 rounded-sm border border-para"
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
            <div className="flex items-center justify-between gap-x-3">
              <BgRadioInput
                id="payment-shipment"
                label="BL Date/Shipment Date"
                name="extraInfo.other"
                value="shipment"
                register={register}
                checked={extraInfo.other === "shipment"}
              />
              <BgRadioInput
                id="payment-acceptance"
                label="Acceptance Date"
                name="extraInfo.other"
                value="acceptance"
                register={register}
                checked={extraInfo.other === "acceptance"}
              />
            </div>
            <div className="flex items-center justify-between gap-x-3">
              <BgRadioInput
                id="payment-negotiation"
                label="Negotiation Date"
                name="extraInfo.other"
                value="negotiation"
                register={register}
                checked={extraInfo.other === "negotiation"}
              />
              <BgRadioInput
                id="payment-invoice"
                label="Invoice Date"
                name="extraInfo.other"
                value="invoice"
                register={register}
                checked={extraInfo.other === "invoice"}
              />
              <BgRadioInput
                id="payment-extra-sight"
                label="Sight"
                name="extraInfo.other"
                value="sight"
                register={register}
                checked={extraInfo.other === "sight"}
              />
            </div>
            <div
              className={`mb-2 flex w-full items-end gap-x-5 rounded-md border border-borderCol bg-white px-3 py-4 ${
                extraInfo.other === "others" && "!bg-[#EEE9FE]"
              }`}
            >
              <label
                htmlFor="payment-others"
                className="flex items-center gap-x-2 text-sm text-lightGray"
              >
                <input
                  type="radio"
                  value="others"
                  {...register("extraInfo.other")}
                  id="payment-others"
                  checked={extraInfo.other === "others"}
                  className="size-4 accent-primaryCol"
                  // onChange={() => setOtherValue("others")}
                />
                Others
              </label>
              <input
                type="text"
                name="ds"
                value={otherValue}
                disabled={extraInfo.other !== "others"}
                onChange={(e: any) => setOtherValue(e.target.value)}
                className="w-[80%] rounded-none !border-b-2 border-transparent !border-b-neutral-300 bg-transparent text-sm outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                // checked={extraInfo.other !== "others"}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
