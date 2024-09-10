"use client";
import React, { useEffect, useState } from "react";
import { LgStepsProps3 } from "@/types/lg";
import { Plus, X } from "lucide-react";
import { DDInput } from "../LCSteps/helpers";
import { Input } from "../ui/input";
import { useQuery } from "@tanstack/react-query";
import { getBanks } from "@/services/apis/helpers.api";

export default function LgStep3CashMargin({
  register,
  watch,
  setStepCompleted,
  data,
  flags,
  setValue,
}: LgStepsProps3) {
  const issuingBanks = watch("issuingBanks");

  // Watch the issuing bank's country field for changes
  const issuingCountry = watch("issuingBanks[0].country");

  // Fetch banks dynamically based on selected country
  const { data: issuingBankOptions, isLoading } = useQuery({
    queryKey: ["issuing-banks", issuingCountry],
    queryFn: () => getBanks(issuingCountry),
    enabled: !!issuingCountry, // Only fetch when a country is selected
  });

  const handleIssuingBankAddition = () => {
    if (issuingBanks.length < 5) {
      setValue("issuingBanks", [
        ...issuingBanks,
        {
          bank: "",
          swiftCode: "",
          country: "",
          accountNumber: "",
        },
      ]);
    }
  };

  const handleIssuingBankRemoval = (index: number) => {
    if (index > 0) {
      setValue(
        "issuingBanks",
        issuingBanks.filter((_, i) => i !== index)
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
          Any Preferred banks to issue the LG (up to 5 Banks )
        </p>
      </div>

      <div className="py-3 px-2 rounded-md border border-borderCol bg-[#F5F7F9]">
        <p className="font-semibold mb-2">Country</p>
        <div className="relative flex items-center gap-x-3 w-full">
          <div className="flex items-center gap-x-2 w-full">
            <DDInput
              label="Issuing Bank Country"
              id="issuingBanks[0].country"
              placeholder="Select a Country"
              value={issuingBanks[0]?.country}
              data={data}
              setValue={setValue}
              flags={flags}
            />
          </div>
        </div>
      </div>

      {issuingBanks?.map((bank, index) => (
        <div
          key={index}
          className="border border-[#E2E2EA] bg-[#F5F7F9] rounded-lg mt-4 relative"
        >
          <div className="flex items-center justify-between">
            <p className="px-4 pt-2 font-semibold text-[#1A1A26] font-poppins">
              Issuing Bank
            </p>
            {index > 0 ? (
              <div
                onClick={() => handleIssuingBankRemoval(index)}
                className="m-1 bg-red-500 center text-white rounded-full size-6 shadow-md z-10 cursor-pointer"
              >
                <X className="size-5 text-white" />
              </div>
            ) : null}
          </div>
          <div className="flex items-center gap-3 pt-2 px-2 pb-2">
            <DDInput
              placeholder="Select Bank"
              label="Bank"
              value={bank.bank}
              id={`issuingBanks[${index}].bank`}
              setValue={setValue}
              data={
                issuingBankOptions?.success && issuingBankOptions.response
                  ? issuingBankOptions.response
                  : []
              }
              disabled={isLoading || !issuingCountry}
            />
            <label
              id={`issuingBanks[${index}].swiftCode`}
              className="border p-1 px-3 rounded-md w-full flex items-center justify-between bg-white"
            >
              <p className="w-full text-sm text-lightGray">Swift Code</p>
              <Input
                register={register}
                name={`issuingBanks[${index}].swiftCode`}
                type="text"
                id={`issuingBanks[${index}].swiftCode`}
                className="block bg-none text-sm text-end border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-[180px]"
                placeholder="Type here"
              />
            </label>
            <label
              id={`issuingBanks[${index}].accountNumber`}
              className="border p-1 px-3 rounded-md w-full flex items-center justify-between bg-white"
            >
              <p className="w-full text-sm text-lightGray">Account Number</p>
              <Input
                value={bank.accountNumber}
                onChange={(e) =>
                  setValue(
                    `issuingBanks[${index}].accountNumber`,
                    e.target.value
                  )
                }
                register={register}
                name={`issuingBanks[${index}].accountNumber`}
                type="text"
                className="block bg-none text-sm text-end border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-[180px]"
                placeholder="Type here"
              />
            </label>
          </div>
        </div>
      ))}

      {issuingBanks?.length < 5 ? (
        <div
          onClick={handleIssuingBankAddition}
          className="flex-col cursor-pointer bg-white center gap-y-3 border-2 border-dotted border-borderCol py-3 rounded-md mt-4"
        >
          <div className=" center p-1 border border-black rounded-full">
            <Plus className="size-4" />
          </div>
          <p className="text-sm text-lightGray">Add Confirming Bank</p>
        </div>
      ) : null}
    </div>
  );
}
