import React, { useEffect, useState } from "react";
import { DDInput } from "../LCSteps/helpers";
import { LgStepsProps2 } from "@/types/lg";
import { Input } from "../ui/input";
import { PhoneInput } from "../ui/phone-input";
import useStepStore from "@/store/lcsteps.store";
import { BENEFICIARY } from "@/utils/constant/lg";
import { mapCountryToIsoCode } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { getCities } from "@/services/apis/helpers.api";
import { useStateHistory } from "../ui/use-state-history";

const LgStep4: React.FC<LgStepsProps2> = ({
  register,
  watch,
  setStepCompleted,
  data,
  flags,
  setValue,
  step,
}) => {
  const beneficiaryCountry = watch("beneficiaryDetails.country");
  const beneficiaryName = watch("beneficiaryDetails.name");
  const beneficiaryAddress = watch("beneficiaryDetails.address");
  const beneficiaryCity = watch("beneficiaryDetails.city");

  const beneficiaryPhoneNumber = watch("beneficiaryDetails.phoneNumber");
  console.log(beneficiaryPhoneNumber, "beneficiaryPhoneNumber");
  const { addStep, removeStep } = useStepStore();

  useEffect(() => {
    if (beneficiaryCountry && beneficiaryName) {
      addStep(BENEFICIARY);
    } else removeStep(BENEFICIARY);
  }, [beneficiaryCountry, beneficiaryName]);
  const [isoCode, setIsoCode] = useState<string | null>("");

  const { data: cities, isLoading } = useQuery({
    queryKey: ["cities", isoCode],
    queryFn: () => getCities(isoCode!),
    enabled: !!isoCode,
  });

  const handlePhoneNumberChange = (value: string) => {
    const sanitizedValue = value.replace(/\s+/g, ""); // Remove spaces, keep the plus sign
    console.log("Sanitized Value:", sanitizedValue);
    setValue("beneficiaryDetails.phoneNumber", sanitizedValue);
  };

  return (
    <div
      id="lg-step4"
      className="py-3 px-2 border border-borderCol rounded-lg w-full scroll-target"
    >
      <div className="flex items-center gap-x-2 ml-3 mb-3">
        <p className="text-sm size-6 rounded-full bg-primaryCol center text-white font-semibold">
          {step || 4}
        </p>
        <p className="font-semibold text-[16px] text-lightGray">
          Beneficiary Details
        </p>
      </div>
      <div className="border border-[#E2E2EA] bg-[#F5F7F9] p-2 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <label
            id="beneficiaryDetails.address"
            className="border p-1 px-3 rounded-md w-full flex items-center justify-between bg-white"
          >
            <p className="w-full text-sm text-lightGray">Beneficiary Name</p>
            <Input
              onChange={(e) =>
                setValue("beneficiaryDetails.name", e?.target?.value)
              }
              register={register}
              name="beneficiaryDetails.name"
              type="text"
              className="block bg-none text-sm text-end border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-[180px]"
              placeholder="Enter Text"
            />
          </label>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <DDInput
            placeholder="Select Country"
            label="Beneficiary Country"
            id="beneficiaryDetails.country"
            value={beneficiaryCountry}
            data={data}
            onSelectValue={(value) => {
              setIsoCode(mapCountryToIsoCode(value.toLowerCase()));
            }}
            setValue={setValue}
            flags={flags}
          />
          <DDInput
            placeholder="Select"
            label="Select City"
            id="beneficiaryDetails.city"
            value={beneficiaryCity}
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
        <div className="flex items-center gap-3">
          <label
            id="beneficiaryDetails.address"
            className="border p-1 flex-1 px-3 rounded-md w-full flex items-center justify-between bg-white"
          >
            <p className="w-full text-sm text-lightGray">Street Address</p>
            <Input
              register={register}
              name="beneficiaryDetails.address"
              type="text"
              onChange={(e) =>
                setValue("beneficiaryDetails.address", e?.target?.value)
              }
              className="block bg-none text-sm text-end border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-[180px]"
              placeholder="Enter Text"
            />
          </label>
          <label
            id="beneficiaryDetails.address"
            className="border flex-1 p-1 px-3 rounded-md  flex items-center justify-between bg-white"
          >
            <p className=" text-sm w-32 text-lightGray">Phone Number</p>
            <PhoneInput
              value={beneficiaryPhoneNumber}
              name="beneficiaryDetails.phoneNumber"
              onChange={handlePhoneNumberChange}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default LgStep4;
