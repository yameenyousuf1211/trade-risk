"use client";
import React, { useEffect, useState } from "react";
import { BgRadioInput } from "./helpers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { getCurrenncy } from "@/services/apis/helpers.api";
import { useQuery } from "@tanstack/react-query";
const numberToText = require("number-to-text");
require("number-to-text/converters/en-us");

export const Step2 = ({
  register,
  setValue,
  getValues,
  valueChanged,
  setValueChanged,
  setStepCompleted,
}: {
  register: any;
  setValue: any;
  getValues: any;
  valueChanged?: any;
  setValueChanged?: any;
  setStepCompleted?: any;
}) => {
  const { data: currency } = useQuery({
    queryKey: ["currency"],
    queryFn: () => getCurrenncy(),
  });

  let amount = getValues("amount");
  let currencyVal = getValues("currency");
  let paymentTerms = getValues("paymentTerms");

  const [currencyValue, setCurrencyValue] = useState<number | null>(null);

  useEffect(() => {
    if (amount) {
      setValue("amount", amount.toString());
      setCurrencyValue(amount);
    }
  }, [valueChanged]);

  const [checkedState, setCheckedState] = useState({
    "payment-sight": false,
    "payment-usance": false,
    "payment-deferred": false,
    "payment-upas": false,
  });

  const handleCheckChange = (id: string) => {
    setCheckedState((prevState) => ({
      ...prevState,
      "payment-sight": id === "payment-sight",
      "payment-usance": id === "payment-usance",
      "payment-deferred": id === "payment-deferred",
      "payment-upas": id === "payment-upas",
    }));
  };

  useEffect(() => {
    if (amount && paymentTerms) {
      setStepCompleted(1, true);
    }
  }, [amount, paymentTerms, valueChanged]);

  const handleAmountValidation = (val: string) => {
    const cleanedValue = val.replace(/\D/g, "");
    const formattedValue = Number(cleanedValue).toLocaleString();
    // setCurrencyValue(formattedValue);
  };

  return (
    <div className="py-3 px-2 border border-borderCol rounded-lg w-full">
      <div className="flex items-center gap-x-2 ml-3 mb-3">
        <p className="size-6 rounded-full bg-primaryCol center text-white font-semibold">
          2
        </p>
        <p className="font-semibold text-lg text-lightGray">Amount</p>
      </div>

      <div className="flex items-center gap-x-2 justify-between w-full mb-3 border border-borderCol py-2 px-3 rounded-md bg-[#F5F7F9]">
        <div className="flex items-center gap-x-2">
          <Select
            onValueChange={(value) => {
              setValue("currency", value);
              setValueChanged((prev: boolean) => !prev);
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

          <Input
            type="number"
            inputMode="numeric"
            name="amount"
            register={register}
            onChange={(e: any) => setCurrencyValue(e.target.value)}
            className="border border-borderCol focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        <p className="font-semibold text-sm">
          {currencyValue &&
            numberToText.convertToText(currencyValue.toString())}
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
        <h5 className="font-semibold ml-3">Payment Terms</h5>
        <div className="flex items-center flex-wrap xl:flex-nowrap  gap-x-3 w-full mt-2">
          <BgRadioInput
            id="payment-sight"
            label="Sight LC"
            name="paymentTerms"
            value="sight-lc"
            register={register}
            checked={checkedState["payment-sight"]}
            handleCheckChange={handleCheckChange}
          />
          <BgRadioInput
            id="payment-usance"
            label="Usance LC"
            name="paymentTerms"
            value="usance-lc"
            register={register}
            checked={checkedState["payment-usance"]}
            handleCheckChange={handleCheckChange}
          />
          <BgRadioInput
            id="payment-deferred"
            label="Deferred LC"
            name="paymentTerms"
            value="deferred-lc"
            register={register}
            checked={checkedState["payment-deferred"]}
            handleCheckChange={handleCheckChange}
          />
          <BgRadioInput
            id="payment-upas"
            label="UPAS LC (Usance payment at sight)"
            name="paymentTerms"
            value="upas-lc"
            register={register}
            checked={checkedState["payment-upas"]}
            handleCheckChange={handleCheckChange}
          />
        </div>
      </div>
    </div>
  );
};
