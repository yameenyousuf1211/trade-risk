import React, { useEffect } from "react";
import { LgStepsProps1 } from "@/types/lg";
import useStepStore from "@/store/lcsteps.store";
import { REMARKS } from "@/utils/constant/lg";

const LgStep8: React.FC<LgStepsProps1> = ({
  register,
  watch,
  setStepCompleted,
  setValue,
}) => {
    const remarks = watch(`remarks`);
    const { addStep, removeStep } = useStepStore();
  
    useEffect(() => {
      if (remarks?.trim()) addStep(REMARKS);
      else removeStep(REMARKS);
    }, [remarks]);
  return (
    <div
      id="lg-step7"
      className="py-3 px-2 border border-borderCol rounded-lg w-full scroll-target"
    >
      <div className="flex items-center gap-x-2 ml-3 mb-3">
        <p className="text-sm size-6 rounded-full bg-primaryCol center text-white font-semibold">
          8
        </p>
        <p className="font-semibold text-[16px] text-lightGray">
          Remarks / Other Requirements / Queries:
        </p>
      </div>
      <div className="flex items-center gap-3 border border-[#E2E2EA] bg-[#F5F7F9] pt-2 px-2 rounded-lg pb-2 p-4">
        <textarea
          {...register("remarks")}
          onChange={(e) => {
            setValue("remarks", e.target.value);
          }}
          placeholder="Add Remarks"
          className="p-2 w-full  bg-none text-sm  border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 "
          rows={2}
        />
      </div>
    </div>
  );
};

export default LgStep8;
