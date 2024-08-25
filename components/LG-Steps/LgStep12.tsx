import React, { useEffect } from "react";
import { BgRadioInput } from "../LCSteps/helpers";
import { LgStepsProps10 } from "@/types/lg";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { DatePicker } from "../helpers";
import { LG } from "@/utils";

const LgStep12: React.FC<LgStepsProps10> = ({
  register,
  watch,
  setValue,
  step,
  setStepCompleted,
}) => {
  const lgIssuance = watch("lgIssuance");
  const lastDateOfReceivingBids = watch("lastDateOfReceivingBids");

  console.log("🚀 ~ lastDateOfReceivingBidsss", lastDateOfReceivingBids);
  console.log("🚀 ~ lastDateOfReceivingBidsss", new Date(lastDateOfReceivingBids));
  return (
    <div
      id={`lg-step${step}`}
      className="py-3 px-2 border border-borderCol rounded-lg w-full scroll-target"
    >
      <div className="flex items-center gap-x-2 ml-3 mb-3">
        <p className="text-sm size-6 rounded-full bg-primaryCol center text-white font-semibold">
          {step || 10}
        </p>
        <p className="font-semibold text-[16px] text-lightGray">
          {lgIssuance === LG.cashMargin
            ? "Request Expiry Date"
            : "Last date for receiving bids"}
        </p>
      </div>

      <div className="flex items-center gap-3 border border-[#E2E2EA] bg-[#F5F7F9] pt-2 px-2 rounded-lg pb-2 p-4">
        <label
          id="expectedDate"
          className="border p-1 px-2 rounded-md w-[100%] flex items-center justify-between bg-white"
        >
          <p className="w-full text-sm text-lightGray">Select Date</p>
          <DatePicker
            maxDate={
              new Date(new Date().setFullYear(new Date().getFullYear() + 1))
            }
            setValue={setValue}
            // value={lastDateOfReceivingBids}
            value={new Date(lastDateOfReceivingBids)}
            name={`lastDateOfReceivingBids`}
          />
        </label>
      </div>
    </div>
  );
};

export default LgStep12;
