"use client";
import { useState, useEffect } from "react";
import { BgRadioInput } from "./helpers";
import { useForm } from "react-hook-form";

export const Step1 = ({ register, type, setStepCompleted }: any) => {
  const { getValues } = useForm();
  const [checkedState, setCheckedState] = useState({
    "role-exporter": false,
    "role-importer": false,
  });

  const handleCheckChange = (id: string) => {
    const newCheckedState = {
      "role-exporter": id === "role-exporter",
      "role-importer": id === "role-importer",
    };
    setCheckedState(newCheckedState);

    const isStepComplete =
      newCheckedState["role-exporter"] || newCheckedState["role-importer"];
    setStepCompleted(0, isStepComplete);
  };

  return (
    <div id="step1" className="py-3 px-2 border border-borderCol rounded-lg w-full">
      <div className="flex items-center gap-x-2 ml-3 mb-3">
        <p className="text-sm size-6 rounded-full bg-primaryCol center text-white font-semibold">
          1
        </p>
        <p className="font-semibold text-[16px] text-lightGray">
          {type === "discount"
            ? "Transaction as"
            : "In this transaction you are?"}
        </p>
      </div>
      <BgRadioInput
        id="role-exporter"
        label="Exporter/Supplier (Beneficiary)"
        name="participantRole"
        value="exporter"
        register={register}
        checked={checkedState["role-exporter"]}
        handleCheckChange={handleCheckChange}
      />
      <BgRadioInput
        id="role-importer"
        label="Importer (Applicant)"
        name="participantRole"
        value="importer"
        register={register}
        checked={checkedState["role-importer"]}
        handleCheckChange={handleCheckChange}
      />
    </div>
  );
};
