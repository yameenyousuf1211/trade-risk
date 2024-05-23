"use client";
import React, { useState } from "react";

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
      <div className="flex items-center gap-x-2 ml-3 mb-3">
        <p className="size-6 rounded-full bg-[#255EF2] center text-white font-semibold">
          6
        </p>
        <p className="font-semibold text-lg text-lightGray">
          Would you require to recieve
        </p>
      </div>
      <div className="flex items-center justify-between gap-x-2 w-full">
        <div className="w-full">
          <label
            htmlFor="highest-price-quoted"
            className={`px-3 py-4 w-full transition-colors duration-100 ${
              checkedState["highest-price-quoted"]
                ? "bg-[#DCE5FD]"
                : "border border-borderCol bg-white"
            } rounded-md flex items-center gap-x-3 mb-2 text-lightGray `}
          >
            <input
              type="radio"
              id="highest-price-quoted"
              value="highest-price"
              name="require"
              {...register("require")}
              className="accent-[#255EF2] size-4"
              onChange={() => handleCheckChange("highest-price-quoted")}
            />
            Highest Price Quoted
          </label>
        </div>
        <div className="w-full">
          <label
            htmlFor="all-prices-quoted"
            className={`px-3 py-4 w-full transition-colors duration-100 ${
              checkedState["all-prices-quoted"]
                ? "bg-[#DCE5FD]"
                : "border border-borderCol bg-white"
            } rounded-md flex items-center gap-x-3 mb-2 text-lightGray `}
          >
            <input
              type="radio"
              id="all-prices-quoted"
              value="all-prices"
              name="require"
              {...register("require")}
              className="accent-[#255EF2] size-4"
              onChange={() => handleCheckChange("all-prices-quoted")}
            />
            All Prices Quoted
          </label>
        </div>
      </div>
    </div>
  );
};
