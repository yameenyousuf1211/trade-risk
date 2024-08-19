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
import { createLg, updateLg } from "@/services/apis/lg.apis";
import { sendNotification } from "@/services/apis/notifications.api";
import useLcIssuance from "@/store/issueance.store";
import useStepStore from "@/store/lcsteps.store";
import { LgDetails } from "@/types/lg";
import { convertStringToNumber, LG } from "@/utils";
import { bankCountries } from "@/utils/data";
import { lgValidator } from "@/validation/lg.validation";
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
  const { user } = useAuth();

  const countryNames = bankCountries.map((country) => country.name);
  const countryFlags = bankCountries.map((country) => country.flag);
  const storeData = useLcIssuance();
  console.log("🚀 ~ LgIssuance ~ storeData:", storeData);
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
        if (key === "expectedPrice") {
          setValue("expectedPrice.expectedPrice", value);
        }
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

        if (key == "expectedPrice") {
          if (value.expectedPrice === true) {
            setValue("expectedPrice.expectedPrice", "true");
          } else {
            setValue("expectedPrice.expectedPrice", "false");
          }
          setValue("expectedPrice.pricePerAnnum", value.pricePerAnnum);
        }
      });
    }
  }, [storeData.data]);

  const onSubmit = async (data: LgDetails) => {
    // Prepare data for submission
    const responseData = {
      ...data.data,
      type: "LG Issuance",
      draft: Boolean(data.draft),
      issueLgWithStandardText: Boolean(data.data.issueLgWithStandardText),
      physicalLg: Boolean(data.data.physicalLg),
    };
    delete responseData.test;

    // Set default value for lgDetailsType if not defined
    if (responseData.lgDetailsType === undefined) {
      responseData.lgDetailsType = "Choose any other type of LGs";
    }

    // Handle draft submissions
    if (responseData.draft) {
      await handleDraftSubmission(responseData);
    } else {
      await handleFinalSubmission(responseData);
    }
  };

  // Function to handle draft submissions
  const handleDraftSubmission = async (responseData: any) => {
    setLoader(true);
    removeUnnecessaryFieldsForLgCreate(responseData);

    // Update existing data
    removeUnnecessaryFields(responseData);
    if (storeData.data._id) {
      const { response, success } = await updateLg(
        responseData,
        storeData.data._id
      );
      handleResponse(
        success,
        response,
        "LG Issuance request updated successfully"
      );
    } else {
      // Create new draft
      const { response, success } = await createLg(responseData);
      handleResponse(
        success,
        response,
        "LG Issuance request created successfully"
      );
    }

    setLoader(false);
  };

  // Function to handle final submissions
  const handleFinalSubmission = async (responseData: any) => {
    removeUnnecessaryFieldsForLgCreate(responseData);
    console.log("🚀 ~ handleFinalSubmission ~ responseData:", responseData);

    try {
      await lgValidator.validate(responseData, {
        abortEarly: false,
      });

      const { response, success } = await createLg(responseData);
      handleResponse(
        success,
        response,
        "LG Issuance request submitted successfully"
      );
      setIsLoading(false);
    } catch (validationError) {
      if (validationError instanceof Yup.ValidationError) {
        handleValidationErrors(validationError);
      } else {
        console.error("Unexpected error during validation:", validationError);
      }
    }
  };

  // Function to remove unnecessary fields for draft updates
  const removeUnnecessaryFields = (responseData: any) => {
    delete responseData._id;
    delete responseData.createdAt;
    delete responseData.updatedAt;
    delete responseData.__v;
  };

  // Function to remove unnecessary fields for draft updates
  const removeUnnecessaryFieldsForLgCreate = (responseData: any) => {
    // Remove unnecessary fields based on lgIssuance type
    delete responseData?._id;
    delete responseData.createdAt;
    delete responseData.updatedAt;
    delete responseData.__v;
    delete responseData.status;

    if (responseData.lgIssuance !== LG.cashMargin) {
      delete responseData.typeOfLg;
      delete responseData.physicalLgSwiftCode;
      delete responseData?.lgStandardText;

      if (
        responseData.lgDetailsType ===
        "Contract Related LGs (Bid Bond, Advance Payment Bond, Performance Bond etc)"
      ) {
        delete responseData.otherBond;
        delete responseData?.status;
        [
          "bidBond",
          "advancePaymentBond",
          "performanceBond",
          "retentionMoneyBond",
        ].forEach((element) => {
          delete responseData[element]?._id;

          if (responseData[element]?.valueInPercentage)
            responseData[element].valueInPercentage =
              responseData[element].valueInPercentage?.toString();

          if (responseData[element]?.lgTenor?.lgTenorValue)
            responseData[element].lgTenor.lgTenorValue =
              responseData[element].lgTenor.lgTenorValue?.toString();

          if (!responseData[element]?.cashMargin) {
            delete responseData[element];
          } else {
            responseData[element]["cashMargin"] = convertStringToNumber(
              responseData[element]["cashMargin"]
            )?.toString();
          }
        });
      } else {
        delete responseData.bidBond;
        delete responseData.advancePaymentBond;
        delete responseData.performanceBond;
        delete responseData.retentionMoneyBond;
        delete responseData?.status;
        delete responseData.otherBond?._id;
        delete responseData?.otherBond?.checked;

        if (responseData.otherBond?.valueInPercentage)
          responseData.otherBond.valueInPercentage =
            responseData.otherBond.valueInPercentage?.toString();

        if (responseData.otherBond?.lgTenor?.lgTenorValue)
          responseData.otherBond.lgTenor.lgTenorValue =
            responseData.otherBond.lgTenor.lgTenorValue?.toString();

        if (responseData?.otherBond?.cashMargin) {
          console.log(responseData.otherBond?.cashMargin, "cashMargin");
          responseData.otherBond.cashMargin = convertStringToNumber(
            responseData?.otherBond?.cashMargin
          )?.toString();
          responseData.otherBond.lgDetailAmount = convertStringToNumber(
            responseData.otherBond.cashMargin
          );
        }
      }
    } else {
      delete responseData.bidBond;
      delete responseData.advancePaymentBond;
      delete responseData.performanceBond;
      delete responseData.retentionMoneyBond;
      delete responseData?.otherBond?._id;
      responseData["lgDetailsType"] = "Choose any other type of LGs";
      responseData.otherBond["lgDetailAmount"] = convertStringToNumber(
        responseData.otherBond["lgDetailAmount"]
      );
      responseData.otherBond["cashMargin"] = convertStringToNumber(
        responseData.otherBond["cashMargin"]
      )?.toString();

      if (responseData.otherBond?.lgTenor?.lgTenorValue) {
        responseData.otherBond.lgTenor.lgTenorValue =
          responseData.otherBond?.lgTenor?.lgTenorValue?.toString();
      }
    }
    if (
      !responseData?.expectedPrice?.expectedPrice ||
      responseData?.expectedPrice?.expectedPrice === "false"
    )
      delete responseData?.expectedPrice?.pricePerAnnum;
    if (responseData?.applicantDetails?.crNumber)
      responseData.applicantDetails.crNumber =
        responseData.applicantDetails.crNumber?.toString();
    console.log("🚀 ~ responseData:", responseData);
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
      router.push("/my-bids");
    } else {
      toast.error(response);
    }
  };

  // Function to handle validation errors
  const handleValidationErrors = (error: any) => {
    if (error) {
      error.errors.forEach((errorItem: any) => {
        toast.error(`Validation Error: ${errorItem.message}`);
      });
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
            stepStatus={stepStatus}
            name="otherBond"
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
            setValue={setValue}
          />
        )}

        {/* {lgIssuance === LG.cashMargin && ( */}
          <LgStep8
            step={9}
            setValue={setValue}
            register={register}
            watch={watch}
            setStepCompleted={handleStepCompletion}
          />
        {/* // /ss)} */}

        <LgStep9
          register={register}
          watch={watch}
          setStepCompleted={handleStepCompletion}
          step={lgIssuance === LG.cashMargin ? 11 : 9}
        />

        <LgStep10
          register={register}
          watch={watch}
          setStepCompleted={handleStepCompletion}
          setValue={setValue}
          step={lgIssuance === LG.cashMargin ? 12 : 10}
        />

        <LgStep12
          register={register}
          watch={watch}
          setStepCompleted={handleStepCompletion}
          setValue={setValue}
          step={11}
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
