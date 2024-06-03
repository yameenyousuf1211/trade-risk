"use client";
import { BgRadioInput, DDInput } from "../LCSteps/helpers";

export const IssuanceStep7 = () => {
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
            register={() => ""}
            checked={false}
          />
          <BgRadioInput
            id="instrument-no"
            label="No"
            name="instrument"
            value="no"
            register={() => ""}
            checked={false}
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
            // value={importerCountry}
            setValue={() => ""}
          />

          <p className="text-sm font-semibold my-2 ml-2">
            LG Charges on account of
          </p>
          <BgRadioInput
            id="lg-applicant"
            label="Applicant"
            name="accountOf"
            value="applicant"
            register={() => ""}
            checked={false}
          />
          <BgRadioInput
            id="lg-beneficiary"
            label="Beneficiary"
            name="accountOf"
            value="beneficiary"
            register={() => ""}
            checked={false}
          />
        </div>
      </div>
    </div>
  );
};
