"use client";
import { useEffect, useState } from "react";
import { TagsInput } from "react-tag-input-component";

export const RiskBanks = ({
  setValue,
  watch,
}: {
  setValue: any;
  watch: any;
}) => {
  const [banksData, setBanksData] = useState<string[]>([]);
  const [BankInput, setBankInput] = useState("");
  const { banks } = watch();

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
      </div>
    </div>
  );
};
