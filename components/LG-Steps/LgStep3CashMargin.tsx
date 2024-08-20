"use client";
import React, { useState } from "react";
import { LgStepsProps3 } from "@/types/lg";
import { Plus, X } from "lucide-react";
import { DDInput } from "../LCSteps/helpers";
import { Input } from "../ui/input";

export default function LgStep3CashMargin({
  register,
  watch,
  setStepCompleted,
  data,
  flags,
  setValue,
}: LgStepsProps3) {
  const [confirmingBanks, setConfirmingBanks] = useState<any[]>([
    { value: "" },
  ]);
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
          Any Preferred banks to issue the LG (up to 5 Banks )
        </p>
      </div>

      <div className="py-3 px-2 rounded-md border border-borderCol bg-[#F5F7F9]">
        <p className="font-semibold mb-2">Country</p>
        <div className="relative flex items-center gap-x-3 w-full">
          <div className="flex items-center gap-x-2 w-full">
            <DDInput
              label="Issuing Bank Country"
              id="confirmingBank.country"
              placeholder="Select a Country"
              //               value={confirmingCountry}
              //               data={countries}
              setValue={setValue}
              flags={flags}
            />
          </div>
        </div>
      </div>

      {confirmingBanks?.map((e, i) => (
        <div
          key={i}
          className="border border-[#E2E2EA] bg-[#F5F7F9] rounded-lg mt-4 relative"
        >
          <p className="px-4 pt-2 font-semibold text-[#1A1A26] font-poppins">
            Issuing Bank
          </p>
          <div className="flex items-center gap-3 pt-2 px-2 pb-2">
            <DDInput
              placeholder="Select Bank"
              label="Bank"
              id="issuingBank.bank"
              setValue={() => null}
            />
            <label
              id={`issuingBank.swiftCode${i}`}
              className="border p-1 px-3 rounded-md w-full flex items-center justify-between bg-white"
            >
              <p className="w-full text-sm text-lightGray">Swift Code</p>
              <Input
                //                 value={e.value}
                //                 onChange={(e) =>
                //                   setValue(`issuingBank.swiftCode${i}`, e.target.value)
                //                 }
                //                 register={register}
                //                 name={`issuingBank.swiftCode${i}`}
                type="text"
                className="block bg-none text-sm text-end border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-[180px]"
                placeholder="Enter Code"
              />
            </label>
          </div>

          {i > 0 ? (
            <div
              onClick={() => {
                setConfirmingBanks((prev) =>
                  prev.filter((_, index) => index !== i)
                );
              }}
              className="absolute top-1 -right-2 bg-red-500 center text-white rounded-full size-6 shadow-md z-10 cursor-pointer"
            >
              <X className="size-5 text-white" />
            </div>
          ) : null}
        </div>
      ))}

      {confirmingBanks?.length < 6 ? (
        <div
          onClick={() => {
            setConfirmingBanks((prev) => [...prev, {}]);
          }}
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
