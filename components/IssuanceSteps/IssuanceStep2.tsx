"use client";
import React, { useState } from "react";
import { BgRadioInput, DDInput } from "../LCSteps/helpers";
import Image from "next/image";

export const IssuanceStep2 = ({
  countries,
  flags,
}: {
  countries: string[];
  flags: string[];
}) => {
  const [checkedState, setCheckedState] = useState({
    "issue-lg-yes": false,
    "issue-lg-no": false,
  });

  const handleCheckChange = (id: string) => {
    const newCheckedState = {
      "issue-lg-yes": id === "issue-lg-yes",
      "issue-lg-no": id === "issue-lg-no",
    };
    setCheckedState(newCheckedState);
  };
  return (
    <div
      id="step2"
      className="py-3 px-3 border border-borderCol rounded-lg w-full"
    >
      <div className="flex items-center gap-x-2 ml-2 mb-3">
        <p className="text-sm size-6 rounded-full bg-primaryCol center text-white font-semibold">
          2
        </p>
        <p className="font-semibold text-[16px] text-lightGray">
          LG Issuing Bank
        </p>
      </div>
      <div className="flex items-center justify-between gap-x-2">
        <div className="border border-borderCol py-3 px-2 rounded-md w-full bg-[#F5F7F9] h-44">
          <p className="text-sm font-semibold mb-2 ml-2">Issuing Bank</p>
          <div className="flex flex-col gap-y-2">
            <DDInput
              placeholder="Select a country"
              label="Country"
              id="issuingBank.country"
              data={countries}
              flags={flags}
              //   value={importerCountry}
              setValue={() => ""}
              //   setValueChanged={setValueChanged}
            />

            <DDInput
              placeholder="Select bank"
              label="Bank"
              id="issuingBank.bank"
              // data={countries}
              disabled={true}
              //   value={importerCountry}
              setValue={() => ""}
              //   setValueChanged={setValueChanged}
            />
          </div>
        </div>

        <div className="border border-borderCol py-3 px-2 rounded-md w-full bg-[#F5F7F9]">
          <p className="text-sm font-semibold mb-2 ml-2">
            Would you want to issue LG with standard SAMA Text ?
          </p>
          <div className="flex items-center gap-x-2 justify-between w-full">
            <BgRadioInput
              id="issue-lg-yes"
              label="Yes"
              name="issueLg"
              value="yes"
              // register={register}
              register={() => ""}
              checked={checkedState["issue-lg-yes"]}
              handleCheckChange={handleCheckChange}
            />
            <BgRadioInput
              id="issue-lg-no"
              label="No"
              name="issueLg"
              value="no"
              // register={register}
              register={() => ""}
              checked={checkedState["issue-lg-no"]}
              handleCheckChange={handleCheckChange}
            />
          </div>
          <label
            htmlFor="lgDraft"
            className="border border-borderCol p-1 px-3 rounded-md w-full flex items-center justify-between bg-white"
          >
            <p className="w-full text-sm text-lightGray">Add LG text draft</p>
            <div className="flex items-center gap-x-2 w-full max-w-[210px]">
              <p className="text-sm text-lightGray">Upload document</p>
              <div className="size-12 bg-white center rounded-full shadow-sm">
                <Image
                  src="/images/attachment.svg"
                  alt="att"
                  width={27}
                  height={27}
                />
              </div>
              <input type="file" className="hidden" id="lgDraft" />
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
