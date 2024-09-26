import React, { useEffect, useState } from "react";
import { DDInput } from "../LCSteps/helpers";
import { LgStepsProps2 } from "@/types/lg";
import { useQuery } from "@tanstack/react-query";
import { getCities } from "@/services/apis/helpers.api";
import { CountrySelect } from "../helpers";

interface LgStep9Part2Props extends LgStepsProps2 {
  type: "issue" | "collect"; // Add a type prop
}

const LgStep9Part2: React.FC<LgStep9Part2Props> = ({
  register,
  watch,
  setStepCompleted,
  data,
  flags,
  setValue,
  step,
  type, // Accept type prop
}) => {
  // Use the type prop to watch different form fields
  const lgDetails = watch(type === "issue" ? "lgIssueIn" : "lgCollectIn");
  const [isoCode, setIsoCode] = useState<string | null>(
    lgDetails?.isoCode || ""
  );

  useEffect(() => {
    setValue(
      type === "issue" ? "lgIssueIn.isoCode" : "lgCollectIn.isoCode",
      isoCode
    );
  }, [isoCode]);

  const { data: cities, isLoading } = useQuery({
    queryKey: ["cities", isoCode],
    queryFn: () => getCities(isoCode!),
    enabled: !!isoCode, // Fetch cities only when isoCode is set
  });

  return (
    <div
      id={`lg-step9-${type}`}
      className="py-3 px-2 border border-borderCol rounded-lg w-full scroll-target"
    >
      <div className="flex items-center gap-x-2 ml-3 mb-3">
        <p className="text-sm size-6 rounded-full bg-primaryCol center text-white font-semibold">
          {step}
        </p>
        <p className="font-semibold text-[16px] text-lightGray">
          {type === "issue"
            ? "Where you want to issue your LG in?"
            : "Where you want to collect your LG in?"}
        </p>
      </div>

      <div className="w-full">
        <div className="flex items-center gap-3 mb-2">
          <CountrySelect
            setIsoCode={setIsoCode}
            setValue={setValue}
            extraClassName="h-[3.5em]"
            name={
              type === "issue" ? "lgIssueIn.country" : "lgCollectIn.country"
            } // Adjust name based on type
            placeholder={lgDetails?.country || "Select Country"}
          />
          <DDInput
            placeholder="Select City"
            label="City"
            id={type === "issue" ? "lgIssueIn.city" : "lgCollectIn.city"} // Adjust id based on type
            value={lgDetails?.city}
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
  );
};

export default LgStep9Part2;
