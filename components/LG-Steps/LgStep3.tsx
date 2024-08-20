import React, { useEffect, useState } from "react";
import { BgRadioInput, DDInput } from "../LCSteps/helpers";
import { LgStepsProps3 } from "@/types/lg";
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
  const issuingCountry = watch("issuingBank.country");
  const bank = watch("issuingBank.bank");
  const swiftCode = watch("issuingBank.swiftCode");
  const { addStep, removeStep } = useStepStore();

  const [isStepCompleted, setIsStepCompleted] = useState(false);
  const [additionalBanks, setAdditionalBanks] = useState<number[]>([]);

  const { data: issuingBanks } = useQuery({
    queryKey: ["issuing-banks", issuingCountry],
    queryFn: () => getBanks(issuingCountry),
    enabled: !!issuingCountry,
  });

  useEffect(() => {
    if (issuingCountry && bank && swiftCode) {
      addStep(LG_ISSUING_BANK);
    } else {
      removeStep(LG_ISSUING_BANK);
    }
  }, [issuingCountry, swiftCode, bank]);

  const handleAddBank = () => {
    if (additionalBanks.length < 2) {
      setAdditionalBanks([...additionalBanks, additionalBanks.length + 1]);
    } else {
      toast.error("You can add up to 2 additional banks only");
    }
  };

  const handleRemoveBank = (index: number) => {
    setAdditionalBanks(additionalBanks.filter((_, i) => i !== index));
  };

  return (
    <div
      id="lg-step3"
      className="py-3 px-2 border border-borderCol rounded-lg w-full scroll-target "
    >
      <div className="flex items-center gap-x-2 ml-3 mb-3">
        <p className="text-sm size-6 rounded-full bg-primaryCol center text-white font-semibold">
          3
        </p>
        <p className="font-semibold text-[16px] text-lightGray">
          LG Issuing Bank/Expected (you can add three banks if you are not sure
          yet which bank will issue the LG)
        </p>
      </div>

      <div className=" border border-[#E2E2EA] bg-[#F5F7F9]  rounded-lg ">
        <p className="px-4 pt-2 font-semibold text-[#1A1A26] font-poppins">
          Issuing Bank
        </p>
        <div className="flex items-center gap-3 pt-2 px-2 pb-2">
          <DDInput
            placeholder="Select Country"
            label="Issuing Bank Country"
            value={issuingCountry}
            id="issuingBank.country"
            data={data}
            setValue={setValue}
            flags={flags}
          />
          <DDInput
            value={bank}
            placeholder="Select Bank"
            label="Bank"
            id="issuingBank.bank"
            setValue={setValue}
            data={issuingBanks && issuingBanks.success && issuingBanks.response}
            disabled={
              !issuingCountry ||
              (issuingBanks && issuingBanks.success && !issuingBanks.response)
            }
          />
          <label
            id="issuingBank.swiftCode"
            className="border p-1 px-3 rounded-md w-full flex items-center justify-between bg-white"
          >
            <p className="w-full text-sm text-lightGray">Swift Code</p>
            <Input
              value={swiftCode}
              onChange={(e) =>
                setValue("issuingBank.swiftCode", e.target.value)
              }
              register={register}
              name="issuingBank.swiftCode"
              type="text"
              className="block bg-none text-sm text-end border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-[180px]"
              placeholder="Enter Code"
            />
          </label>
        </div>
      </div>

      {additionalBanks.map((bankId, index) => (
        <div
          key={bankId}
          className="border border-[#E2E2EA] bg-[#F5F7F9] rounded-lg mt-4"
        >
          <div className="flex justify-between items-center px-4 pt-2">
            <p className="font-semibold text-[#1A1A26] font-poppins">
              Issuing Bank (Optional)
            </p>
            <XCircle
              className="cursor-pointer text-red-500"
              onClick={() => handleRemoveBank(index)}
            />
          </div>
          <div className="flex items-center gap-3 pt-2 px-2 pb-2">
            <DDInput
              placeholder="Select Country"
              label="Issuing Bank Country"
              value={issuingCountry}
              id={`test`}
              data={data}
              setValue={setValue}
              flags={flags}
            />
            <DDInput
              placeholder="Select Bank"
              label="Bank"
              id={`test`}
              setValue={setValue}
              data={
                issuingBanks && issuingBanks.success && issuingBanks.response
              }
              disabled={
                !issuingCountry ||
                (issuingBanks && issuingBanks.success && !issuingBanks.response)
              }
            />
            <label
              id={`test`}
              className="border p-1 px-3 rounded-md w-full flex items-center justify-between bg-white"
            >
              <p className="w-full text-sm text-lightGray">Swift Code</p>
              <Input
                register={register}
                name={`test`}
                type="text"
                className="block bg-none text-sm text-end border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-[180px]"
                placeholder="Enter Code"
              />
            </label>
          </div>
        </div>
      ))}

      {additionalBanks.length < 2 && (
        <div className="border border-dashed border-spacing-7 rounded-lg border-[#E2E2EA] flex items-center justify-center mt-4 p-12">
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={handleAddBank}
          >
            <PlusCircle />
            <p className="font-semibold font-poppins">Add other Bank</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LgStep3;
