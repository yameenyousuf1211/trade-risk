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
import { getCurrenncy } from "@/services/apis/helpers.api";
import { useQuery } from "@tanstack/react-query";
const numberToText = require("number-to-text");
require("number-to-text/converters/en-us");
import {
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";

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
    queryFn: () => getCurrenncy(),
  });

  let amount = watch("amount");
  let currencyVal = watch("currency");
  let paymentTerms = watch("paymentTerms");
  let extraInfo = watch("extraInfo");
  console.log(extraInfo, "EXTRAINFO");

  const [currencyValue, setCurrencyValue] = useState<string | number>(
    amount || ""
  );
  const [rawValue, setRawValue] = useState("");
  const [otherValue, setOtherValue] = useState("");

  const handleChange = (e: any) => {
    const { value } = e.target;

    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly) {
      const formattedValue = parseInt(digitsOnly).toLocaleString();
      console.log(formattedValue, "FORMATTED");
      setCurrencyValue(formattedValue);
      console.log(currencyValue);
      setRawValue(digitsOnly);
      setValue("amount", digitsOnly);
    } else {
      setCurrencyValue("");
      setRawValue("");
      setValue("amount", "");
    }
  };

  const handleBlur = () => {
    if (rawValue) {
      const formattedValueWithCents = `${parseInt(
        rawValue
      ).toLocaleString()}.00`;
      setCurrencyValue(formattedValueWithCents);
    }
  };

  // useEffect(() => {
  //   if (amount) {
  //     setValue("amount", amount.toString());
  //     setCurrencyValue(amount);
  //     setRawValue(amount);
  //   }
  // }, [amount]);
  useEffect(() => {
    if (amount) {
      const digitsOnly = amount?.toString().replace(/\D/g, "");
      if (digitsOnly) {
        const formattedValue = parseInt(digitsOnly).toLocaleString();
        setCurrencyValue(formattedValue);
        setRawValue(amount);
      }
    }
  }, [amount]);

  useEffect(() => {
    if (amount && paymentTerms) {
      setStepCompleted(1, true);
    }
    // if (paymentTerms !== "Sight LC") setValue("extraInfo", undefined);
  }, [amount, paymentTerms]);

  return (
    <div
      id="step2"
      className="py-3 px-2 border border-borderCol rounded-lg w-full"
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
            onBlur={handleBlur}
            className="border border-borderCol focus-visible:ring-0 focus-visible:ring-offset-0  flex h-10 w-full rounded-md  bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <p className="font-semibold text-sm">
          {rawValue && numberToText.convertToText(rawValue.toString())}
          {/* {amount} */}{" "}
          <span className="text-primaryCol uppe rcase">
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
                    else setDays(e.target.value);
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
                name="extraInfo"
                value="shipment"
                register={register}
                checked={extraInfo === "shipment"}
              />
              <BgRadioInput
                id="payment-acceptance"
                label="Acceptance Date"
                name="extraInfo"
                value="acceptance"
                register={register}
                checked={extraInfo === "acceptance"}
              />
            </div>
            <div className="flex items-center gap-x-3 justify-between">
              <BgRadioInput
                id="payment-negotiation"
                label="Negotiation Date"
                name="extraInfo"
                value="negotiation"
                register={register}
                checked={extraInfo === "negotiation"}
              />
              <BgRadioInput
                id="payment-invoice"
                label="Invoice Date"
                name="extraInfo"
                value="invoice"
                register={register}
                checked={extraInfo === "invoice"}
              />
              <BgRadioInput
                id="payment-extra-sight"
                label="Sight"
                name="extraInfo"
                value="sight"
                register={register}
                checked={extraInfo === "sight"}
              />
            </div>
            <div
              className={`flex bg-white items-end gap-x-5 px-3 py-4 w-full rounded-md mb-2 border border-borderCol ${
                extraInfo === "others" && "!bg-[#EEE9FE]"
              }`}
            >
              <label
                htmlFor="payment-others"
                className=" flex items-center gap-x-2 text-sm text-lightGray"
              >
                <input
                  type="radio"
                  value="others"
                  {...register("extraInfo")}
                  id="payment-others"
                  checked={extraInfo === "others"}
                  className="accent-primaryCol size-4"
                />
                Others
              </label>
              <input
                type="text"
                name="ds"
                value={otherValue}
                onChange={(e: any) => setOtherValue(e.target.value)}
                className="text-sm bg-transparent !border-b-2 !border-b-neutral-300 rounded-none border-transparent focus-visible:ring-0 focus-visible:ring-offset-0 outline-none w-[80%]"
                disabled={extraInfo !== "others"}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
