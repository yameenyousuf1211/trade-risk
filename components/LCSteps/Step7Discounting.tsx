import React, { useState } from "react";
import { BgRadioInput, DDInput } from "./helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Step7Disounting = ({
  register,
  setValue,
  getValues,
}: {
  register: any;
  setValue: any;
  getValues: any;
}) => {
  const [checkedState, setCheckedState] = useState({
    "account-beneficiary": false,
    "account-importer": false,
  });

  const handleCheckChange = (id: string) => {
    setCheckedState((prevState) => ({
      ...prevState,
      "account-beneficiary": id === "disc-account-beneficiary",
      "account-importer": id === "disc-account-importer",
    }));
  };

  const [checkedDiscountState, setCheckedDiscountState] = useState({
    "disc-discount-yes": false,
    "disc-discount-no": false,
  });

  const handleCheckDiscountChange = (id: string) => {
    setCheckedState((prevState) => ({
      ...prevState,
      "disc-discount-yes": id === "disc-discount-yes",
      "disc-discount-no": id === "disc-discount-no",
    }));
  };

  const handleIncrement = () => {
    const currentValue = getValues("discountingInfo.pricePerAnnum") || "0";
    const newValue = (parseFloat(currentValue) + 0.5).toFixed(1);
    setValue("discountingInfo.pricePerAnnum", newValue);
  };

  const handleDecrement = () => {
    const currentValue = getValues("discountingInfo.pricePerAnnum") || "0";
    let newValue = parseFloat(currentValue) - 0.5;

    if (newValue < 0) newValue = 0;
    // @ts-ignore
    newValue = newValue.toFixed(1);
    setValue("discountingInfo.pricePerAnnum", newValue);
  };

  return (
    <div className="py-3 px-2 border border-borderCol rounded-lg w-full h-full">
      <div className="flex items-center gap-x-2 ml-3 mb-3">
        <p className="size-6 rounded-full bg-primaryCol center text-white font-semibold">
          7
        </p>
        <p className="font-semibold text-lg text-lightGray">Discounting Info</p>
      </div>

      <div className="border border-borderCol py-3 px-2 rounded-md mb-4 bg-[#F5F7F9]">
        <p className="font-semibold ml-3 mb-2">Discount at sight</p>
        <BgRadioInput
          id="disc-discount-yes"
          label="Yes"
          name="discountingInfo.discountAtSight"
          value="yes"
          register={register}
          checked={checkedDiscountState["disc-discount-yes"]}
          handleCheckChange={handleCheckDiscountChange}
        />
        <BgRadioInput
          id="disc-discount-no"
          label="No"
          name="discountingInfo.discountAtSight"
          value="no"
          register={register}
          checked={checkedDiscountState["disc-discount-no"]}
          handleCheckChange={handleCheckDiscountChange}
        />
      </div>

      <div className="border border-borderCol py-3 px-2 rounded-md bg-[#F5F7F9]">
        <p className="font-semibold ml-3 mb-2">Charges on account of</p>
        <BgRadioInput
          id="disc-account-beneficiary"
          label="Exporter/Supplier (Beneficiary)"
          name="discountingInfo.behalfOf"
          value="Exporter"
          register={register}
          checked={checkedState["account-beneficiary"]}
          handleCheckChange={handleCheckChange}
        />
        <BgRadioInput
          id="disc-account-importer"
          label="Importer (Applicant)"
          name="discountingInfo.behalfOf"
          value="Importer"
          register={register}
          checked={checkedState["account-importer"]}
          handleCheckChange={handleCheckChange}
        />
      </div>

      <div className="border border-borderCol py-3 px-2 rounded-md mt-5 bg-[#F5F7F9]">
        <p className="font-semibold ml-3 mb-2">Expected charges</p>

        <label
          id="expected-pricing"
          className="border border-borderCol p-1 px-3 rounded-md w-full flex items-center justify-between"
        >
          <p className="text-lightGray">Per Annum(%)</p>
          <div className="flex items-center gap-x-2">
            <Button
              type="button"
              variant="ghost"
              className="bg-none border-none text-lg"
              onClick={handleDecrement}
            >
              -
            </Button>
            <Input
              placeholder="Value (%)"
              type="string"
              name="discountingInfo.pricePerAnnum"
              register={register}
              className="border-none outline-none focus-visible:ring-0 max-w-[100px] focus-visible:ring-offset-0"
            />
            <Button
              type="button"
              variant="ghost"
              className="bg-none border-none text-lg"
              onClick={handleIncrement}
            >
              +
            </Button>
          </div>
        </label>
      </div>
    </div>
  );
};
