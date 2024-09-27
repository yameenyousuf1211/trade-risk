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
  const typeOfLg = watch("typeOfLg");
  const { addStep } = useStepStore();
  const [isOthersSelected, setIsOthersSelected] = useState(false);
  const [otherValue, setOtherValue] = useState(""); // Store the custom "Other" value

  // Handle changes in the radio selection
  useEffect(() => {
    if (typeOfLg && typeOfLg !== "Other") {
      addStep(TYPE_OF_LG);
    }
  }, [typeOfLg]);

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
            name="typeOfLg"
            extraClassName="h-14"
            value="Bid Bond"
            register={register}
            checked={typeOfLg === "Bid Bond"}
          />
          <BgRadioInput
            id="LgType2"
            label="Advance Payment Bond"
            name="typeOfLg"
            extraClassName="h-14"
            value="Advance Payment Bond"
            register={register}
            checked={typeOfLg === "Advance Payment Bond"}
          />
          <BgRadioInput
            id="LgType3"
            label="Performance Bond"
            name="typeOfLg"
            extraClassName="h-14"
            value="Performance Bond"
            register={register}
            checked={typeOfLg === "Performance Bond"}
          />
          <BgRadioInput
            id="LgType4"
            label="Retention Bond"
            name="typeOfLg"
            extraClassName="h-14"
            value="Retention Bond"
            register={register}
            checked={typeOfLg === "Retention Bond"}
          />
          <BgRadioInput
            id="LgType5"
            label="Payment LG"
            name="typeOfLg"
            extraClassName="h-14"
            value="Payment LG"
            register={register}
            checked={typeOfLg === "Payment LG"}
          />
        </div>

        <div className="flex gap-3 items-center">
          <BgRadioInput
            id="LgType6"
            label="Zakat"
            name="typeOfLg"
            extraClassName="h-14"
            value="Zakat"
            register={register}
            checked={typeOfLg === "Zakat"}
          />
          <BgRadioInput
            id="LgType7"
            label="Custom"
            extraClassName="h-14"
            name="typeOfLg"
            value="Custom"
            register={register}
            checked={typeOfLg === "Custom"}
          />
          <BgRadioInput
            id="LgType8"
            label="SBLC"
            name="typeOfLg"
            extraClassName="h-14"
            value="SBLC"
            register={register}
            checked={typeOfLg === "SBLC"}
          />
          <div
            className={`mb-2 flex w-full items-end gap-x-5 rounded-md border border-borderCol bg-white px-3 py-4 ${
              isOthersSelected && "!bg-[#EEE9FE]"
            }`}
          >
            <label
              htmlFor="payment-others"
              className="flex items-center gap-x-2 text-sm text-lightGray"
            >
              <input
                type="radio"
                value="others"
                id="payment-others"
                checked={isOthersSelected} // Control radio button with the new state
                onChange={() => {
                  setIsOthersSelected(true); // Set "Others" as selected
                  setValue("typeOfLg", ""); // Clear the previous value in form state
                  setOtherValue(""); // Clear the local otherValue input
                }}
                className="size-4 accent-primaryCol"
              />
              Others
            </label>
            <input
              type="text"
              name="othersTextInput"
              value={otherValue}
              disabled={!isOthersSelected} // Enable only when "Others" is selected
              onChange={(e: any) => {
                setOtherValue(e.target.value); // Update the local state
                setValue("typeOfLg", e.target.value); // Set the typed value in form state
              }}
              className="w-[80%] rounded-none !border-b-2 border-transparent !border-b-neutral-300 bg-transparent text-sm outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LgStep4Helper;
