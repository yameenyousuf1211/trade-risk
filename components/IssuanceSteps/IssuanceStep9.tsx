import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { BgRadioInput } from "../LCSteps/helpers";

interface Props {
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
}

export const IssuanceStep9 = ({ register, watch, setValue }: Props) => {
  const { priceType } = watch();
  return (
    <div
      id="step9"
      className="pt-3 pb-1 px-2 border border-borderCol rounded-lg w-full"
    >
      <div className="flex items-center gap-x-2 ml-2 mb-3">
        <p className="text-sm size-6 rounded-full bg-primaryCol center text-white font-semibold">
          9
        </p>
        <p className="font-semibold text-[16px] text-lightGray">
          Would you require to receive the lowest Price or all Price quotes?
        </p>
      </div>
      <div className="flex items-center justify-between gap-x-2">
        <BgRadioInput
          id="lowest-price"
          label="Lowest Price Quoted"
          name="priceType"
          value="lowestPrice"
          register={register}
          checked={priceType === "lowestPrice"}
        />
        <BgRadioInput
          id="all-prices"
          label="All Prices Quoted"
          name="priceType"
          value="allPrices"
          register={register}
          checked={priceType === "allPrices"}
        />
      </div>
    </div>
  );
};
