import { ChevronDown } from "lucide-react";
import React from "react";

export const RiskStep1 = ({ isFunded }: { isFunded?: boolean }) => {
  return (
    <div className="bg-white rounded-lg border border-borderCol py-4 px-4">
      <div className="flex items-center justify-between gap-x-2 w-full">
        <div className="rounded-full text-white size-10 bg-[#255EF2]">1</div>
        <p className="text-lightGray font-semibold text-[17px] ml-2">
          Please choose one of the following that describes this transaction
        </p>
      </div>
      <ChevronDown className="text-[#92929D] cursor-pointer mr-4" />
    </div>
  );
};
