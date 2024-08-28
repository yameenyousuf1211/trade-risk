import React from "react";
import { BgRadioInput } from "../LCSteps/helpers";
import { LgStepsProps10 } from "@/types/lg";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const LgStep10: React.FC<LgStepsProps10> = ({
  register,
  watch,
  setValue,
  step,
}) => {
  const expectedPrice = String(watch("expectedPrice.expectedPrice")) || "";
  const pricingPerAnnum = watch("expectedPrice.pricePerAnnum");

  const handleIncrement = () => {
    const currentValue = parseFloat(pricingPerAnnum) || 0;
    const newValue = Math.min(
      100,
      Math.round((currentValue + 0.1) * 100) / 100
    ).toFixed(2);
    setValue("expectedPrice.pricePerAnnum", newValue);
  };

  const handleDecrement = () => {
    const currentValue = parseFloat(pricingPerAnnum) || 0;
    const newValue = Math.max(
      0,
      Math.round((currentValue - 0.1) * 100) / 100
    ).toFixed(2);
    setValue("expectedPrice.pricePerAnnum", newValue);
  };

  return (
    <div
      id={`lg-step${step}`}
      className="py-3 px-2 border border-borderCol rounded-lg w-full scroll-target"
    >
      <div className="flex items-center gap-x-2 ml-3 mb-3">
        <p className="text-sm size-6 rounded-full bg-primaryCol center text-white font-semibold">
          {step || 10}
        </p>
        <p className="font-semibold text-[16px] text-lightGray">
          Do you have any expected price in mind?
        </p>
      </div>
      <div className="flex gap-3 items-center  rounded-lg">
        <BgRadioInput
          id="expectedPriceYes"
          label="Yes"
          name="expectedPrice.expectedPrice"
          value="true"
          register={register}
          checked={expectedPrice === "true"}
        />
        <BgRadioInput
          id="expectedPriceNo"
          label="No"
          name="expectedPrice.expectedPrice"
          value="false"
          register={register}
          checked={expectedPrice === "false"}
        />
      </div>
      {expectedPrice === "true" && (
        <div className="border border-borderCol py-3 px-2 rounded-md mt-5 bg-[#F5F7F9]">
          <p className="font-semibold ml-3 mb-2 text-sm">Expected charges</p>
          <label
            id="expected-pricing"
            className="border bg-white border-borderCol p-1 px-3 rounded-md w-full flex items-center justify-between"
          >
            <p className="text-lightGray text-sm">Pricing Per Annum</p>
            <div className="flex items-center gap-x-2 relative">
              <Button
                type="button"
                variant="ghost"
                className="bg-none border-none text-lg"
                onClick={handleDecrement}
              >
                -
              </Button>
              <input
                placeholder="Value (%)"
                type="text"
                inputMode="numeric"
                className={cn(
                  "flex h-10 text-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-none outline-none focus-visible:ring-0 max-w-[100px] focus-visible:ring-offset-0"
                )}
                max={100}
                {...register("expectedPrice.pricePerAnnum")}
                onChange={(event) => {
                  let newValue = event.target.value.replace(/[^0-9.]/g, "");
                  if (newValue.includes(".")) {
                    const parts = newValue.split(".");
                    parts[1] = parts[1].slice(0, 2);
                    newValue = parts.join(".");
                  }
                  const numValue = parseFloat(newValue);
                  if (numValue > 100) {
                    newValue = "100.00";
                  } else if (numValue < 0) {
                    newValue = "0.00";
                  }
                  event.target.value = newValue;
                  setValue("expectedPrice.pricePerAnnum", newValue || "0.00");
                }}
                onBlur={(event) => {
                  if (event.target.value.length === 0) return;
                  let value = parseFloat(event.target.value).toFixed(2);
                  if (parseFloat(value) > 100) {
                    value = "100.00";
                  } else if (parseFloat(value) < 0) {
                    value = "0.00";
                  }
                  event.target.value = value;
                  setValue("expectedPrice.pricePerAnnum", value || "0.00");
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
      )}
    </div>
  );
};

export default LgStep10;
