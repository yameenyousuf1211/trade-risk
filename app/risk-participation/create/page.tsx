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
import { onCreateRisk, onUpdateRisk } from "@/services/apis/risk.api";
import useFormStore, { getStateValues } from "@/store/risk.store";
import { bankCountries } from "@/utils/data";
import { generalRiskSchema } from "@/validation/risk.validation";
import Loader from "../../../components/ui/loader";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import useRiskStore from "@/store/risk.store";
import { IRisk } from "@/types/type";
import { sendNotification } from "@/services/apis/notifications.api";
import { useAuth } from "@/context/AuthProvider";

const RiskFundedPage = () => {
  const { user } = useAuth();
  const { register, setValue, reset, watch, getValues, control, handleSubmit } =
    useForm<z.infer<typeof generalRiskSchema>>({});
  const { startLoading, stopLoading, isLoading } = useLoading();
  const [isDraftLoading, setIsDraftLoading] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const { countries, flags } = useCountries();
  const countryNames = bankCountries.map((country) => country.name);
  const countryFlags = bankCountries.map((country) => country.flag);
  const riskParticipationTransaction = watch("riskParticipationTransaction.type");

  const formData = useRiskStore((state) => state);
  const setFormData = useRiskStore((state) => state.setValues);

  useEffect(() => {
    console.log(formData, "FORMDATA!");
    if (formData && formData?._id) {
      Object.entries(formData).forEach(([key, value]) => {
        // @ts-ignore
        if (typeof value === "number") {
          // @ts-ignore
          setValue(key, value);
        }
        if (typeof value === "string" && value.length > 0) {
          // @ts-ignore
          setValue(key, value);
        }
        if (typeof value === "boolean") {
          setValue(key, value ? "yes" : "no");
        }
        if (typeof value === "object" && value !== null) {
          const keys = Object.keys(value);
          const hasOnlyEmptyValues = keys.every((k) => value[k] === "");
          if (!hasOnlyEmptyValues) {
            // @ts-ignore
            setValue(key, value);
          }
        }
      });
    }
  }, [formData]);

  useEffect(() => {
    console.log(getStateValues(useRiskStore.getInitialState()), "INITIAL");
    const handleRouteChange = () => {
      setFormData(getStateValues(useRiskStore.getInitialState()));
      reset();
    };
    handleRouteChange();
  }, [router, pathname]);

  const onSubmit: SubmitHandler<z.infer<typeof generalRiskSchema>> = async (
    data,
    isDraft
  ) => {
    const startDateString = data?.startDate;
    const expiryDateString = data?.expiryDate;
    const expectedDateDiscountingString = data?.expectedDateDiscounting;
    const expectedDateConfirmationString = data?.expectedDateConfirmation;

    const startDate = startDateString ? new Date(startDateString) : null;
    const expiryDate = expiryDateString ? new Date(expiryDateString) : null;
    const expectedDateDiscounting = expectedDateDiscountingString
      ? new Date(expectedDateDiscountingString)
      : null;
    const expectedDateConfirmation = expectedDateConfirmationString
      ? new Date(expectedDateConfirmationString)
      : null;
    const preparedData = {
      ...data,
      startDate: startDate as Date,
      expiryDate: expiryDate,
      expectedDateDiscounting: expectedDateDiscounting,
      expectedDateConfirmation: expectedDateConfirmation,
    };
    const validationResult = generalRiskSchema.safeParse(preparedData);
    console.log(validationResult);

    if (validationResult.success) {
      const validatedData = validationResult.data;
      const reqData = {
        ...data,
        riskParticipationTransaction: {
          ...data?.riskParticipationTransaction,
          perAnnum: "22",
        },
        outrightSales:
          data?.transaction === "Risk Participation"
            ? undefined
            : data?.outrightSales,
        isLcDiscounting: data?.isLcDiscounting === "no" ? false : true,
        expectedDiscounting: data?.expectedDiscounting === "no" ? false : true,
        transhipment: data?.transhipment === "no" ? false : true,
        currency: data?.currency ? data?.currency : "usd",
        days: data?.paymentTerms == "Tenor LC" ? 22 : undefined,
      };
      // @ts-ignore
      delete reqData?.draft;
      // @ts-ignore
      delete reqData?.updatedAt;
      // @ts-ignore
      delete reqData?.createdAt;
      // @ts-ignore
      delete reqData?.createdBy;
      // @ts-ignore
      delete reqData?.isDeleted;
      // @ts-ignore
      delete reqData?.__v;
      // @ts-ignore
      delete reqData?._id;
      // @ts-ignore
      delete reqData?.status;
      // @ts-ignore
      delete reqData?.refId;

      try {
        startLoading();
        let result;
        if (formData?._id) {
          result = await onUpdateRisk({
            id: formData?._id,
            payload: reqData,
          });
        } else {
          result = await onCreateRisk(reqData);
        }

        const { response, success } = result;

        if (!success) {
          toast.error(response);
        } else {
          console.log(response, "response");
          const notificationResp = await sendNotification({
            role: "bank",
            title: "New Risk Participation Request",
            body: `Ref no ${response.data.refId} from ${response.data.issuingBank.bank} by ${user?.name}`,
          });
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
    setIsDraftLoading(true);
    const reqData = {
      ...data,
      isLcDiscounting: data?.isLcDiscounting === "no" ? false : true,
      expectedDiscounting: data?.expectedDiscounting === "no" ? false : true,
      transhipment: data?.transhipment === "no" ? false : true,
      draft: "true",
    };
    console.log(reqData, "REQDATA");
    try {
      let result;
      if (formData?._id) {
        result = await onUpdateRisk({ id: formData?._id, payload: reqData });
      } else {
        result = await onCreateRisk(reqData);
      }

      const { response, success } = result;
      if (!success) {
        toast.error(response);
      } else {
        toast.success("Risk draft created successfully");
        reset();
        router.push("/risk-participation");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    }
    setIsDraftLoading(false);
  };

  return (
    <CreateLCLayout isRisk={true}>
      <form className="mt-2 flex flex-col gap-y-5">
        <RiskBanks watch={watch} setValue={setValue} />
        <RiskAgreement />
        <RiskStep1 register={register} watch={watch} setValue={setValue} />
        <RiskStep2 register={register} watch={watch} setValue={setValue} />

        <RiskStep3
          countries={countryNames}
          flags={countryFlags}
          register={register}
          watch={watch}
          setValue={setValue}
          control={control}
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
        {/* {riskParticipationTransaction !== "LC Confirmation" && ( */}
          <RiskStep6 register={register} watch={watch} />
        {/* )} */}

        <div className="relative flex items-center justify-between w-full h-full gap-x-2">
          <RiskStep7 watch={watch} />
          <RiskStep8 watch={watch} register={register} />
        </div>

        <div className="py-4 px-4 border border-borderCol rounded-lg w-full bg-white flex items-center justify-between gap-x-4">
          <Button
            id="draft"
            variant="ghost"
            className="w-1/3 py-6 text-[16px] text-lightGray bg-[#F1F1F5]"
            onClick={handleSubmit(onSaveAsDraft)}
            disabled={isLoading || isDraftLoading}
          >
            {isDraftLoading ? <Loader /> : "Save as draft"}
          </Button>
          <Button
            type="button"
            className="w-2/3 py-6 text-[16px] bg-text hover:bg-text/90 text-white"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading || isDraftLoading}
          >
            {isLoading ? <Loader /> : "Submit Request"}
          </Button>
        </div>
      </form>
    </CreateLCLayout>
  );
};

export default RiskFundedPage;
