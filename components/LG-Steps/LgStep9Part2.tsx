import { LgStepsProps2 } from "@/types/lg";
import { BgRadioInput, DDInput } from "../LCSteps/helpers";
import { useQuery } from "@tanstack/react-query";
import { getBanks } from "@/services/apis/helpers.api";
import { Input } from "../ui/input";
import { use, useEffect } from "react";

const LgStep9Part2: React.FC<LgStepsProps2> = ({
  register,
  watch,
  setStepCompleted,
  data,
  flags,
  setValue,
}) => {
  const physicalLg = watch("physicalLg");
  const physicalLgCountry = watch("physicalLgCountry");
  const physicalLgBank = watch("physicalLgBank");
  const physicalLgSwiftCode = watch("physicalLgSwiftCode");

  const country = watch("beneficiaryDetails.country");

  const { data: issuingBanks } = useQuery({
    queryKey: ["issuing-banks", country],
    queryFn: () => getBanks(country),
    enabled: !!country,
  });

  return (
    <div
      id="lg-step10"
      className="py-3 px-2 border border-borderCol rounded-lg w-full scroll-target"
    >
      <div className="flex items-center gap-x-2 ml-3 mb-3">
        <p className="text-sm size-6 rounded-full bg-primaryCol center text-white font-semibold">
          10
        </p>
        <p className="font-semibold text-[16px] text-lightGray">
          Would you want to issue physical LG Instrument?
        </p>
      </div>
      <div className="flex gap-3 items-center rounded-lg">
        <BgRadioInput
          id="physicalLG1"
          label="Yes"
          name="physicalLg"
          value="true"
          register={register}
          checked={physicalLg === "true"}
        />
        <BgRadioInput
          id="physicalLG2"
          label="No"
          name="physicalLg"
          value="false"
          register={register}
          checked={physicalLg === "false"}
        />
      </div>
      <div className="w-full">
        {physicalLg === "true" ? (
          <DDInput
            placeholder="Select Country"
            label="Please select Country to issue LG in"
            id="physicalLgCountry"
            data={data}
            setValue={setValue}
            flags={flags}
          />
        ) : (
          <div className="flex items-center gap-2 border border-borderCol p-2 bg-[#F5F7F9] rounded-lg">
            <DDInput
              placeholder="Select Bank"
              label="Please select Country to issue LG in"
              id="physicalLgBank"
              data={
                issuingBanks && issuingBanks.success && issuingBanks.response
              }
              setValue={setValue}
            />
            <label
              id="issuingBank.swiftCode"
              className="border p-1 px-3 rounded-md w-full flex items-center justify-between bg-white"
            >
              <p className="w-full text-sm text-lightGray">Swift Code</p>
              <Input
                register={register}
                name="physicalLgSwiftCode"
                type="text"
                className="block bg-none text-sm text-end border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-[180px]"
                placeholder="Enter Code"
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default LgStep9Part2;
