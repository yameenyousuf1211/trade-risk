import React, { useEffect, useState } from "react";
import { DDInput } from "../LCSteps/helpers";
import { IssuingBank, LgStepsProps3 } from "@/types/lg";
import { Input } from "../ui/input";
import { useQuery } from "@tanstack/react-query";
import { getBanks } from "@/services/apis/helpers.api";
import { PlusCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import useStepStore from "@/store/lcsteps.store";
import { LG_ISSUING_BANK } from "@/utils/constant/lg";

const LgStep3: React.FC<LgStepsProps3> = ({
  register,
  watch,
  setStepCompleted,
  data,
  flags,
  setValue,
}) => {
  const issuingBanks: IssuingBank[] = watch("issuingBanks") || [
    { country: "", bank: "", swiftCode: "" },
  ];
  const { addStep, removeStep } = useStepStore();

  // State to hold bank options for each issuing bank
  const [bankOptions, setBankOptions] = useState<Record<number, any>>({});

  // Fetch bank options when the country changes for each issuing bank
  useEffect(() => {
    issuingBanks.forEach((bank, index) => {
      if (bank.country) {
        getBanks(bank.country).then((response) => {
          setBankOptions((prevOptions) => ({
            ...prevOptions,
            [index]: response.success ? response.response : [],
          }));
        });
      } else {
        setBankOptions((prevOptions) => ({
          ...prevOptions,
          [index]: [],
        }));
      }
    });
  }, [issuingBanks]);

  useEffect(() => {
    const subscription = watch((value) => {
      const issuingBanks = value.issuingBanks || [];
      const hasCompleteBank = issuingBanks.some(
        (bank: IssuingBank) => bank.country && bank.bank
      );

      if (hasCompleteBank) {
        addStep(LG_ISSUING_BANK);
      } else {
        removeStep(LG_ISSUING_BANK);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, addStep, removeStep]);

  const handleAddBank = () => {
    if (issuingBanks.length < 3) {
      const newBanks = [
        ...issuingBanks,
        { country: "", bank: "", swiftCode: "" },
      ];
      setValue("issuingBanks", newBanks);
    } else {
      toast.error("You can add up to 3 banks only");
    }
  };

  const handleRemoveBank = (index: number) => {
    const updatedBanks = issuingBanks.filter((_, i) => i !== index);
    setValue("issuingBanks", updatedBanks);
    setBankOptions((prevOptions) => {
      const newOptions = { ...prevOptions };
      delete newOptions[index];
      return newOptions;
    });
  };

  const handleCountryChange = (index: number, value: string) => {
    const updatedBanks = issuingBanks.map((bank, i) =>
      i === index ? { ...bank, country: value, bank: "", swiftCode: "" } : bank
    );
    setValue("issuingBanks", updatedBanks);
  };

  return (
    <div
      id="lg-step3"
      className="py-3 px-2 border border-borderCol rounded-lg w-full scroll-target"
    >
      <div className="flex items-center gap-x-2 ml-3 mb-3">
        <p className="text-sm size-6 rounded-full bg-primaryCol center text-white font-semibold">
          3
        </p>
        <p className="font-semibold text-[16px] text-lightGray">
          LG Issuing Bank/Expected (you can add up to three banks if you are not
          sure yet which bank will issue the LG)
        </p>
      </div>

      {issuingBanks.map((bank, index) => (
        <div
          key={index}
          className="border border-[#E2E2EA] bg-[#F5F7F9] rounded-lg mt-4"
        >
          <div className="flex justify-between items-center px-4 pt-2">
            <p className="font-semibold text-[#1A1A26] font-poppins">
              {index === 0 ? "Issuing Bank" : "Issuing Bank (Optional)"}
            </p>
            {index > 0 && (
              <XCircle
                className="cursor-pointer text-red-500"
                onClick={() => handleRemoveBank(index)}
              />
            )}
          </div>
          <div className="flex items-center gap-3 pt-2 px-2 pb-2">
            <DDInput
              placeholder="Select Country"
              label="Issuing Bank Country"
              value={bank.country}
              id={`issuingBanks[${index}].country`}
              data={data}
              setValue={(field, value) => {
                setValue(field, value, { shouldValidate: true });
                handleCountryChange(index, value);
              }}
              flags={flags}
            />

            <DDInput
              placeholder="Select Bank"
              label="Bank"
              value={bank.bank}
              id={`issuingBanks[${index}].bank`}
              setValue={(field, value) =>
                setValue(field, value, { shouldValidate: true })
              }
              data={bankOptions[index] || []}
              disabled={!bank.country}
            />
            <label className="border p-1 px-3 rounded-md w-full flex items-center justify-between bg-white">
              <p className="w-full text-sm text-lightGray">Swift Code</p>
              <Input
                register={register}
                name={`issuingBanks[${index}].swiftCode`}
                type="text"
                id={`issuingBanks[${index}].swiftCode`}
                className="block bg-none text-sm text-end border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-[180px]"
                placeholder="Enter Code"
              />
            </label>
          </div>
        </div>
      ))}

      {issuingBanks.length < 3 && (
        <div className="border border-dashed border-spacing-7 rounded-lg border-[#E2E2EA] flex items-center justify-center mt-4 p-12">
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={handleAddBank}
          >
            <PlusCircle />
            <p className="font-semibold font-poppins">Add another Bank</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LgStep3;
