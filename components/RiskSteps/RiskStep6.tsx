"use client";
import React, { useState } from "react";
import { BankRadioInput } from "./RiskHelpers";

export const RiskStep6 = ({ register }: { register: any }) => {
  const [checkedState, setCheckedState] = useState({
    "highest-price-quoted": false,
    "all-prices-quoted": false,
  });

  const handleCheckChange = (id: string) => {
    const newCheckedState = {
      "highest-price-quoted": id === "highest-price-quoted",
      "all-prices-quoted": id === "all-prices-quoted",
    };
    setCheckedState(newCheckedState);
  };
  return (
    <div className="py-4 pt-6 px-4 border border-borderCol rounded-lg w-full bg-white">
      <div className="flex items-center gap-x-2 ml-2 mb-3">
        <p className="size-6 text-sm rounded-full bg-[#255EF2] center text-white font-semibold">
          6
        </p>
        <p className="font-semibold text-[16px] text-lightGray">
          Would you require to recieve
        </p>
      </div>
      <div className="flex items-center justify-between gap-x-2 w-full">
        <BankRadioInput
          id="highest-price-quoted"
          label="Highest Price Quoted"
          name="require"
          value="highest-price"
          checked={checkedState["highest-price-quoted"]}
          handleCheckChange={handleCheckChange}
        />
        <BankRadioInput
          id="all-prices-quoted"
          label="All Prices Quoted"
          name="require"
          value="all-prices"
          checked={checkedState["all-prices-quoted"]}
          handleCheckChange={handleCheckChange}
        />
      </div>
    </div>
  );
};
