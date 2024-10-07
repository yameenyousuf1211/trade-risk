"use client";
import CreateLCLayout from "@/components/layouts/CreateLCLayout";
import { Button } from "@/components/ui/button";
import { DisclaimerDialog } from "@/components/helpers";
import {
  IssuanceStep1,
  IssuanceStep2,
  IssuanceStep3,
  IssuanceStep4,
  IssuanceStep5,
  IssuanceStep6,
  IssuanceStep7,
  IssuanceStep8,
  IssuanceStep9,
} from "@/components/IssuanceSteps";
import useCountries from "@/hooks/useCountries";
import { lcIssuanceSchema } from "@/validation/lc.validation";
import { SubmitHandler, useForm } from "react-hook-form";
import useLoading from "@/hooks/useLoading";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { onCreateLC, onUpdateLC } from "@/services/apis/lcs.api";
import { bankCountries } from "@/utils/data";
import { useEffect, useState } from "react";
import Loader from "@/components/ui/loader";
import useLcIssuance, { getStateValues } from "@/store/issueance.store";
import { useAuth } from "@/context/AuthProvider";
import * as Yup from "yup";

const IssuancePage = () => {
  const { user } = useAuth();

  const { countries, flags } = useCountries();
  const countryNames = bankCountries.map((country) => country.name);
  const countryFlags = bankCountries.map((country) => country.flag);
  const { register, setValue, reset, watch, handleSubmit } = useForm({});

  const { startLoading, stopLoading, isLoading } = useLoading();
  const [isDraftLoading, setIsDraftLoading] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const setValues = useLcIssuance((state) => state.setValues);
  const issuanceData = useLcIssuance((state) => state);

  useEffect(() => {
    if (issuanceData && issuanceData?._id) {
      Object.entries(issuanceData).forEach(([key, value]) => {
        // @ts-ignore
        if (typeof value === "number") {
          // @ts-ignore
          setValue(key, value);
        }
        if (typeof value === "string" && value.length > 0) {
          // @ts-ignore
          setValue(key, value);
        }
        if (typeof value === "object" && value !== null) {
          const keys = Object.keys(value);
          const hasOnlyEmptyValues = keys.every((k) => value[k] === "");

          if (!hasOnlyEmptyValues) {
            // @ts-ignore
            setValue(key, value);
          }
        }
        if (key === "standardSAMA") {
          setValue(key, value === true ? "yes" : "no");
        }
        if (key === "instrument") {
          setValue(key, value === true ? "yes" : "no");
        }
      });
    }
  }, [issuanceData]);

  useEffect(() => {
    router.prefetch("/");
  }, []);

  // reset the form on page navigation
  useEffect(() => {
    const handleRouteChange = () => {
      setValues(getStateValues(useLcIssuance.getInitialState()));
      reset();
    };

    handleRouteChange();
  }, [pathname, router]);

  const onSubmit: SubmitHandler<typeof lcIssuanceSchema> = async (data) => {
    // Ensure default values for optional fields
    const lcStartDateString = data.period?.startDate;
    const lcEndDateString = data.period?.endDate;
    const lcStartDate = lcStartDateString ? new Date(lcStartDateString) : null;
    const lcEndDate = lcEndDateString ? new Date(lcEndDateString) : null;

    const preparedData = {
      ...data,
      period: {
        ...data?.period,
        startDate: lcStartDate,
        endDate: lcEndDate,
      },
    };

    try {
      await lcIssuanceSchema.validate(preparedData, {
        abortEarly: false,
      });

      const reqData = {
        ...data,
        type: "LG Issuance",
        amount: {
          ...data?.amount,
          amountPercentage: "22",
        },
        period: {
          ...data?.period,
          expectedDate: true,
        },
        standardSAMA: data?.standardSAMA === "yes" ? true : false,
        priceCurrency: "usd",
        marginCurrency: "usd",
        benificiaryBankName: "bank",
      };
      console.log(reqData);

      // Remove unwanted properties
      const unwantedProps = [
        "draft",
        "updatedAt",
        "createdAt",
        "createdBy",
        "isDeleted",
        "__v",
        "_id",
        "status",
        "refId",
      ];
      unwantedProps.forEach((prop) => delete reqData[prop]);

      try {
        startLoading(); // Start the general loading state
        let result;
        if (issuanceData?._id) {
          result = await onUpdateLC({
            id: issuanceData?._id,
            payload: reqData,
          });
        } else {
          result = await onCreateLC(reqData);
        }

        const { response, success } = result;
        if (!success) {
          toast.error(response);
        } else {
          toast.success("LC created successfully");
          router.push("/");
          reset();
        }
      } catch (error) {
        console.error(error, "error");
        toast.error("An unexpected error occurred");
      } finally {
        stopLoading(); // Stop the general loading state
      }
    } catch (validationError) {
      if (validationError instanceof Yup.ValidationError) {
        validationError.errors.forEach((errorMessage) => {
          toast.error(`Error: ${errorMessage}`);
        });
      } else {
        console.error("Unexpected error during validation:", validationError);
      }
    }
  };

  // const onSubmit: SubmitHandler<z.infer<typeof lcIssuanceSchema>> = async ({
  //   data,
  //   isDraft,
  //   isProceed = false,
  // }: {
  //   isDraft: boolean;
  //   data: any;
  //   isProceed?: boolean;
  // }) => {
  //   const validationResult = lcIssuanceSchema.safeParse(data);
  //   console.log(data);
  //   console.log(validationResult)
  //   if (validationResult.success) {
  //     console.log(validationResult, "result");
  //     // const validatedData = validationResult.data;
  //     // if (isProceed) {
  //     //   const { confirmingBank2, extraInfo, ...rest } = validatedData;
  //     //   reqData = {
  //     //     ...rest,
  //     //     ...baseData,
  //     //   };
  //     //   startLoading();
  //     //   const { response, success } = confirmationData?._id
  //     //     ? await onUpdateLC({
  //     //         payload: reqData,
  //     //         id: confirmationData?._id,
  //     //       })
  //     //     : await onCreateLC(reqData);
  //     //   stopLoading();
  //     //   if (!success) return toast.error(response);
  //     //   else {
  //     //     // await sendNotification({
  //     //     //   title: "New LC Confirmation Request",
  //     //     //   body: `Ref no ${response.data.refId} from ${response.data.issuingBank.bank} by ${user.name}`,
  //     //     // });
  //     //     setValues(getStateValues(useConfirmationStore.getInitialState()));
  //     //     toast.success("LC created successfully");
  //     //     reset();
  //     //     router.push("/");
  //     //   }
  //   }
  //   //  else {
  //   //   let openDisclaimerBtn = document.getElementById("open-disclaimer");
  //   //   // @ts-ignore
  //   //   openDisclaimerBtn.click();
  //   //   console.log("hellooooojeee asssalamualaikum");
  //   //   // setProceed(true);
  //   // }
  //   else {
  //     if (validationResult.error && validationResult.error.errors.length > 0) {
  //       validationResult.error.errors.forEach((error) => {
  //         toast.error(`${error.message}`);
  //       });
  //     }
  //   }
  // };

  const onSaveAsDraft: SubmitHandler<typeof lcIssuanceSchema> = async (
    data
  ) => {
    setIsDraftLoading(true);
    const reqData = {
      ...data,
      type: "LG Issuance",
      draft: true,
    };
    console.log(reqData, "REQDATA");
    try {
      let result;
      if (issuanceData?._id) {
        result = await onUpdateLC({ id: issuanceData?._id, payload: reqData });
      } else {
        result = await onCreateLC(reqData);
      }

      const { response, success } = result;
      if (!success) {
        toast.error(response);
      } else {
        toast.success("Issuance draft created successfully");
        router.push("/");
        reset();
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    }
    setIsDraftLoading(false);
  };

  return (
    <CreateLCLayout isRisk={false}>
      <form className="border border-borderCol bg-white py-4 px-3 w-full flex flex-col gap-y-5 mt-4 rounded-lg">
        <IssuanceStep1 register={register} setValue={setValue} watch={watch} />
        <IssuanceStep2
          countries={countryNames}
          flags={countryFlags}
          register={register}
          setValue={setValue}
          watch={watch}
        />
        <IssuanceStep3 register={register} setValue={setValue} watch={watch} />
        <IssuanceStep4 register={register} setValue={setValue} watch={watch} />
        <IssuanceStep5 register={register} setValue={setValue} watch={watch} />
        <IssuanceStep6
          register={register}
          setValue={setValue}
          watch={watch}
          countries={countries}
          flags={flags}
        />
        <IssuanceStep7 register={register} setValue={setValue} watch={watch} />
        <IssuanceStep8 register={register} setValue={setValue} watch={watch} />
        <IssuanceStep9 register={register} setValue={setValue} watch={watch} />
        {/* Action Buttons */}
        <div className="flex items-center gap-x-4 w-full">
          <Button
            // onClick={handleSubmit(saveAsDraft)}
            type="button"
            variant="ghost"
            className="py-6 !bg-[#F1F1F5] w-1/3"
            // disabled={loader}
            onClick={handleSubmit((data) => onSaveAsDraft(data))}
          >
            {isDraftLoading ? <Loader /> : "Save as draft"}
          </Button>
          <Button
            type="button"
            size="lg"
            disabled={isLoading || isDraftLoading}
            className="py-6 bg-primaryCol hover:bg-primaryCol/90 text-white w-2/3"
            onClick={handleSubmit((data) => onSubmit(data))}
          >
            {isLoading ? <Loader /> : "Submit request"}
          </Button>
        </div>
        <DisclaimerDialog
          title="Submit Request"
          className="hidden"
          // setProceed={setProceed}
        />
      </form>
    </CreateLCLayout>
  );
};

export default IssuancePage;
