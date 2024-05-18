import React, { useEffect, useState } from "react";
import { BgRadioInput, DDInput } from "./helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Step6 = ({
  title,
  isDiscount,
  register,
  setValue,
  getValues,
  isConfirmation,
  valueChanged,
  getStateValues,
}: {
  title: string;
  isDiscount?: boolean;
  register: any;
  setValue: any;
  getValues: any;
  isConfirmation?: boolean;
  valueChanged?: boolean;
  getStateValues?: any;
}) => {
  const [checkedState, setCheckedState] = useState({
    "account-beneficiary": false,
    "account-importer": false,
  });

  const handleCheckChange = (id: string) => {
    setCheckedState((prevState) => ({
      ...prevState,
      "account-beneficiary": id === "account-beneficiary",
      "account-importer": id === "account-importer",
    }));
  };

  const [checkedDiscountState, setCheckedDiscountState] = useState({
    "discount-yes": false,
    "discount-no": false,
  });
  let pricePerAnnum = isDiscount
    ? getValues("discountingInfo.pricePerAnnum")
    : getValues("confirmationInfo.pricePerAnnum");
  useEffect(() => {
    if (pricePerAnnum) {
      isDiscount
        ? setValue("discountingInfo.pricePerAnnum", pricePerAnnum.toString())
        : setValue("confirmationInfo.pricePerAnnum", pricePerAnnum.toString());
    }
  }, [valueChanged]);
  console.log(checkedDiscountState["discount-yes"])
  console.log(checkedDiscountState["discount-no"])


  const handleCheckDiscountChange = (id: string) => {
    console.log(id,)
    setCheckedDiscountState((prevState) => ({
      ...prevState,
      "discount-yes": id === "discount-yes",
      "discount-no": id === "discount-no",
    }));
  };

  const handleIncrement = () => {
    const currentValue = isDiscount
      ? getValues("discountingInfo.pricePerAnnum") || "0"
      : getValues("confirmationInfo.pricePerAnnum") || "0";
    const newValue = (parseFloat(currentValue) + 0.5).toFixed(1);
    isDiscount
      ? setValue("discountingInfo.pricePerAnnum", newValue)
      : setValue("confirmationInfo.pricePerAnnum", newValue);
  };

  const handleDecrement = () => {
    const currentValue = isDiscount
      ? getValues("discountingInfo.pricePerAnnum") || "0"
      : getValues("confirmationInfo.pricePerAnnum") || "0";
    let newValue = parseFloat(currentValue) - 0.5;

    if (newValue < 0) newValue = 0;
    // @ts-ignore
    newValue = newValue.toFixed(1);
    isDiscount
      ? setValue("discountingInfo.pricePerAnnum", newValue)
      : setValue("confirmationInfo.pricePerAnnum", newValue);
  };

  return (
    <div className="py-3 px-2 border border-borderCol rounded-lg w-full h-full">
      <div className="flex items-center gap-x-2 ml-3 mb-3">
        <p className="size-6 rounded-full bg-primaryCol center text-white font-semibold">
          6
        </p>
        <p className="font-semibold text-lg text-lightGray">{title}</p>
      </div>
      {isDiscount && (
        <div className="border border-borderCol py-3 px-2 rounded-md mb-4 bg-[#F5F7F9]">
          <p className="font-semibold ml-3 mb-2">Discount at sight</p>
          <BgRadioInput
            id="discount-yes"
            label="Yes"
            name={
              isDiscount ? "discountingInfo.discountAtSight" : "discountAtSight"
            }
            value="yes"
            register={register}
            checked={checkedDiscountState["discount-yes"]}
            handleCheckChange={handleCheckDiscountChange}
          />
          <BgRadioInput
            id="discount-no"
            label="No"
            name={
              isDiscount ? "discountingInfo.discountAtSight" : "discountAtSight"
            }
            value="no"
            register={register}
            checked={checkedDiscountState["discount-no"]}
            handleCheckChange={handleCheckDiscountChange}
          />
        </div>
      )}
      <div className="border border-borderCol py-3 px-2 rounded-md bg-[#F5F7F9]">
        <p className="font-semibold ml-3 mb-2">Charges on account of</p>
        <BgRadioInput
          id="account-beneficiary"
          label="Exporter/Supplier (Beneficiary)"
          name={
            isDiscount
              ? "discountingInfo.behalfOf"
              : "confirmationInfo.behalfOf"
          }
          value="Exporter"
          register={register}
          checked={checkedState["account-beneficiary"]}
          handleCheckChange={handleCheckChange}
        />
        <BgRadioInput
          id="account-importer"
          label="Importer (Applicant)"
          name={
            isDiscount
              ? "discountingInfo.behalfOf"
              : "confirmationInfo.behalfOf"
          }
          value="Importer"
          register={register}
          checked={checkedState["account-importer"]}
          handleCheckChange={handleCheckChange}
        />
      </div>

      <div className="border border-borderCol py-3 px-2 rounded-md mt-5 bg-[#F5F7F9]">
        <p className="font-semibold ml-3 mb-2">{title == "Confirmation Charges" ? "Expected pricing" : "Expected charges"}</p>
        {isDiscount && (
          <div className="mb-3 bg-white">
            <label
              id="select-base-rate"
              className="border border-borderCol p-1 px-3 rounded-md w-full flex items-center justify-between"
            >
              <p className="w-full text-lightGray">Select base rate</p>
              <Input
                id="select-base-rate"
                type="text"
                name="select-base-rate"
                register={register}
                className="block bg-none border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-[180px]"
                placeholder="Select Value"
              />
            </label>
          </div>
        )}
        <label
          id="expected-pricing"
          className="border bg-white border-borderCol p-1 px-3 rounded-md w-full flex items-center justify-between"
        >
          <p className="text-lightGray">Pricing Per Annum</p>
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
              type="number"
              inputMode="numeric"
              required
              max={100}
              name={
                isDiscount
                  ? "discountingInfo.pricePerAnnum"
                  : "confirmationInfo.pricePerAnnum"
              }
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
