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
import useCountries from "@/hooks/useCountries";
import useLoading from "@/hooks/useLoading";
import { getCountries } from "@/services/apis/helpers.api";
import { onCreateLC } from "@/services/apis/lcs.api";
import { onCreateRisk } from "@/services/apis/risk.api";
import { Country } from "@/types/type";
import { bankCountries } from "@/utils/data";
import { generalRiskSchema } from "@/validation/risk.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const RiskFundedPage = () => {
  const { register, setValue, reset, watch, getValues, handleSubmit } = useForm<
    z.infer<typeof generalRiskSchema>
  >({});
  const { startLoading, stopLoading, isLoading } = useLoading();
  const router = useRouter();

  const { countries, flags } = useCountries();
  const countryNames = bankCountries.map((country) => country.name);
  const countryFlags = bankCountries.map((country) => country.flag);

  const onSubmit: SubmitHandler<z.infer<typeof generalRiskSchema>> = async (
    data,
    isDraft
  ) => {
    console.log(data);
    const validationResult = generalRiskSchema.safeParse(data);
    console.log(validationResult);

    if (validationResult.success) {
      const validatedData = validationResult.data;
      const reqData = {
        ...data,
        riskParticipationTransaction: {
          ...data?.riskParticipationTransaction,
          perAnnum: "22",
        },
        isLcDiscounting: data?.isLcDiscounting === "no" ? false : true,
        expectedDiscounting: data?.expectedDiscounting === "no" ? false : true,
        transhipment: data?.transhipment === "no" ? false : true,
        days: 22,
        expectedDateConfimation: data?.expectedDateConfirmation,
        paymentType: "anything!",
        paymentReceviedType: undefined,
        expectedDateConfirmation: undefined,
      };
      console.log(reqData, "REQDATA");
      try {
        startLoading();
        const { response, success } = await onCreateRisk(reqData);

        if (!success) {
          toast.error(response);
        } else {
          toast.success("Risk created successfully");
          reset();
          router.push("/risk-participation");
        }
      } catch (error) {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
      stopLoading();
    } else {
      if (validationResult.error && validationResult.error.errors.length > 0) {
        validationResult.error.errors.forEach((error) => {
          toast.error(`Validation Error: ${error.message}`);
        });
      }
    }
  };
  const onSaveAsDraft: SubmitHandler<
    z.infer<typeof generalRiskSchema>
  > = async (data) => {
    try {
      const { response, success } = await onCreateRisk({
        ...data,
        draft: true,
      });
      if (!success) {
        toast.error(response);
      } else {
        toast.success("Risk created successfully");
        reset();
        router.push("/risk-participation");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
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
            onClick={handleSubmit(onSaveAsDraft)}
            disabled={isLoading}
          >
            Save as draft
          </Button>
          <Button
            type="button"
            className="w-2/3 py-6 text-[16px] bg-text hover:bg-text/90 text-white"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : "Submit Request"}
          </Button>
        </div>
      </form>
    </CreateLCLayout>
  );
};

export default RiskFundedPage;
