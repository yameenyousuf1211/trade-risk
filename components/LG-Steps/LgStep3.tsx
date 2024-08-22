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
      className="scroll-target w-full rounded-lg border border-borderCol px-2 py-3"
    >
      <div className="mb-3 ml-3 flex items-center gap-x-2">
        <p className="center size-6 rounded-full bg-primaryCol text-sm font-semibold text-white">
          3
        </p>
        <p className="text-[16px] font-semibold text-lightGray">
          LG Issuing Bank/Expected (you can add three banks if you are not sure
          yet which bank will issue the LG)
        </p>
      </div>

      <div className="rounded-lg border border-[#E2E2EA] bg-[#F5F7F9]">
        <p className="px-4 pt-2 font-poppins font-semibold text-[#1A1A26]">
          Issuing Bank
        </p>
        <div className="flex items-center gap-3 px-2 pb-2 pt-2">
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
            className="flex w-full items-center justify-between rounded-md border bg-white p-1 px-3"
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
              className="block w-[180px] border-none bg-none text-end text-sm outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Enter Code"
            />
          </label>
        </div>
      </div>

      {additionalBanks.map((bankId, index) => (
        <div
          key={bankId}
          className="mt-4 rounded-lg border border-[#E2E2EA] bg-[#F5F7F9]"
        >
          <div className="flex items-center justify-between px-4 pt-2">
            <p className="font-poppins font-semibold text-[#1A1A26]">
              Issuing Bank (Optional)
            </p>
            <XCircle
              className="cursor-pointer text-red-500"
              onClick={() => handleRemoveBank(index)}
            />
          </div>
          <div className="flex items-center gap-3 px-2 pb-2 pt-2">
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
              className="flex w-full items-center justify-between rounded-md border bg-white p-1 px-3"
            >
              <p className="w-full text-sm text-lightGray">Swift Code</p>
              <Input
                register={register}
                name={`test`}
                type="text"
                className="block w-[180px] border-none bg-none text-end text-sm outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Enter Code"
              />
            </label>
          </div>
        </div>
      ))}

      {additionalBanks.length < 2 && (
        <div className="mt-4 flex border-spacing-7 items-center justify-center rounded-lg border border-dashed border-[#E2E2EA] p-12">
          <div
            className="flex cursor-pointer flex-col items-center"
            onClick={handleAddBank}
          >
            <PlusCircle />
            <p className="font-poppins font-semibold">Add other Bank</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LgStep3;
