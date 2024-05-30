"use client";
import {
  RiskBanks,
  RiskAgreement,
  RiskStep1,
  RiskStep4,
  RiskStep5,
  RiskStep6,
  RiskStep7,
  RiskStep8,
  RiskStep3,
  RiskStep2,
} from "@/components/RiskSteps";
import CreateLCLayout from "@/components/layouts/CreateLCLayout";
import { Button } from "@/components/ui/button";
import useLoading from "@/hooks/useLoading";
import { getCountries } from "@/services/apis/helpers.api";
import { Country } from "@/types/type";
import { bankCountries } from "@/utils/data";
import { generalRiskSchema } from "@/validation/risk.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const RiskFundedPage = () => {
  const { register, setValue, reset, watch, getValues, handleSubmit } = useForm<
    z.infer<typeof generalRiskSchema>
  >({});
  const { startLoading, stopLoading, isLoading } = useLoading();

  const [allCountries, setAllCountries] = useState<Country[]>([]);
  const [countries, setCountries] = useState([]);
  const [flags, setFlags] = useState([]);

  const { data: countriesData } = useQuery({
    queryKey: ["countries"],
    queryFn: () => getCountries(),
  });
  const countryNames = bankCountries.map((country) => country.name);
  const countryFlags = bankCountries.map((country) => country.flag);

  useEffect(() => {
    if (
      countriesData &&
      countriesData.success &&
      countriesData.response &&
      countriesData.response.length > 0
    ) {
      setAllCountries(countriesData.response);
      const fetchedCountries = countriesData.response.map(
        (country: Country) => {
          return country.name;
        }
      );
      setCountries(fetchedCountries);
      const fetchedFlags = countriesData.response.map((country: Country) => {
        return country.flag;
      });
      setFlags(fetchedFlags);
    }
  }, [countriesData]);

  const onSubmit: SubmitHandler<z.infer<typeof generalRiskSchema>> = async (
    data
  ) => {
    console.log(data);
    const validationResult = generalRiskSchema.safeParse(data);

    if (validationResult.success) {
      const validatedData = validationResult.data;
      console.log(validatedData);
    } else {
      if (validationResult.error && validationResult.error.errors.length > 0) {
        validationResult.error.errors.forEach((error) => {
          toast.error(`Validation Error: ${error.message}`);
        });
      }
    }
  };

  return (
    <CreateLCLayout isRisk={true}>
      <form className="mt-2 flex flex-col gap-y-5">
        <RiskBanks setValue={setValue} />
        <RiskAgreement />
        <RiskStep1 register={register} watch={watch} />
        <RiskStep2 register={register} watch={watch} setValue={setValue} />

        <RiskStep3
          countries={countryNames}
          flags={countryFlags}
          register={register}
          watch={watch}
          setValue={setValue}
        />
        <RiskStep4
       countries={countries}
       flags={flags}
          register={register}
          watch={watch}
          setValue={setValue}
        />

        <RiskStep5
          register={register}
          watch={watch}
          setValue={setValue}
          countries={countries}
          flags={flags}
        />
        <RiskStep6 register={register} watch={watch} />

        <div className="relative flex items-center justify-between w-full h-full gap-x-2">
          <RiskStep7 />
          <RiskStep8 register={register} />
        </div>

        <div className="py-4 px-4 border border-borderCol rounded-lg w-full bg-white flex items-center justify-between gap-x-4">
          <Button
            variant="ghost"
            className="w-1/3 py-6 text-[16px] text-lightGray bg-[#F1F1F5]"
          >
            Save as draft
          </Button>
          <Button
            className="w-2/3 py-6 text-[16px] bg-text hover:bg-text/90 text-white"
            onClick={handleSubmit(onSubmit)}
          >
            Submit Request
          </Button>
        </div>
      </form>
    </CreateLCLayout>
  );
};

export default RiskFundedPage;
