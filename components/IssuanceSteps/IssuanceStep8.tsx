import React from "react";
import { Textarea } from "../ui/textarea";

export const IssuanceStep8 = () => {
  return (
    <div
      id="step8"
      className="pt-3 pb-1 px-2 border border-borderCol rounded-lg w-full"
    >
      <div className="flex items-center gap-x-2 ml-2 mb-3">
        <p className="text-sm size-6 rounded-full bg-primaryCol center text-white font-semibold">
          8
        </p>
        <p className="font-semibold text-[16px] text-lightGray">
          Remarks / Other Requirements
        </p>
      </div>
      <div className="p-2 bg-[#F5F7F9] rounded-lg">
        <Textarea
          name="productDescription"
          register={() => ""}
          placeholder="Add remarks"
          className="bg-white border border-borderCol placeholder:text-para resize-none focus-visible:ring-0 focus-visible:ring-offset-0 "
          rows={5}
        />
      </div>
    </div>
  );
};
