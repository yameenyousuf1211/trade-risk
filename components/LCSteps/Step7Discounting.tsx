import React, { useEffect, useState } from "react";
import { BgRadioInput, DDInput } from "./helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Step7Disounting = ({
  register,
  setValue,
  getValues,
  valueChanged,
  watch,
}: {
  register: any;
  setValue: any;
  getValues: any;
  valueChanged?: any;
  watch?: any;
}) => {
  const discountAtSight = watch("discountingInfo.discountAtSight");
  const behalfOf = watch("discountingInfo.behalfOf");
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
    "discount-yes": false,
    "discount-no": false,
  });

  const handleCheckDiscountChange = (id: string) => {
    setCheckedDiscountState((prevState) => ({
      ...prevState,
      "discount-yes": id === "discount-yes",
      "discount-no": id === "discount-no",
    }));
  };

  let pricePerAnnum = getValues("discountingInfo.pricePerAnnum");
  useEffect(() => {
    if (pricePerAnnum) {
      setValue("discountingInfo.pricePerAnnum", pricePerAnnum.toString());
    }
  }, [valueChanged]);

  const handleIncrement = () => {
    const currentValue = getValues("discountingInfo.pricePerAnnum") || "0";
    const newValue = (parseFloat(currentValue) + 0.5).toFixed(1);
    if (Number(newValue) > 100) {
      return;
    }
    setValue("discountingInfo.pricePerAnnum", `${newValue}%`);
  };

  const handleDecrement = () => {
    const currentValue = getValues("discountingInfo.pricePerAnnum") || "0";
    let newValue = parseFloat(currentValue) - 0.5;

    if (newValue < 0) newValue = 0;
    // @ts-ignore
    newValue = newValue.toFixed(1);
    setValue("discountingInfo.pricePerAnnum", `${newValue}%`);
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
          id="discount-yes"
          label="Yes"
          name="discountingInfo.discountAtSight"
          value="yes"
          register={register}
          checked={discountAtSight === "yes"}
        />
        <BgRadioInput
          id="discount-no"
          label="No"
          name="discountingInfo.discountAtSight"
          value="no"
          register={register}
          checked={discountAtSight === "no"}
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
          checked={behalfOf === "Exporter"}
        />
        <BgRadioInput
          id="disc-account-importer"
          label="Importer (Applicant)"
          name="discountingInfo.behalfOf"
          value="Importer"
          register={register}
          checked={behalfOf === "Importer"}
        />
      </div>

      <div className="border border-borderCol py-3 px-2 rounded-md mt-5 bg-[#F5F7F9]">
        <p className="font-semibold ml-3 mb-2">Expected charges</p>

        <label
          id="expected-pricing"
          className="border bg-white border-borderCol p-1 px-3 rounded-md w-full flex items-center justify-between"
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
            {/* <Input
              placeholder="Value (%)"
              type="string"
              name="discountingInfo.pricePerAnnum"
              register={register}
              className="border-none outline-none focus-visible:ring-0 max-w-[100px] focus-visible:ring-offset-0"
            /> */}
            <input
              placeholder="Value (%)"
              type="text"
              inputMode="numeric"
              className="border-none text-[13px] outline-none focus-visible:ring-0 max-w-[100px] focus-visible:ring-offset-0"
              max={100}
              {...register("discountingInfo.pricePerAnnum")}
              onChange={(event) => {
                const newValue = event.target.value.replace(/[^0-9.]/g, "");
                event.target.value = newValue;
              }}
              onBlur={(event) => {
                console.log(event.target.value.length);
                if (
                  event.target.value.includes("%") ||
                  event.target.value.length === 0
                ) {
                  return;
                }
                event.target.value += "%";
              }}
              onKeyUp={(event) => {
                if (Number(event.target.value.replace("%", "")) > 100) {
                  event.target.value = "100.0%";
                }
              }}
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
