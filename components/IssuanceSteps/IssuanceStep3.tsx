"use client";
import { getCurrenncy } from "@/services/apis/helpers.api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";

const NumberInput = () => {
  const [currencyValue, setCurrencyValue] = useState<string | number>();
  const [rawValue, setRawValue] = useState("");

  const handleChange = (e: any) => {
    const { value } = e.target;

    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly) {
      const formattedValue = parseInt(digitsOnly).toLocaleString();
      setCurrencyValue(formattedValue);
      setRawValue(digitsOnly);
    } else {
      setCurrencyValue("");
      setRawValue("");
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
  return (
    <div className="w-full">
      <input
        type="text"
        inputMode="numeric"
        name="amount"
        value={currencyValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className="border border-borderCol focus-visible:ring-0 focus-visible:ring-offset-0 flex h-10 w-full rounded-md  bg-background px-3 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
};

export const IssuanceStep3 = () => {
  const { data: currency } = useQuery({
    queryKey: ["currency"],
    queryFn: () => getCurrenncy(),
  });

  const [pricePerAnnum, setPricePerAnnum] = useState("0");

  const handleIncrement = () => {
    const currentValue = pricePerAnnum || "0";
    const newValue = (parseFloat(currentValue) + 0.5).toFixed(1);
    if (Number(newValue) > 100) {
      return;
    }
    setPricePerAnnum(newValue);
  };

  const handleDecrement = () => {
    const currentValue = pricePerAnnum || "0";
    let newValue: any = parseFloat(currentValue) - 0.5;

    if (newValue < 0) newValue = 0;
    // @ts-ignore
    newValue = newValue.toFixed(1);
    setPricePerAnnum(newValue);
  };

  return (
    <div
      id="step3"
      className="pt-3 pb-3 px-2 border border-borderCol rounded-lg w-full"
    >
      <div className="flex items-center gap-x-2 ml-2 mb-3">
        <p className="text-sm size-6 rounded-full bg-primaryCol center text-white font-semibold">
          3
        </p>
        <p className="font-semibold text-[16px] text-lightGray">Amount</p>
      </div>

      <div className="flex items-center justify-between gap-x-3 w-full">
        <div className="w-full">
          <p className="font-semibold text-sm mb-2 ml-2">LG Amount</p>
          <div className="flex items-center justify-between gap-x-2">
            <Select>
              <SelectTrigger className="w-[80px] bg-[#F1F1F5]">
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
            <NumberInput />
          </div>
        </div>
        <div className="w-full">
          <p className="font-semibold text-sm mb-2 ml-2">LG Margin Amount</p>
          <div className="flex items-center justify-between gap-x-2">
            <Select>
              <SelectTrigger className="w-[80px] bg-[#F1F1F5]">
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
            <NumberInput />
          </div>
        </div>
        <div className="w-full">
          <p className="font-semibold text-sm mb-2 ml-2">
            Being % value of the contract
          </p>
          <label
            id="expected-pricing"
            className="border bg-white border-borderCol  px-3 rounded-md w-full flex items-center justify-between"
          >
            <p className="text-lightGray text-sm w-full">%</p>
            <div className="flex items-center gap-x-2">
              <Button
                type="button"
                variant="ghost"
                className="w-fit bg-none border-none text-lg text-lightGray"
                onClick={handleDecrement}
              >
                -
              </Button>
              <input
                placeholder="Value"
                type="number"
                inputMode="numeric"
                value={pricePerAnnum}
                required
                max={100}
                className="border-none outline-none text-sm max-w-[70px] w-fit"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPricePerAnnum(e.target.value)
                }
                onKeyUp={(event: any) => {
                  if (event.target?.value > 100) {
                    event.target.value = "100.0";
                  }
                }}
              />

              <Button
                type="button"
                variant="ghost"
                className="bg-none border-none text-lg text-lightGray"
                onClick={handleIncrement}
              >
                +
              </Button>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
