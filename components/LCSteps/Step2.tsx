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
  days,
  setDays,
}: {
  register: any;
  setValue: any;
  getValues: any;
  valueChanged?: any;
  setValueChanged?: any;
  setStepCompleted?: any;
  days: number;
  setDays: any;
}) => {
  const { data: currency } = useQuery({
    queryKey: ["currency"],
    queryFn: () => getCurrenncy(),
  });

  let amount = getValues("amount");
  let currencyVal = getValues("currency");
  let paymentTerms = getValues("paymentTerms");

  const [currencyValue, setCurrencyValue] = useState<string | number | null>(
    null
  );
  const [rawValue, setRawValue] = useState("");
  const [showExtra, setShowExtra] = useState(false);

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

  const handleBlur = () => {
    if (rawValue) {
      const formattedValueWithCents = `${parseInt(
        rawValue
      ).toLocaleString()}.00`;
      setCurrencyValue(formattedValueWithCents);
    }
  };

  useEffect(() => {
    if (amount) {
      setValue("amount", amount.toString());
      setCurrencyValue(amount);
      setRawValue(amount);
    }
  }, [valueChanged]);

  const [checkedState, setCheckedState] = useState({
    "payment-sight": false,
    "payment-usance": false,
    "payment-deferred": false,
    "payment-upas": false,
  });

  const handleCheckChange = (id: string) => {
    if (id === "payment-usance") setShowExtra(true);
    else setShowExtra(false);
    setCheckedState((prevState) => ({
      ...prevState,
      "payment-sight": id === "payment-sight",
      "payment-usance": id === "payment-usance",
      "payment-deferred": id === "payment-deferred",
      "payment-upas": id === "payment-upas",
    }));
  };

  const [extraCheckedState, setExtraCheckedState] = useState({
    "payment-shipment": false,
    "payment-acceptance": false,
    "payment-negotiation": false,
    "payment-invoice": false,
    "payment-extra-sight": false,
    "payment-others": false,
  });

  const handleExtraCheckChange = (id: string) => {
    setExtraCheckedState((prevState) => ({
      ...prevState,
      "payment-shipment": id === "payment-shipment",
      "payment-acceptance": id === "payment-acceptance",
      "payment-negotiation": id === "payment-negotiation",
      "payment-invoice": id === "payment-invoice",
      "payment-extra-sight": id === "payment-extra-sight",
      "payment-others": id === "payment-others",
    }));
  };

  useEffect(() => {
    if (amount && paymentTerms) {
      setStepCompleted(1, true);
    }
  }, [amount, paymentTerms, valueChanged]);

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

          <input
            type="text"
            inputMode="numeric"
            name="amount"
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
        {/* Days input */}
        {showExtra && (
          <>
            <div className="flex items-center gap-x-2 my-3 ml-2">
              <div className="border-b-2 border-black flex items-center">
                <input
                  placeholder="enter days"
                  inputMode="numeric"
                  name="days"
                  type="number"
                  value={days}
                  className="text-sm text-lightGray border-none focus-visible:ring-0 focus-visible:ring-offset-0 max-w-[150px] bg-[#F5F7F9] outline-none"
                  onChange={(e: any) => setDays(e.target.value)}
                />
                <div className="flex items-center gap-x-1">
                  <button
                    type="button"
                    className="rounded-sm border border-para size-6 center mb-2"
                    onClick={() => {
                      setDays((prev: any) => Number(prev) + 1);
                    }}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="rounded-sm border border-para size-6 center mb-2"
                    onClick={() => {
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
                checked={extraCheckedState["payment-shipment"]}
                handleCheckChange={handleExtraCheckChange}
              />
              <BgRadioInput
                id="payment-acceptance"
                label="Acceptance Date"
                name="extraInfo"
                value="acceptance"
                register={register}
                checked={extraCheckedState["payment-acceptance"]}
                handleCheckChange={handleExtraCheckChange}
              />
            </div>
            <div className="flex items-center gap-x-3 justify-between">
              <BgRadioInput
                id="payment-negotiation"
                label="Negotiation Date"
                name="extraInfo"
                value="negotiation"
                register={register}
                checked={extraCheckedState["payment-negotiation"]}
                handleCheckChange={handleExtraCheckChange}
              />
              <BgRadioInput
                id="payment-invoice"
                label="Invoice Date"
                name="extraInfo"
                value="invoice"
                register={register}
                checked={extraCheckedState["payment-invoice"]}
                handleCheckChange={handleExtraCheckChange}
              />
              <BgRadioInput
                id="payment-extra-sight"
                label="Sight"
                name="extraInfo"
                value="sight"
                register={register}
                checked={extraCheckedState["payment-extra-sight"]}
                handleCheckChange={handleExtraCheckChange}
              />
            </div>
            <div
              className={`flex bg-white items-end gap-x-5 px-3 py-4 w-full rounded-md mb-2 border border-borderCol ${
                extraCheckedState["payment-others"] && "bg-[#EEE9FE]"
              }`}
            >
              <label
                htmlFor="payment-others"
                className=" flex items-center gap-x-2 text-sm text-lightGray"
              >
                <input
                  type="radio"
                  name="extraInfo"
                  value="others"
                  id="payment-others"
                  className="accent-primaryCol size-4"
                  onChange={() => handleExtraCheckChange("payment-others")}
                />
                Others
              </label>
              <input
                type="text"
                name="ds"
                className="text-sm bg-transparent !border-b-2 !border-b-neutral-300 rounded-none border-transparent focus-visible:ring-0 focus-visible:ring-offset-0 outline-none w-[80%]"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
