"use client";
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { BgRadioInput } from "../LCSteps/helpers";
import { Textarea } from "../ui/textarea";

interface Props {
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
}

export const IssuanceStep5 = ({ register, watch, setValue }: Props) => {
  const { lgType, productDescription } = watch();
  return (
    <div
      id="step5"
      className="pt-3 pb-1 px-2 border border-borderCol rounded-lg w-full"
    >
      <div className="flex items-center gap-x-2 ml-2 mb-3">
        <p className="text-sm size-6 rounded-full bg-primaryCol center text-white font-semibold">
          5
        </p>
        <p className="font-semibold text-[16px] text-lightGray">Type of LG</p>
      </div>
      <div className="flex items-center justify-between gap-x-2">
        <BgRadioInput
          id="type-bid"
          label="Bid"
          name="lgType"
          value="bid"
          register={register}
          checked={lgType === "bid"}
        />
        <BgRadioInput
          id="type-advance"
          label="Advance"
          name="lgType"
          value="advance"
          register={register}
          checked={lgType === "advance"}
        />
        <BgRadioInput
          id="type-payment"
          label="Payment"
          name="lgType"
          value="payment"
          register={register}
          checked={lgType === "payment"}
        />
        <BgRadioInput
          id="type-cg"
          label="CG"
          name="lgType"
          value="cg"
          register={register}
          checked={lgType === "cg"}
        />
        <BgRadioInput
          id="type-performance"
          label="Performance"
          name="lgType"
          value="performance"
          register={register}
          checked={lgType === "performance"}
        />
      </div>

      <div className="mt-2 border border-borderCol pt-3 pb-2 px-2 rounded-md w-full bg-[#F5F7F9]">
        <p className="text-sm font-semibold mb-2 ml-2">
          Purpose of the LG - Description in Brief:
        </p>
        <Textarea
          name="productDescription"
          rows={4}
          register={register}
          placeholder="Enter a brief description of the purpose of this LG"
          className="bg-white text-sm border border-borderCol resize-none w-full py-2 px-3 rounded-lg outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        ></Textarea>
      </div>
    </div>
  );
};
