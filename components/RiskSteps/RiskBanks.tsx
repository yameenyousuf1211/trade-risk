"use client";
import { useState } from "react";
import { TagsInput } from "react-tag-input-component";

export const RiskBanks = ({ setValue }: { setValue: any }) => {
  const [banks, setBanks] = useState([]);
  const [BankInput, setBankInput] = useState("");

  return (
    <div className="bg-white rounded-lg border border-borderCol py-4 px-4">
      <p className="text-lightGray font-semibold">
        Select banks you want to send your risk participation request
      </p>
      <div className="mt-3">
        <TagsInput
          value={banks}
          onChange={(val: any) => {
            setBanks(val);
            // setValue("product", val.join(", "));
            setBankInput("");
          }}
          onKeyUp={(e) => {
            if (e.key.length === 1) {
              setBankInput((prev) => prev + e.key);
            }
          }}
          onBlur={(e: any) => {
            if (BankInput.length > 1) {
              setBanks((prev: any) => [...prev, BankInput]);
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
