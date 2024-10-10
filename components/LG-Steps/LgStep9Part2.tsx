import React, { useEffect, useState } from "react";
import { DDInput } from "../LCSteps/helpers";
import { LgStepsProps2 } from "@/types/lg";
import { useQuery } from "@tanstack/react-query";
import { getCities } from "@/services/apis/helpers.api";
import { CountrySelect } from "../helpers";
import { CheckBoxInput } from "@/app/register/bank/page";

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
  const lgDetails = watch(type === "issue" ? "lgIssueIn" : "lgCollectIn");
  const isSameAsIssue = watch("isSameAsIssuance");

  const lgIssueInDetails = watch("lgIssueIn");
  const [isoCode, setIsoCode] = useState<string | null>(
    lgDetails?.isoCode || ""
  );

  // Whenever the isoCode changes, update the form values
  useEffect(() => {
    setValue(
      type === "issue" ? "lgIssueIn.isoCode" : "lgCollectIn.isoCode",
      isoCode
    );
  }, [isoCode]);

  // Whenever the checkbox changes, update the form values
  useEffect(() => {
    if (isSameAsIssue) {
      setValue("lgCollectIn", lgIssueInDetails);
    }
  }, [
    isSameAsIssue,
    setValue,
    lgIssueInDetails?.country,
    lgIssueInDetails?.city,
  ]);

  const {
    data: cities,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["cities", isoCode],
    queryFn: () => getCities(isoCode!),
    enabled: !!isoCode, // Fetch cities only when isoCode is set
  });

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("isSameAsIssuance", e.target.checked);
    if (e.target.checked) {
      setValue("lgCollectIn", lgIssueInDetails);
      setIsoCode(lgIssueInDetails?.isoCode);
    } else {
      refetch();
    }
  };

  return (
    <div
      id={`lg-step9-${type}`}
      className="py-3 px-2 border border-borderCol rounded-lg w-full scroll-target"
    >
      <div className="flex items-center ml-3 mb-3 justify-between">
        <div className="flex items-center gap-x-2">
          <p className="text-sm size-6 rounded-full bg-primaryCol center text-white font-semibold">
            {step}
          </p>
          <p className="font-semibold text-[16px] text-lightGray">
            {type === "issue"
              ? "Where you want to issue your LG in?"
              : "Where you want to collect your LG in?"}
          </p>
        </div>
        {type !== "issue" && (
          <CheckBoxInput
            checked={isSameAsIssue}
            label="Same as LG physical issue"
            register={register}
            id="isSameAsIssuance" // ID for the checkbox
            onChange={handleCheckboxChange} // Call the handler
          />
        )}
      </div>

      <div className="w-full">
        <div className="flex items-center gap-3 mb-2">
          <CountrySelect
            setIsoCode={setIsoCode}
            setValue={setValue}
            isNewView={true}
            value={lgDetails?.country}
            extraClassName="h-[3.5em]"
            name={
              type === "issue" ? "lgIssueIn.country" : "lgCollectIn.country"
            } // Adjust name based on type
            placeholder={lgDetails?.country || "Select Country"}
            disabled={type !== "issue" && isSameAsIssue} // Disable when checkbox is checked
            onChange={() => {
              setValue(
                type === "issue" ? "lgIssueIn.city" : "lgCollectIn.city",
                ""
              );
            }}
          />
          <DDInput
            placeholder="Select City"
            label="City"
            id={type === "issue" ? "lgIssueIn.city" : "lgCollectIn.city"} // Adjust id based on type
            value={lgDetails?.city}
            setValue={setValue}
            disabled={
              (type !== "issue" && isSameAsIssue) || isLoading || !isoCode
            } // Disable when checkbox is checked or no isoCode
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
