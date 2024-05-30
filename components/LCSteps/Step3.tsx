"use client";
import { DDInput } from "./helpers";
import { Plus, X } from "lucide-react";
import { Period, Transhipment } from "./Step3Helpers";
import { useQuery } from "@tanstack/react-query";
import { getBanks } from "@/services/apis/helpers.api";
import { useEffect, useState } from "react";
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

export const Step3 = ({
  register,
  setValue,
  countries,
  flags,
  setStepCompleted,
  isDiscount,
  watch,
}: {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  countries: string[];
  flags: string[];
  setStepCompleted: (index: number, status: boolean) => void;
  isDiscount?: boolean;
  watch: UseFormWatch<any>;
}) => {
  const [showAdvisingBank, setShowAdvisingBank] = useState(false);
  const [showConfirmingBank, setShowConfirmingBank] = useState(false);
  const [showConfirmingBank2, setShowConfirmingBank2] = useState(false);

  let issuingCountry = watch("issuingBank.country");
  let issuingBank = watch("issuingBank.bank");
  let advisingCountry = watch("advisingBank.country");
  let advisingBank = watch("advisingBank.bank");
  let confirmingCountry = watch("confirmingBank.country");
  let confirmingBank = watch("confirmingBank.bank");
  let confirming2Country = watch("confirmingBank2.country");
  let confirming2Bank = watch("confirmingBank2.bank");
  let expectedDate = watch("lcPeriod.expectedDate");
  let startDate = watch("lcPeriod.startDate");
  let endDate = watch("lcPeriod.endDate");
  let productDescription = watch("productDescription");

  useEffect(() => {
    if (
      issuingCountry &&
      issuingBank &&
      confirmingBank &&
      confirmingCountry &&
      startDate &&
      endDate &&
      expectedDate &&
      productDescription
    ) {
      setStepCompleted(2, true);
    }
    if (confirmingCountry) setShowConfirmingBank(true);
    if (advisingCountry) {
      setShowAdvisingBank(true);
    }
  }, [
    issuingCountry,
    confirmingCountry,
    startDate,
    endDate,
    productDescription,
    expectedDate,
  ]);

  const { data: issuingBanks } = useQuery({
    queryKey: ["issuing-banks", issuingCountry],
    queryFn: () => getBanks(issuingCountry),
    enabled: !!issuingCountry,
  });

  const { data: confirmingBanks } = useQuery({
    queryKey: ["confirming-banks", confirmingCountry],
    queryFn: () => getBanks(confirmingCountry),
    enabled: !!confirmingCountry,
  });

  const { data: advisingBanks } = useQuery({
    queryKey: ["advising-banks", advisingCountry],
    queryFn: () => getBanks(advisingCountry),
    enabled: !!advisingCountry,
  });

  return (
    <div
      id="step3"
      className="py-3 px-2 border border-borderCol rounded-lg w-full"
    >
      <div className="flex items-center gap-x-2 ml-3 mb-3">
        <p className="text-sm size-6 rounded-full bg-primaryCol center text-white font-semibold">
          3
        </p>
        <p className="font-semibold text-[16px] text-lightGray">LC Details</p>
      </div>
      {/* Issuing Bank */}
      <div className="flex items-center justify-between w-full mb-3 gap-x-4">
        <div className="border border-borderCol rounded-md py-3 px-2 w-full bg-[#F5F7F9]">
          <p className="font-semibold mb-2 ml-3">Issuing Bank</p>
          <div className="flex flex-col gap-y-2">
            <DDInput
              placeholder="Select a country"
              label="Country"
              value={issuingCountry}
              id="issuingBank.country"
              data={countries}
              setValue={setValue}
              flags={flags}
            />
            <DDInput
              placeholder="Select bank"
              label="Bank"
              value={issuingBank}
              id="issuingBank.bank"
              setValue={setValue}
              disabled={
                !issuingBanks ||
                !issuingBanks?.success ||
                !issuingBanks?.response ||
                !issuingBanks.success
              }
              data={
                issuingBanks && issuingBanks.success && issuingBanks.response
              }
            />
          </div>
        </div>
        {showAdvisingBank ? (
          <div className="border border-borderCol rounded-md py-3 px-2 w-full bg-[#F5F7F9]">
            <div className="flex items-start justify-between">
              <p className="font-semibold mb-2 ml-3">Advising Bank</p>
              <p
                className="bg-red-500 center text-white rounded-full size-6 shadow-md z-10 cursor-pointer mb-1"
                onClick={() => setShowAdvisingBank(false)}
              >
                <X className="size-5 text-white" />
              </p>
            </div>
            <div className="flex flex-col gap-y-2">
              <DDInput
                placeholder="Select a country"
                label="Country"
                value={advisingCountry}
                id="advisingBank.country"
                data={countries}
                setValue={setValue}
                flags={flags}
              />
              <DDInput
                placeholder="Select bank"
                label="Bank"
                value={advisingBank}
                id="advisingBank.bank"
                setValue={setValue}
                disabled={
                  !advisingBanks ||
                  !advisingBanks?.success ||
                  !advisingBanks?.response ||
                  !advisingBanks.success
                }
                data={
                  advisingBanks &&
                  advisingBanks.success &&
                  advisingBanks.response
                }
              />
            </div>
          </div>
        ) : (
          <div
            onClick={() => setShowAdvisingBank((prev: boolean) => !prev)}
            className="cursor-pointer center flex-col gap-y-2 border-4 border-borderCol border-dotted rounded-md w-full h-full min-h-40"
          >
            <div className="center border-2 border-black rounded-full">
              <Plus />
            </div>
            <p className="font-semibold">Add an Advising Bank</p>
          </div>
        )}
      </div>
      {/* Confirming Bank */}

      <div className="py-3 px-2 rounded-md border border-borderCol bg-[#F5F7F9]">
        <p className="font-semibold mb-2">Confirming Bank</p>
        {showConfirmingBank && (
          <div className="relative flex items-center gap-x-3 w-full">
            <div className="flex items-center gap-x-2 w-full">
              <p className="font-semibold">1.</p>
              <DDInput
                label="Country"
                id="confirmingBank.country"
                placeholder="Select a Country"
                value={confirmingCountry}
                data={countries}
                setValue={setValue}
                flags={flags}
              />
            </div>
            <DDInput
              label="Bank"
              id="confirmingBank.bank"
              placeholder="Select bank"
              value={confirmingBank}
              setValue={setValue}
              disabled={
                !confirmingBanks ||
                !confirmingBanks?.response ||
                !confirmingBanks.success
              }
              data={
                confirmingBanks &&
                confirmingBanks.success &&
                confirmingBanks.response
              }
            />
            <div
              className="absolute top-3 -right-2 bg-red-500 center text-white rounded-full size-6 shadow-md z-10 cursor-pointer"
              onClick={() => setShowConfirmingBank(false)}
            >
              <X className="size-5 text-white" />
            </div>
          </div>
        )}

        {showConfirmingBank2 ? (
          <div className="relative flex items-center gap-x-3 w-full mt-3">
            <div className="flex items-center gap-x-2 w-full">
              <p className="font-semibold">2.</p>
              <DDInput
                label="Country"
                id="confirmingBank2.country"
                placeholder="Select a Country"
                value={confirming2Bank}
                data={countries}
                setValue={setValue}
                flags={flags}
              />
            </div>
            <DDInput
              label="Bank"
              id="confirmingBank2.bank"
              placeholder="Select bank"
              value={confirming2Bank}
              setValue={setValue}
              disabled={
                !confirmingBanks ||
                !confirmingBanks.success ||
                !confirmingBanks?.response ||
                !confirmingBanks.success
              }
              data={
                confirmingBanks &&
                confirmingBanks.success &&
                confirmingBanks.response
              }
            />
            <div
              className="absolute top-3 -right-2 bg-red-500 center text-white rounded-full size-6 shadow-md z-10 cursor-pointer"
              onClick={() => setShowConfirmingBank2(false)}
            >
              <X className="size-5 text-white" />
            </div>
          </div>
        ) : (
          <div
            onClick={() =>
              showConfirmingBank
                ? setShowConfirmingBank2(true)
                : setShowConfirmingBank(true)
            }
            className="cursor-pointer bg-white ml-4 center gap-x-3 border-2 border-dotted border-borderCol py-3 rounded-md mt-2"
          >
            <div className=" center p-1 border border-black rounded-full">
              <Plus className="size-4" />
            </div>
            <p className="text-sm text-lightGray">Add Confirming Bank</p>
          </div>
        )}
      </div>
      <Period setValue={setValue} watch={watch} flags={flags} />
      <Transhipment
        watch={watch}
        register={register}
        setValue={setValue}
        isDiscount={isDiscount}
      />
    </div>
  );
};
