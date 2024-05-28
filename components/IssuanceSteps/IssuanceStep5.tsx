"use client";
import { useState } from "react";
import { BgRadioInput } from "../LCSteps/helpers";
import { Textarea } from "../ui/textarea";

export const IssuanceStep5 = () => {
  const [checkedState, setCheckedState] = useState({
    "type-bid": false,
    "type-advance": false,
    "type-payment": false,
    "type-cg": false,
    "type-performance": false,
  });

  const handleCheckChange = (id: string) => {
    const newCheckedState = {
      "type-bid": id === "type-bid",
      "type-advance": id === "type-advance",
      "type-payment": id === "type-payment",
      "type-cg": id === "type-cg",
      "type-performance": id === "type-performance",
    };
    setCheckedState(newCheckedState);
  };
  return (
    <div
      id="step5"
      className="pt-3 pb-1 px-2 border border-borderCol rounded-lg w-full"
    >
      <div className="flex items-center gap-x-2 ml-2 mb-3">
        <p className="text-sm size-6 rounded-full bg-primaryCol center text-white font-semibold">
          5
        </p>
        <p className="font-semibold text-[16px] text-lightGray">Type of LG</p>
      </div>
      <div className="flex items-center justify-between gap-x-2">
        <BgRadioInput
          id="type-bid"
          label="Bid"
          name="lgType"
          value="bid"
          // register={register}
          register={() => ""}
          checked={checkedState["type-bid"]}
          handleCheckChange={handleCheckChange}
        />
        <BgRadioInput
          id="type-advance"
          label="Advance"
          name="lgType"
          value="advance"
          // register={register}
          register={() => ""}
          checked={checkedState["type-advance"]}
          handleCheckChange={handleCheckChange}
        />
        <BgRadioInput
          id="type-payment"
          label="Payment"
          name="lgType"
          value="payment"
          // register={register}
          register={() => ""}
          checked={checkedState["type-payment"]}
          handleCheckChange={handleCheckChange}
        />
        <BgRadioInput
          id="type-cg"
          label="CG"
          name="lgType"
          value="cg"
          // register={register}
          register={() => ""}
          checked={checkedState["type-cg"]}
          handleCheckChange={handleCheckChange}
        />
        <BgRadioInput
          id="type-performance"
          label="Performance"
          name="lgType"
          value="performance"
          // register={register}
          register={() => ""}
          checked={checkedState["type-performance"]}
          handleCheckChange={handleCheckChange}
        />
      </div>

      <div className="mt-2 border border-borderCol pt-3 pb-2 px-2 rounded-md w-full bg-[#F5F7F9]">
        <p className="text-sm font-semibold mb-2 ml-2">
          Purpose of the LG - Description in Brief:
        </p>
        <Textarea
          name="lgDescription"
          rows={4}
          register={() => ""}
          placeholder="Enter a brief description of the purpose of this LG"
          className="bg-white text-sm border border-borderCol resize-none w-full py-2 px-3 rounded-lg outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        ></Textarea>
      </div>
    </div>
  );
};
