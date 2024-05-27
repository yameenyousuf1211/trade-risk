import React, { useState } from "react";
import { BgRadioInput } from "../LCSteps/helpers";

export const IssuanceStep9 = () => {
  const [checkedState, setCheckedState] = useState({
    "lowest-price": false,
    "all-prices": false,
  });

  const handleCheckChange = (id: string) => {
    const newCheckedState = {
      "lowest-price": id === "lowest-price",
      "all-prices": id === "all-prices",
    };
    setCheckedState(newCheckedState);

    // const isStepComplete =
    //   newCheckedState["role-exporter"] || newCheckedState["role-importer"];
    // setStepCompleted(0, isStepComplete);
  };
  return (
    <div
      id="step9"
      className="pt-3 pb-1 px-2 border border-borderCol rounded-lg w-full"
    >
      <div className="flex items-center gap-x-2 ml-2 mb-3">
        <p className="text-sm size-6 rounded-full bg-primaryCol center text-white font-semibold">
          9
        </p>
        <p className="font-semibold text-[16px] text-lightGray">
          Would you require to receive the lowest Price or all Price quotes?
        </p>
      </div>
      <div className="flex items-center justify-between gap-x-2">
        <BgRadioInput
          id="lowest-price"
          label="Lowest Price Quoted"
          name="quotes"
          value="lowest-price"
          // register={register}
          register={() => ""}
          checked={checkedState["lowest-price"]}
          handleCheckChange={handleCheckChange}
        />
        <BgRadioInput
          id="all-prices"
          label="All Prices Quoted"
          name="quotes"
          value="all-prices"
          // register={register}
          register={() => ""}
          checked={checkedState["all-prices"]}
          handleCheckChange={handleCheckChange}
        />
      </div>
    </div>
  );
};
