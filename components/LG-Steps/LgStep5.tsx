import React, { useEffect } from "react";
import { BgRadioInput } from "../LCSteps/helpers";
import { LgStepsProps5 } from "@/types/lg";
import LgStep5Helper from "./LgStep5Helper";
import useStepStore from "@/store/lcsteps.store";
import { LG_DETAILS } from "@/utils/constant/lg";
import { useForm } from "react-hook-form";
import useLcIssuance from "@/store/issueance.store";

const LgStep5: React.FC<LgStepsProps5> = ({
  register,
  watch,
  setStepCompleted,
  setValue,
}) => {
  const lgDetailsType = watch("lgDetailsType");

  const otherBond = watch("otherBond.Contract");
  const bidBond = watch("bidBond.Contract");
  const advancePaymentBond = watch("advancePaymentBond.Contract");
  const performanceBond = watch("performanceBond.Contract");
  const retentionMoneyBond = watch("retentionMoneyBond.Contract");

  useEffect(() => {
    if (lgDetailsType === "Choose any other type of LGs") {
      setValue("otherBond.Contract", true);
    } else if (lgDetailsType === "Choose any other type of LGs") {
      setValue("otherBond.Contract", false);
    }
  }, [lgDetailsType]);

  const bondTypes =
    lgDetailsType === "Choose any other type of LGs"
      ? ["otherBond"]
      : [
          "bidBond",
          "advancePaymentBond",
          "performanceBond",
          "retentionMoneyBond",
        ];

  const checkedValues = {
    bidBond,
    advancePaymentBond,
    performanceBond,
    retentionMoneyBond,
    otherBond,
  };

  const isFieldFilled = (name: string, field: string) => {
    const value = watch(`${name}.${field}`);
    return value && value !== undefined && value !== null;
  };

  const areRespectiveFieldsFilled = () => {
    const isAnyBondSelected = bondTypes.some(
      (bondType) => checkedValues[bondType as keyof typeof checkedValues]
    );

    if (!isAnyBondSelected) {
      return false;
    }
    return bondTypes.every((bondType) => {
      if (checkedValues[bondType as keyof typeof checkedValues]) {
        const isContractFilled = isFieldFilled(bondType, "Contract");
        const isExpectedDateFilled = isFieldFilled(bondType, "expectedDate");
        const isLgExpiryDateFilled = isFieldFilled(bondType, "lgExpiryDate");
        const isCashMarginFilled = isFieldFilled(bondType, "cashMargin");
        const isLgTenorValueFilled = isFieldFilled(
          bondType,
          "lgTenor.lgTenorValue"
        );

        return (
          isContractFilled &&
          isExpectedDateFilled &&
          isLgExpiryDateFilled &&
          isCashMarginFilled &&
          isLgTenorValueFilled
        );
      }
      return true;
    });
  };

  const allFieldsFilled = areRespectiveFieldsFilled();

  const { addStep, removeStep } = useStepStore();

  useEffect(() => {
    if (allFieldsFilled) {
      addStep(LG_DETAILS);
    } else removeStep(LG_DETAILS);
  }, [allFieldsFilled]);
  return (
    <div
      id="lg-step5"
      className="py-3 px-2 border border-borderCol rounded-lg w-full scroll-target"
    >
      <div className="flex items-center gap-x-2 ml-3 mb-3">
        <p className="text-sm size-6 rounded-full bg-primaryCol center text-white font-semibold">
          5
        </p>
        <p className="font-semibold text-[16px] text-lightGray">LG Details</p>
      </div>
      <div className="flex gap-3 items-center border border-[#E2E2EA] bg-[#F5F7F9] pt-2 px-2 rounded-lg ">
        <BgRadioInput
          id="lgDetails1"
          label="Contract Related LGs (Bid Bond, Advance Payment Bond, Performance Bond etc)"
          name="lgDetailsType"
          value="Contract Related LGs (Bid Bond, Advance Payment Bond, Performance Bond etc)"
          register={register}
          checked={
            lgDetailsType ===
            "Contract Related LGs (Bid Bond, Advance Payment Bond, Performance Bond etc)"
          }
          extraClassName="h-[60px]"
        />
        <BgRadioInput
          id="lgDetails2"
          label="Choose any other type of LGs"
          name="lgDetailsType"
          value="Choose any other type of LGs"
          register={register}
          checked={lgDetailsType === "Choose any other type of LGs"}
          extraClassName="h-[60px]"
        />
      </div>
      <LgStep5Helper
        setValue={setValue}
        register={register}
        watch={watch}
        setStepCompleted={setStepCompleted}
        listValue={lgDetailsType}
      />
    </div>
  );
};

export default LgStep5;
