import React, { useState, useEffect } from "react";
import { BankData } from "../../../types/LGBankTypes";

interface PricingInputProps {
  pricingValue: string;
  setPricingValue: (value: string) => void;
  updateBondPrices: (value: string) => void;
  selectedBank?: string | undefined;
  bankData?: BankData;
  selectedBondPrice?: number | string;
}

export const PricingInput: React.FC<PricingInputProps> = ({
  pricingValue,
  setPricingValue,
  updateBondPrices,
  selectedBank,
  selectedBondPrice,
  bankData,
}) => {
  console.log(selectedBondPrice, "selectedBondPrice");
  const [internalValue, setInternalValue] = useState<string>(pricingValue);

  useEffect(() => {
    setInternalValue(pricingValue);
  }, [pricingValue]);

  const getClientExpectedPrice = () => {
    if (selectedBondPrice) {
      return "Client's Expected Price: " + selectedBondPrice + "% Per Annum";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value.replace(/[^0-9.]/g, "");
    const decimalMatch = newValue.match(/^\d*(\.\d{0,2})?$/);

    if (decimalMatch) {
      if (parseFloat(newValue) > 100) {
        newValue = "100";
      }
      setInternalValue(newValue);
      setPricingValue(newValue);
      updateBondPrices(newValue);
    }
  };

  const handleBlur = () => {
    let newValue = internalValue;

    if (newValue === "" || isNaN(parseFloat(newValue))) {
      return;
    }

    if (parseFloat(newValue) > 100) {
      newValue = "100";
    }

    if (!newValue.includes("%")) {
      newValue = `${newValue}%`;
    }

    setInternalValue(newValue);
    setPricingValue(newValue);
    updateBondPrices(newValue);
  };

  const handleFocus = () => {
    if (internalValue.endsWith("%")) {
      const newValue = internalValue.slice(0, -1);
      setInternalValue(newValue);
    }
  };

  return (
    <div className="mt-2 flex flex-col">
      <div className="flex justify-between">
        <h6 className="mb-1 text-sm font-bold">Enter your Pricing Below</h6>
        <h6 className="text-xs text-[#29C084]">{getClientExpectedPrice()}</h6>
      </div>
      <div className="mt-2 flex items-center rounded-md border border-[#E2E2EA] p-2">
        <input
          type="text"
          className="w-full p-1 pr-2 outline-none"
          placeholder="Enter your pricing (%)"
          value={internalValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
        />
        <h6 className="w-4/12 text-end text-sm text-gray-600">Per Annum</h6>
      </div>
    </div>
  );
};
