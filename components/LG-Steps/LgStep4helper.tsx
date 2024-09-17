import React, { useEffect, useState } from "react";
import { BgRadioInput } from "../LCSteps/helpers";
import { LgStepsProps1 } from "@/types/lg";
import useStepStore from "@/store/lcsteps.store";
import { TYPE_OF_LG } from "@/utils/constant/lg";

const LgStep4Helper: React.FC<LgStepsProps1> = ({
  register,
  watch,
  setStepCompleted,
  setValue,
}) => {
  const typeOfLg = watch("typeOfLg.type"); // Now watching typeOfLg.type
  const { addStep } = useStepStore();
  const [isOtherSelected, setIsOtherSelected] = useState(false);

  // Handle typeOfLg changes
  useEffect(() => {
    if (typeOfLg === "Other") {
      setIsOtherSelected(true);
    } else {
      setIsOtherSelected(false);
    }
    if (typeOfLg) {
      addStep(TYPE_OF_LG);
    }
  }, [typeOfLg, setValue]);

  return (
    <div
      id="lg-step4"
      className="py-3 px-2 border border-borderCol rounded-lg w-full scroll-target"
    >
      <div className="flex items-center gap-x-2 ml-3 mb-3">
        <p className="text-sm size-6 rounded-full bg-primaryCol center text-white font-semibold">
          4
        </p>
        <p className="font-semibold text-[16px] text-lightGray">Type of LG</p>
      </div>

      <div className="border border-[#E2E2EA] bg-[#F5F7F9] pt-2 px-2 rounded-lg ">
        <div className="flex gap-3 items-center w-full">
          <BgRadioInput
            id="LgType1"
            label="Bid Bond"
            name="typeOfLg.type" // Registering the value to typeOfLg.type
            value="Bid Bond"
            register={register}
            checked={typeOfLg === "Bid Bond"}
          />
          <BgRadioInput
            id="LgType2"
            label="Advance Payment Bond"
            name="typeOfLg.type"
            value="Advance Payment Bond"
            register={register}
            checked={typeOfLg === "Advance Payment Bond"}
          />
          <BgRadioInput
            id="LgType3"
            label="Performance Bond"
            name="typeOfLg.type"
            value="Performance Bond"
            register={register}
            checked={typeOfLg === "Performance Bond"}
          />
          <BgRadioInput
            id="LgType4"
            label="Retention Bond"
            name="typeOfLg.type"
            value="Retention Bond"
            register={register}
            checked={typeOfLg === "Retention Bond"}
          />
          <BgRadioInput
            id="LgType5"
            label="Payment LG"
            name="typeOfLg.type"
            value="Payment LG"
            register={register}
            checked={typeOfLg === "Payment LG"}
          />
        </div>

        <div className="flex gap-3 items-center">
          <BgRadioInput
            id="LgType6"
            label="Zakat"
            name="typeOfLg.type"
            value="Zakat"
            register={register}
            checked={typeOfLg === "Zakat"}
          />
          <BgRadioInput
            id="LgType7"
            label="Custom"
            name="typeOfLg.type"
            value="Custom"
            register={register}
            checked={typeOfLg === "Custom"}
          />
          <BgRadioInput
            id="LgType8"
            label="SBLC"
            name="typeOfLg.type"
            value="SBLC"
            register={register}
            checked={typeOfLg === "SBLC"}
          />
          <BgRadioInput
            id="LgType9"
            label="Other (Type Here)"
            name="typeOfLg.type"
            value="Other"
            register={register}
            checked={typeOfLg === "Other"}
          />
        </div>

        {/* Show input if "Other" is selected */}
        {isOtherSelected && (
          <div className="mt-3">
            <label
              className="text-sm font-medium text-lightGray"
              htmlFor="typeOfLg.type"
            >
              Please specify the LG type
            </label>
            <input
              type="text"
              {...register("typeOfLg.type")}
              value={typeOfLg} // Bind the value directly to typeOfLg.type
              onChange={(e) => setValue("typeOfLg.type", e.target.value)} // Update typeOfLg.type directly
              placeholder="Type your LG here"
              className="mt-2 p-2 w-full border border-borderCol rounded-md"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LgStep4Helper;
