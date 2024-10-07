"use client";
import { formatAmount } from "@/utils";
import { useState } from "react";

export const NumberInput = ({
  register,
  setValue,
  name,
  value,
}: {
  register: any;
  setValue: any;
  name: string;
  value: string;
}) => {
  const [currencyValue, setCurrencyValue] = useState(value || "");
  const [rawValue, setRawValue] = useState(value || "");

  const handleChange = (e: any) => {
    const { value } = e.target;

    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly) {
      const formattedValue = parseInt(digitsOnly).toLocaleString();
      setCurrencyValue(formattedValue);
      setRawValue(digitsOnly);
      setValue(name, digitsOnly);
    } else {
      setCurrencyValue("");
      setRawValue("");
      setValue(name, "");
    }
  };

  const handleBlur = () => {
    if (rawValue) {
      const formattedValueWithCents = `${formatAmount(parseInt(rawValue))}`;
      setCurrencyValue(formattedValueWithCents);
    }
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      name={name}
      {...register(name)}
      value={currencyValue}
      onChange={handleChange}
      onBlur={handleBlur}
      className="border border-borderCol focus-visible:ring-offset-0 flex h-10 w-full rounded-md  bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
    />
  );
};
