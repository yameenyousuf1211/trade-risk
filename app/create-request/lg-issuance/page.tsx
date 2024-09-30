"use client";

import CreateLCLayout from "@/components/layouts/CreateLCLayout";
import LgStep1 from "@/components/LG-Steps/LgStep1";
import LgStep10 from "@/components/LG-Steps/LgStep10";
import LgStep12 from "@/components/LG-Steps/LgStep12";
import LgStep2 from "@/components/LG-Steps/LgStep2";
import LgStep3 from "@/components/LG-Steps/LgStep3";
import LgStep3CashMargin from "@/components/LG-Steps/LgStep3CashMargin";
import LgStep4 from "@/components/LG-Steps/LgStep4";
import LgStep4Helper from "@/components/LG-Steps/LgStep4helper";
import LgStep5 from "@/components/LG-Steps/LgStep5";
import LgStep5Part2 from "@/components/LG-Steps/LgStep5Part2";
import LgStep6 from "@/components/LG-Steps/LgStep6";
import LgStep6Part2 from "@/components/LG-Steps/LgStep6Part2";
import LgStep7 from "@/components/LG-Steps/LgStep7";
import LgStep8 from "@/components/LG-Steps/LgStep8";
import LgStep9 from "@/components/LG-Steps/LgStep9";
import LgStep9Part2 from "@/components/LG-Steps/LgStep9Part2";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthProvider";
import useCountries from "@/hooks/useCountries";
import { onCreateLC, onUpdateLC } from "@/services/apis/lcs.api";
import { createLg, updateLg } from "@/services/apis/lg.apis";
import useLcIssuance from "@/store/issueance.store";
import useStepStore from "@/store/lcsteps.store";
import { LgDetails } from "@/types/lg";
import {
  convertStringValueToDate,
  LG,
  removeUnnecessaryFieldsForLgCreate,
} from "@/utils";
import { bankCountries } from "@/utils/data";
import {
  lg100CashMarginSchema,
  lgReIssuanceSchema,
} from "@/validation/lg.validation";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as Yup from "yup";

export default function LgIssuance() {
  const { register, setValue, reset, watch, handleSubmit } = useForm();
  const { setStepStatus, submit, stepStatus } = useStepStore();
  const [isLoading, setIsLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const router = useRouter();

  const countryNames = bankCountries.map((country) => country.name);
  const countryFlags = bankCountries.map((country) => country.flag);
  // const isoCodes = bankCountries.map((country) => country.isoCode);

  const storeData = useLcIssuance();
  // console.log("🚀 ~ LgIssuance ~ storeData:", storeData);
  const { countries, flags } = useCountries();
  const lgIssuance = watch("lgIssuance");

  useEffect(() => {
    router.prefetch("/");
  }, []);

  useEffect(() => {
    if (storeData.data && storeData?.data?._id) {
      Object.entries(storeData.data).forEach(([key, value]: [string, any]) => {
        console.log(key, value);

        if (typeof value === "number") {
          setValue(key, value);
        }

        if (typeof value === "string" && value.length > 0) {
          setValue(key, value);
        }
        if (typeof value === "object" && value !== null) {
          const keys = Object.keys(value);
          const hasOnlyEmptyValues = keys.every((k) => value[k] === "");

          if (!hasOnlyEmptyValues) {
            setValue(key, value);
          }
        }
        if (key === "isSameAsIssuance") {
          setValue(key, value);
        }
        // if (key == "expectedPrice") {
        //   console.log("🚀 ~ expectedPrice store value 123", value);
        // }
        if (key === "lgDetailsType") {
          setValue(key, value);
        }
        if (key == "issueLgWithStandardText") {
          if (value === true) {
            setValue("issueLgWithStandardText", "true");
          } else {
            setValue("issueLgWithStandardText", "false");
          }
        }
        if (key == "lgStandardText") {
          setValue("lgStandardText", value);
        }
        if (key == "physicalLg") {
          if (value === true) {
            setValue("physicalLg", "true");
          } else {
            setValue("physicalLg", "false");
          }
        }
        if (key == "physicalLgCountry") {
          setValue("physicalLgCountry", value);
        }

        if (key == "otherBond") {
          setValue("otherBond.Contract", true);
        }

        // if (key == "expectedPrice") {
        //   if (value.expectedPrice) {
        //     setValue("expectedPrice.expectedPrice", value.expectedPrice);
        //   }
        //   setValue("expectedPrice.pricePerAnnum", value.pricePerAnnum);
        // }
      });
    }
  }, [storeData.data]);

  const onSubmit = async (data: LgDetails) => {
    // Prepare data for submission
    console.log("🚀 ~ onSubmit ~ data", data.data.draft);

    const responseData = {
      ...data.data,
      type: "LG Issuance",
      draft: data.draft,
      issueLgWithStandardText: Boolean(data.data.issueLgWithStandardText),
      physicalLg: Boolean(data.data.physicalLg),
    };

    console.log("🚀 ~ onSubmit ~ responseData", responseData.draft);

    if (responseData.draft) {
      handleDraftSubmission(responseData);
    } else {
      handleFinalSubmission(responseData);
    }

    // delete responseData.test;

    // // Set default value for lgDetailsType if not defined
    // if (responseData.lgDetailsType === undefined) {
    //   responseData.lgDetailsType = "Choose any other type of LGs";
    // }

    // // Handle draft submissions
    // if (responseData.draft) {
    //   await handleDraftSubmission(responseData);
    // } else {
    //   await handleFinalSubmission(responseData);
    // }
  };

  // Function to handle draft submissions
  const handleDraftSubmission = async (responseData: any) => {
    setLoader(true);
    if (responseData.lgIssuance === "LG 100% Cash Margin") {
      delete responseData.retentionMoneyBond;
      delete responseData.advancePaymentBond;
      delete responseData.performanceBond;
      delete responseData.bidBond;
      delete responseData.otherBond;
      delete responseData.lgDetailsType;
      delete responseData.totalContractValue;
      delete responseData.totalContractCurrency;
      delete responseData.beneficiaryBankDetails;
    } else {
      removeUnnecessaryFieldsForLgCreate(responseData);
      // console.log("🚀 ~ handleFinalSubmission ~ responseData lastDateOfReceivingBids DATE:", responseData.lastDateOfReceivingBids);
      // console.log("🚀 ~ handleFinalSubmission ~ responseData advancePaymentBond DATE:", responseData.advancePaymentBond.expectedDate);
      // console.log("🚀 ~ handleFinalSubmission ~ responseData performanceBond DATE:", responseData.performanceBond.expectedDate)
      // console.log("🚀 ~ handleFinalSubmission ~ responseData retentionMoneyBond DATE:", responseData.retentionMoneyBond.expectedDate)
      // Update existing data
      removeUnnecessaryFields(responseData);
    }
    console.log(responseData, "responseData");
    if (storeData.data._id) {
      const { response, success } = await onUpdateLC({
        payload: responseData,
        id: storeData.data._id,
      });
      handleResponse(
        success,
        response,
        "LG Issuance Draft request updated successfully"
      );
    } else {
      // Create new draft
      const { response, success } = await onCreateLC(responseData);
      handleResponse(success, response, "LG saved as a draft");
    }

    setLoader(false);
  };
  const setLgDetailsDefault = (lgDetail: any) => {
    lgDetail.currency = lgDetail.currency ?? "USD";
    lgDetail.lgTenor.lgTenorType = lgDetail.lgTenor.lgTenorType ?? "Months";
  };
  // Function to handle final submissions
  const handleFinalSubmission = async (responseData: any) => {
    if (responseData.lgIssuance !== "LG 100% Cash Margin") {
      const setBondDefaults = (bond: any) => {
        if (bond?.Contract) {
          bond.currencyType = bond.currencyType ?? "USD";
          if (bond.lgTenor) {
            bond.lgTenor.lgTenorType = bond.lgTenor.lgTenorType ?? "Months";
          } else {
            bond.lgTenor = { lgTenorType: "Months" };
          }
        }
      };

      responseData.totalContractCurrency =
        responseData.totalContractCurrency ?? "USD";

      if (responseData.bidBond) {
        setBondDefaults(responseData.bidBond);
      }
      if (responseData.advancePaymentBond) {
        setBondDefaults(responseData.advancePaymentBond);
      }
      if (responseData.performanceBond) {
        setBondDefaults(responseData.performanceBond);
      }
      if (responseData.retentionMoneyBond) {
        setBondDefaults(responseData.retentionMoneyBond);
      }
      if (responseData.otherBond) {
        setBondDefaults(responseData.otherBond);
      }

      removeUnnecessaryFieldsForLgCreate(responseData);
      removeUnnecessaryFields(responseData);
      // const validate = bondRequiredFields(responseData)
      // if(!validate) return toast.error("Please Select at least one Bond");
      convertStringValueToDate(responseData);
    } else if (responseData.lgIssuance === "LG 100% Cash Margin") {
      delete responseData.retentionMoneyBond;
      delete responseData.advancePaymentBond;
      delete responseData.performanceBond;
      delete responseData.bidBond;
      delete responseData.otherBond;
      delete responseData.lgDetailsType;
      delete responseData.totalContractValue;
      delete responseData.totalContractCurrency;
      delete responseData.beneficiaryBankDetails;
      setLgDetailsDefault(responseData.lgDetails);
    }
    try {
      console.log("🚀 ~ handleFinalSubmission ~ responseData", responseData);
      if (responseData.lgIssuance === "LG 100% Cash Margin") {
        await lg100CashMarginSchema.validate(responseData, {
          abortEarly: true,
          stripUnknown: true,
        });
      } else {
        await lgReIssuanceSchema.validate(responseData, {
          abortEarly: true,
          stripUnknown: true,
        });
      }
      console.log("🚀 ~ handleFinalSubmission ~ validatedData", responseData);
      const { response, success } = storeData?.data?._id
        ? await onUpdateLC({ payload: responseData, id: storeData?.data?._id })
        : await onCreateLC(responseData);
      handleResponse(
        success,
        response,
        "LG Issuance request submitted successfully"
      );
      setIsLoading(false);
    } catch (validationError) {
      console.log(
        "🚀 ~ handleFinalSubmission ~ validationError",
        validationError
      );
      if (validationError instanceof Yup.ValidationError) {
        handleValidationErrors(validationError);
      } else {
        // toast.error("Unexpected error during validation");
      }
    }
  };

  // Function to remove unnecessary fields for draft updates
  const removeUnnecessaryFields = (responseData: any) => {
    delete responseData._id;
    delete responseData.createdAt;
    delete responseData.updatedAt;
    delete responseData.__v;
    delete responseData.refId;
    delete responseData.createdBy;
  };

  // Function to handle API responses
  const handleResponse = async (
    success: boolean,
    response: any,
    successMessage: string
  ) => {
    if (success) {
      storeData?.removeValues();
      toast.success(successMessage);
      console.log(response, "response");
      router.push("/");
    } else {
      toast.error(response);
    }
  };

  const handleValidationErrors = (error: any) => {
    console.log("🚀 ~ handleValidationErrors ~ error", error);

    if (error && error.errors && Array.isArray(error.errors)) {
      // Get the first error message
      const fullErrorMessage = error.errors[0]; // Assume errors[0] contains the full error message

      // Extract the relevant part of the error message
      const relevantErrorMessage = fullErrorMessage.split("\n")[0].trim(); // Get the first line and trim any extra spaces

      // Display the relevant error message
      toast.error(`Error: ${relevantErrorMessage}`);
    } else {
      toast.error("An unexpected error occurred.");
    }
  };

  const handleStepCompletion = (index: number, status: boolean) => {
    setStepStatus(index, status);
  };

  return (
    <CreateLCLayout isRisk={false} isLg={true}>
      <div className="bg-white min-h-screen my-5 border border-[#E2E2EA] rounded-lg p-6 flex flex-col gap-5 items-center">
        <LgStep1
          register={register}
          watch={watch}
          setStepCompleted={handleStepCompletion}
        />
        <LgStep2
          register={register}
          setStepCompleted={handleStepCompletion}
          watch={watch}
          data={countries}
          flags={flags}
          setValue={setValue}
        />
        {lgIssuance === LG.cashMargin ? (
          <LgStep3CashMargin
            data={countryNames}
            flags={countryFlags}
            register={register}
            setStepCompleted={handleStepCompletion}
            setValue={setValue}
            watch={watch}
          />
        ) : (
          <LgStep3
            data={countryNames}
            flags={countryFlags}
            register={register}
            setStepCompleted={handleStepCompletion}
            setValue={setValue}
            watch={watch}
          />
        )}

        {lgIssuance === LG.cashMargin ? (
          <LgStep4Helper
            register={register}
            setStepCompleted={handleStepCompletion}
            watch={watch}
            setValue={setValue}
          />
        ) : (
          <LgStep4
            register={register}
            setStepCompleted={handleStepCompletion}
            watch={watch}
            data={countryNames}
            flags={countryFlags}
            setValue={setValue}
          />
        )}
        {lgIssuance === LG.cashMargin ? (
          <LgStep5Part2
            register={register}
            watch={watch}
            setStepCompleted={handleStepCompletion}
            setValue={setValue}
          />
        ) : (
          <LgStep5
            setValue={setValue}
            register={register}
            watch={watch}
            setStepCompleted={handleStepCompletion}
          />
        )}
        {/* //here */}
        {lgIssuance === LG.cashMargin ? (
          <LgStep6Part2
            register={register}
            setValue={setValue}
            setStepCompleted={handleStepCompletion}
            watch={watch}
            data={[]}
            flags={[]}
          />
        ) : (
          <LgStep6
            register={register}
            setStepCompleted={handleStepCompletion}
            setValue={setValue}
            watch={watch}
          />
        )}

        <LgStep7
          setValue={setValue}
          register={register}
          watch={watch}
          setStepCompleted={handleStepCompletion}
        />
        {lgIssuance === LG.reIssuanceInAnotherCountry && (
          <LgStep8
            register={register}
            setValue={setValue}
            watch={watch}
            setStepCompleted={handleStepCompletion}
            step={8}
          />
        )}

        {lgIssuance === LG.cashMargin && (
          <LgStep4
            register={register}
            setStepCompleted={handleStepCompletion}
            watch={watch}
            data={countryNames}
            flags={countryFlags}
            setValue={setValue}
            step={8}
          />
        )}

        {lgIssuance === LG.cashMargin && (
          <LgStep9Part2
            register={register}
            watch={watch}
            setStepCompleted={handleStepCompletion}
            data={countries}
            flags={flags}
            step={9}
            setValue={setValue}
            type="issue" // Pass "issue" for lgIssueIn
          />
        )}

        {lgIssuance === LG.cashMargin && (
          <LgStep9Part2
            register={register}
            watch={watch}
            setStepCompleted={handleStepCompletion}
            data={countries}
            flags={flags}
            step={10}
            setValue={setValue}
            type="collect" // Pass "collect" for lgCollectIn
          />
        )}

        {lgIssuance === LG.cashMargin && (
          <LgStep8
            step={11}
            setValue={setValue}
            register={register}
            watch={watch}
            setStepCompleted={handleStepCompletion}
          />
        )}

        <LgStep9
          register={register}
          watch={watch}
          setStepCompleted={handleStepCompletion}
          step={lgIssuance === LG.cashMargin ? 12 : 9}
        />

        <LgStep10
          register={register}
          watch={watch}
          setStepCompleted={handleStepCompletion}
          setValue={setValue}
          step={lgIssuance === LG.cashMargin ? 13 : 10}
        />

        <LgStep12
          register={register}
          watch={watch}
          setStepCompleted={handleStepCompletion}
          setValue={setValue}
          step={lgIssuance === LG.cashMargin ? 14 : 11}
        />
        <div className="flex items-center gap-x-4 w-full">
          <Button
            // onClick={handleSubmit(saveAsDraft)}
            onClick={handleSubmit((data) => {
              onSubmit({ data: data, draft: true, type: "LG Issuance" });
            })}
            type="button"
            variant="ghost"
            className="!bg-[#F1F1F5] w-1/3"
            // disabled={loader}
          >
            {loader ? <Loader2 className="animate-spin" /> : "Save as draft"}
          </Button>
          <Button
            type="button"
            size="lg"
            // disabled={isLoading}
            className="bg-primaryCol hover:bg-primaryCol/90 text-white w-2/3"
            // onClick={handleSubmit(onSubmit)}
            onClick={handleSubmit((data) => {
              onSubmit({ data: data, draft: false, type: "LG Issuance" });
            })}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Submit request"
            )}
          </Button>
        </div>
      </div>
    </CreateLCLayout>
  );
}
