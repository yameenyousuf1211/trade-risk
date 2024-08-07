"use client";
import { useEffect } from "react";
import { BgRadioInput } from "./helpers";
import { UseFormRegister, UseFormWatch } from "react-hook-form";
import useStepStore from "@/store/lcsteps.store";
import { TRANSACTION_AS } from "@/utils/constant/lg";

export const Step1 = ({
  register,
  watch,
  setStepCompleted,
}: {
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  setStepCompleted: (index: number, status: boolean) => void;
}) => {
  const participantRole = watch("participantRole");
  const { addStep, removeStep } = useStepStore();

  useEffect(() => {
    if (participantRole) addStep(TRANSACTION_AS);
  }, [participantRole]);

  return (
    <div
      id="step1"
      className="py-3 px-2 border border-borderCol rounded-lg w-full scroll-target"
    >
      <div className="flex items-center gap-x-2 ml-3 mb-3">
        <p className="text-sm size-6 rounded-full bg-primaryCol center text-white font-semibold">
          1
        </p>
        <p className="font-semibold text-[16px] text-lightGray">
          In this transaction you are?
        </p>
      </div>
      <BgRadioInput
        id="role-exporter"
        label="Exporter/Supplier (Beneficiary)"
        name="participantRole"
        value="exporter"
        register={register}
        checked={participantRole === "exporter"}
      />
      <BgRadioInput
        id="role-importer"
        label="Importer (Applicant)"
        name="participantRole"
        value="importer"
        register={register}
        checked={participantRole === "importer"}
      />
    </div>
  );
};
