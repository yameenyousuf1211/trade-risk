"use client";
import { useEffect, useState } from "react";
import { TagsInput } from "react-tag-input-component";
import { DDInput } from "../LCSteps/helpers";
import { Input } from "../ui/input";

export const RiskBanks = ({
  setValue,
  watch,
  countries,
  flags,
  register,
}: {
  setValue: any;
  watch: any;
  countries: any[];
  flags: any;
  register: any;
}) => {
  const [banksData, setBanksData] = useState<string[]>([]);
  const [BankInput, setBankInput] = useState("");
  const { banks, country, swiftCode } = watch();

  useEffect(() => {
    if (banks?.length > 0 && banksData?.length === 0) {
      setBanksData(banks);
    }
  }, [banks]);
  useEffect(() => {
    setValue("banks", banksData);
  }, [banksData]);

  return (
    <div className="bg-white rounded-lg border border-borderCol py-4 px-4">
      <p className="text-lightGray font-semibold">
        Select banks you want to send your risk participation request
      </p>
      <div className="mt-3">
        <div className="flex gap-x-2">
            <TagsInput
              value={banksData}
              onChange={(val: any) => {
                setBanksData(val);
                // setValue("banks", banksData);
                setBankInput("");
              }}
              onKeyUp={(e) => {
                if (e.key.length === 1) {
                  setBankInput((prev) => prev + e.key);
                  // setValue("banks", banksData);
                }
              }}
              onBlur={(e: any) => {
                if (BankInput.length > 1) {
                  setBanksData((prev) => [...prev, BankInput]);
                  // setValue("banks", banksData);
                  e.target.value = "";
                }
                setBankInput("");
              }}
              name="banks"
              placeHolder="Select Bank(s)"
            />
          <DDInput
            extStyle="flex-1"
            placeholder="Select a country"
            label="Country"
            id="country"
            value={country}
            data={countries}
            flags={flags}
            setValue={setValue}
          />

          <label
            id="name"
            className="border border-borderCol p-1 px-3 rounded-md w-full flex items-center justify-between flex-1"
          >
            <p className="w-full text-lightGray text-sm">Swift Code</p>
            <Input
              type="text"
              inputMode="text"
              name="swiftCode"
              register={register}
              value={swiftCode}
              className="text-sm block bg-none text-end border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-[180px]"
              placeholder="Enter code"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
