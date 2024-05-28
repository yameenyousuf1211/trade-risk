"use client";
import React, { useState } from "react";
import { BgRadioInput, DDInput } from "../LCSteps/helpers";

export const IssuanceStep7 = () => {
  const [checkedState, setCheckedState] = useState({
    "instrument-yes": false,
    "instrument-no": false,
  });

  const handleCheckChange = (id: string) => {
    const newCheckedState = {
      "instrument-yes": id === "instrument-yes",
      "instrument-no": id === "instrument-no",
    };
    setCheckedState(newCheckedState);
  };

  const [lgCheckedState, setLgCheckedState] = useState({
    "lg-applicant": false,
    "lg-beneficiary": false,
  });

  const handleLGCheckChange = (id: string) => {
    const newCheckedState = {
      "lg-applicant": id === "lg-applicant",
      "lg-beneficiary": id === "lg-beneficiary",
    };
    setLgCheckedState(newCheckedState);
  };

  return (
    <div
      id="step7"
      className="py-3 px-3 border border-borderCol rounded-lg w-full"
    >
      <div className="flex items-center gap-x-2 ml-2 mb-3">
        <p className="text-sm size-6 rounded-full bg-primaryCol center text-white font-semibold">
          7
        </p>
        <p className="font-semibold text-[16px] text-lightGray">Instrument</p>
      </div>
      <div className="flex items-center justify-between gap-x-2">
        <div className="border border-borderCol py-3 px-2 rounded-md w-full bg-[#F5F7F9] h-[260px]">
          <p className="text-sm font-semibold mb-2 ml-2">
            Would you want to issue physical LG Instrument?
          </p>
          <BgRadioInput
            id="instrument-yes"
            label="Yes"
            name="instrument"
            value="yes"
            // register={register}
            register={() => ""}
            checked={checkedState["instrument-yes"]}
            handleCheckChange={handleCheckChange}
          />
          <BgRadioInput
            id="instrument-no"
            label="No"
            name="instrument"
            value="no"
            // register={register}
            register={() => ""}
            checked={checkedState["instrument-no"]}
            handleCheckChange={handleCheckChange}
          />
        </div>

        <div className="border border-borderCol py-3 px-2 rounded-md w-full bg-[#F5F7F9]">
          <p className="text-sm font-semibold mb-2 ml-2">
            Benificiary Bank Name (SWIFT Advising)
          </p>

          <DDInput
            placeholder="Select bank"
            label="Select Bank"
            id="beneficiary.bank"
            // data={countries}
            //   value={importerCountry}
            setValue={() => ""}
            //   setValueChanged={setValueChanged}
          />

          <p className="text-sm font-semibold my-2 ml-2">
            LG Charges on account of
          </p>
          <BgRadioInput
            id="lg-applicant"
            label="Applicant"
            name="accountOf"
            value="applicant"
            // register={register}
            register={() => ""}
            checked={lgCheckedState["lg-applicant"]}
            handleCheckChange={handleLGCheckChange}
          />
          <BgRadioInput
            id="lg-beneficiary"
            label="Beneficiary"
            name="accountOf"
            value="beneficiary"
            // register={register}
            register={() => ""}
            checked={lgCheckedState["lg-beneficiary"]}
            handleCheckChange={handleLGCheckChange}
          />
        </div>
      </div>
    </div>
  );
};
