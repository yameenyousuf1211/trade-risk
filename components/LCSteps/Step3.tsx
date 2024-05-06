"use client";
import { DDInput } from "./helpers";
import { Plus } from "lucide-react";
import { Period, Transhipment } from "./Step3Helpers";

export const Step3 = () => {
  return (
    <div className="py-3 px-2 border border-borderCol rounded-lg w-full">
      <div className="flex items-center gap-x-2 ml-3 mb-3">
        <p className="size-6 rounded-full bg-primaryCol center text-white font-semibold">
          3
        </p>
        <p className="font-semibold text-lg text-lightGray">LC Details</p>
      </div>
      {/* Issuing Bank */}
      <div className="flex items-center justify-between w-full mb-3 gap-x-4">
        <div className="border border-borderCol rounded-md py-3 px-2 w-full">
          <p className="font-semibold mb-2 ml-3">Issuing Bank</p>
          <div className="flex flex-col gap-y-2">
            <DDInput
              placeholder="Select a country"
              label="Country"
              id="select-country-detail"
            />
            <DDInput
              placeholder="Select bank"
              label="Bank"
              id="select-bank-detail"
            />
          </div>
        </div>
        <div className="center flex-col gap-y-2 border-4 border-borderCol border-dotted rounded-md w-full h-full min-h-40">
          <div className="center border-2 border-black rounded-full">
            <Plus />
          </div>
          <p className="font-semibold">Add an Advising Bank</p>
        </div>
      </div>
      {/* Confirming Bank */}
      <div className="py-3 px-2 rounded-md border border-borderCol">
        <p className="font-semibold">Confirming Bank</p>
        <div className="flex items-center gap-x-3 w-full">
          <div className="flex items-center gap-x-2 w-full">
            <p className="font-semibold">1.</p>
            <DDInput
              label="Country"
              id="select-country-confirming"
              placeholder="Select a Country"
            />
          </div>
          <DDInput
            label="Bank"
            id="select-bank-confirming"
            placeholder="Select bank"
          />
        </div>

        <div className="center gap-x-3 border-2 border-dotted border-borderCol py-2 rounded-md mt-2">
          <div className="center p-1 border border-black rounded-full">
            <Plus className="size-4" />
          </div>
          <p className="text-sm text-lightGray">Add Confirming Bank</p>
        </div>
      </div>
      {/* Period */}
      <Period />
      {/* Transhipment */}
      <Transhipment />
    </div>
  );
};
