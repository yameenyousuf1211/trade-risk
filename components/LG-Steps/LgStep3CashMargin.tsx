"use client";
import React, { useEffect } from "react";
import { LgStepsProps3 } from "@/types/lg";
import { Plus, X } from "lucide-react";
import { DDInput } from "../LCSteps/helpers";
import { Input } from "../ui/input";
import { useQuery } from "@tanstack/react-query";
import { getBanks } from "@/services/apis/helpers.api";
import useStepStore from "@/store/lcsteps.store";
import { LG_PREFERRED_BANKS } from "@/utils/constant/lg";

export default function LgStep3CashMargin({
  register,
  watch,
  setStepCompleted,
  draft,
  data,
  flags,
  setValue,
}: LgStepsProps3) {
  // Watch the entire preferredBanks object
  const lgIssuance = watch("lgIssuance");
  const lgIssuanceWithinCountry =
    lgIssuance === "LG issuance within the country";
  const preferredBanks = watch("preferredBanks");
  const preferredBanksArray = preferredBanks?.banks || [];
  const { addStep, removeStep } = useStepStore();
  // Watch the country field
  const preferredCountry = watch("preferredBanks.country");

  useEffect(() => {
    const subscription = watch((value) => {
      const issuingBanks = value.preferredBanks?.banks || [];
      const preferredCountry = value.preferredBanks?.country || "";

      const allFieldsFilled = issuingBanks.every(
        (bank: any) =>
          bank.bank?.trim() !== "" &&
          bank.swiftCode?.trim() !== "" &&
          bank.accountNumber?.trim() !== "" &&
          preferredCountry.trim() !== ""
      );

      if (allFieldsFilled) {
        addStep(LG_PREFERRED_BANKS);
      } else {
        removeStep(LG_PREFERRED_BANKS);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, addStep, removeStep]);
  // Ensure there is always one preferred bank
  useEffect(() => {
    if (preferredBanksArray.length === 0) {
      setValue("preferredBanks.banks", [
        {
          bank: "",
          swiftCode: "",
          accountNumber: "",
        },
      ]);
    }
  }, [preferredBanksArray.length, setValue]);

  useEffect(() => {
    if (preferredCountry && !draft) {
      const resetBanks = preferredBanksArray.map(() => ({
        bank: "",
        swiftCode: "",
        accountNumber: "",
      }));
      setValue("preferredBanks.banks", resetBanks);
    }
  }, [preferredCountry, preferredBanksArray.length]);

  // Fetch banks dynamically based on selected country
  const { data: preferredBankOptions, isLoading } = useQuery({
    queryKey: ["preferred-banks", preferredCountry],
    queryFn: () => getBanks(preferredCountry),
    enabled: !!preferredCountry, // Only fetch when a country is selected
  });

  // Handle adding new banks
  const handlePreferredBankAddition = () => {
    if (preferredBanksArray.length < 5) {
      setValue("preferredBanks.banks", [
        ...preferredBanksArray,
        {
          bank: "",
          swiftCode: "",
          accountNumber: "",
        },
      ]);
    }
  };

  // Handle removing banks
  const handlePreferredBankRemoval = (index: number) => {
    if (index >= 0) {
      setValue(
        "preferredBanks.banks",
        preferredBanksArray.filter((_, i) => i !== index)
      );
    }
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
          Any Preferred banks to issue the LG (up to 5 Banks)
        </p>
      </div>

      <div className="py-3 px-2 rounded-md border border-borderCol bg-[#F5F7F9]">
        <p className="font-semibold mb-2">Country</p>
        <div className="relative flex items-center gap-x-3 w-full">
          <div className="flex items-center gap-x-2 w-full">
            <DDInput
              label="Preferred Bank Country"
              id="preferredBanks.country"
              placeholder="Select a Country"
              value={preferredCountry}
              data={data}
              setValue={setValue}
              flags={flags}
            />
          </div>
        </div>
      </div>

      {preferredBanksArray?.map((bank, index) => (
        <div
          key={index}
          className="border border-[#E2E2EA] bg-[#F5F7F9] rounded-lg mt-4 relative"
        >
          <div className="flex items-center justify-between">
            <p className="px-4 pt-2 font-semibold text-[#1A1A26] font-poppins">
              Preferred Bank
            </p>
            {index > 0 ? (
              <div
                onClick={() => handlePreferredBankRemoval(index)}
                className="m-1 bg-red-500 center text-white rounded-full size-6 shadow-md z-10 cursor-pointer"
              >
                <X className="size-5 text-white" />
              </div>
            ) : null}
          </div>
          <div className="flex gap-3 pt-2 px-2 pb-2">
            <DDInput
              placeholder="Select Bank"
              label="Bank"
              value={bank.bank}
              id={`preferredBanks.banks[${index}].bank`}
              setValue={setValue}
              data={
                preferredBankOptions?.success && preferredBankOptions.response
                  ? preferredBankOptions.response
                  : []
              }
              disabled={isLoading || !preferredCountry}
            />
            <label
              id={`preferredBanks.banks[${index}].swiftCode`}
              className="border p-1 px-3 rounded-md w-full flex items-center justify-between bg-white"
            >
              <p className="w-full text-sm text-lightGray">Swift Code</p>
              <Input
                register={register}
                name={`preferredBanks.banks[${index}].swiftCode`}
                type="text"
                id={`preferredBanks.banks[${index}].swiftCode`}
                className="block bg-none text-sm text-end border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-[180px]"
                placeholder="Type here"
              />
            </label>
            {!lgIssuanceWithinCountry && (
              <label
                id={`preferredBanks.banks[${index}].accountNumber`}
                className="border p-1 px-3 rounded-md w-full flex items-center justify-between bg-white"
              >
                <p className="w-full text-sm text-lightGray">Account Number</p>
                <Input
                  register={register}
                  name={`preferredBanks.banks[${index}].accountNumber`}
                  type="text"
                  id={`preferredBanks.banks[${index}].accountNumber`}
                  className="block bg-none text-sm text-end border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-[180px]"
                  placeholder="Type here"
                />
              </label>
            )}
          </div>
          {lgIssuanceWithinCountry && (
            <div className="px-2 pb-2">
              <label
                id={`preferredBanks.banks[${index}].accountNumber`}
                className="border p-1 px-3 rounded-md w-full flex items-center justify-between bg-white"
              >
                <p className="w-full text-sm text-lightGray">Account Number</p>
                <Input
                  register={register}
                  name={`preferredBanks.banks[${index}].accountNumber`}
                  type="text"
                  id={`preferredBanks.banks[${index}].accountNumber`}
                  className="block bg-none text-sm text-end border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-[180px]"
                  placeholder="Type here"
                />
              </label>
            </div>
          )}
        </div>
      ))}

      {preferredBanksArray?.length < 5 ? (
        <div
          onClick={handlePreferredBankAddition}
          className="flex-col cursor-pointer bg-white center gap-y-3 border-2 border-dotted border-borderCol py-3 rounded-md mt-4"
        >
          <div className="center p-1 border border-black rounded-full">
            <Plus className="size-4" />
          </div>
          <p className="text-sm text-lightGray">Add Preferred Bank</p>
        </div>
      ) : null}
    </div>
  );
}
