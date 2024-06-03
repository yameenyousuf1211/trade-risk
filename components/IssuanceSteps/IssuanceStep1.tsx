"use client";
import { BgRadioInput } from "../LCSteps/helpers";

export const IssuanceStep1 = () => {
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
        checked={false}
      />
      <BgRadioInput
        id="credit-facility"
        label="Credit Facility"
        name="issuedAgainst"
        value="credit-facility"
        // register={register}
        register={() => ""}
        checked={false}
      />
    </div>
  );
};
