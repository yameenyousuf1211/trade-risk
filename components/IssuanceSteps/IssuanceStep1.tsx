"use client";
import { useState } from "react";
import { BgRadioInput } from "../LCSteps/helpers";

export const IssuanceStep1 = () => {
  const [checkedState, setCheckedState] = useState({
    "cash-margin": false,
    "credit-facility": false,
  });

  const handleCheckChange = (id: string) => {
    const newCheckedState = {
      "cash-margin": id === "cash-margin",
      "credit-facility": id === "credit-facility",
    };
    setCheckedState(newCheckedState);

    // const isStepComplete =
    //   newCheckedState["role-exporter"] || newCheckedState["role-importer"];
    // setStepCompleted(0, isStepComplete);
  };
  return (
    <div
      id="step1"
      className="pt-3 pb-1 px-2 border border-borderCol rounded-lg w-full"
    >
      <div className="flex items-center gap-x-2 ml-2 mb-3">
        <p className="text-sm size-6 rounded-full bg-primaryCol center text-white font-semibold">
          1
        </p>
        <p className="font-semibold text-[16px] text-lightGray">
          LG to be issued against
        </p>
      </div>
      <BgRadioInput
        id="cash-margin"
        label="Cash Margin"
        name="issuedAgainst"
        value="cash-margin"
        // register={register}
        register={() => ""}
        checked={checkedState["cash-margin"]}
        handleCheckChange={handleCheckChange}
      />
      <BgRadioInput
        id="credit-facility"
        label="Credit Facility"
        name="issuedAgainst"
        value="credit-facility"
        // register={register}
        register={() => ""}
        checked={checkedState["credit-facility"]}
        handleCheckChange={handleCheckChange}
      />
    </div>
  );
};
