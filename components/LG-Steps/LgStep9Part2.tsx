import { LgStepsProps2 } from "@/types/lg";
import { BgRadioInput, DDInput } from "../LCSteps/helpers";
import { useQuery } from "@tanstack/react-query";
import { getBanks, getCities } from "@/services/apis/helpers.api";
import { Input } from "../ui/input";
import { use, useEffect, useState } from "react";
import { mapCountryToIsoCode } from "@/utils";

const LgStep9Part2: React.FC<LgStepsProps2> = ({
  register,
  watch,
  setStepCompleted,
  data,
  flags,
  setValue,
  step,
}) => {
  const [isoCode, setIsoCode] = useState<string | null>("");

  const { data: cities, isLoading } = useQuery({
    queryKey: ["cities", isoCode],
    queryFn: () => getCities(isoCode!),
    enabled: !!isoCode,
  });

  return (
    <div
      id="lg-step10"
      className="py-3 px-2 border border-borderCol rounded-lg w-full scroll-target"
    >
      <div className="flex items-center gap-x-2 ml-3 mb-3">
        <p className="text-sm size-6 rounded-full bg-primaryCol center text-white font-semibold">
          {step}
        </p>
        <p className="font-semibold text-[16px] text-lightGray">
          Would you want to issue physical LG Instrument?
        </p>
      </div>
      <div className="w-full">
        <div className="flex items-center gap-2">
          <div className=" flex-1 py-3 px-2 rounded-md border border-borderCol bg-[#F5F7F9]">
            <DDInput
              placeholder="Select Country"
              label="Beneficiary Country"
              id="beneficiaryDetails.country"
              data={data}
              onSelectValue={(value) => {
                setIsoCode(mapCountryToIsoCode(value.toLowerCase()));
              }}
              setValue={setValue}
              flags={flags}
            />
          </div>
          <div className=" flex-1 py-3 px-2 rounded-md border border-borderCol bg-[#F5F7F9]">
            <DDInput
              placeholder="Select"
              label="Select City"
              id="beneficiaryDetails.city"
              setValue={setValue}
              disabled={isLoading || !isoCode}
              data={
                cities?.success
                  ? Array.from(
                      new Set(cities.response.map((city: any) => city.name))
                    )
                  : []
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LgStep9Part2;
