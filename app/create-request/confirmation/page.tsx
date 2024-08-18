"use client";
import CreateLCLayout from "@/components/layouts/CreateLCLayout";
import { Button } from "@/components/ui/button";
import {
  Step1,
  Step2,
  Step3,
  Step4,
  Step5,
  Step6,
  Step7,
  Step7Disounting,
} from "@/components/LCSteps";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { onCreateLC, onUpdateLC } from "@/services/apis/lcs.api";
import { usePathname, useRouter } from "next/navigation";
import { confirmationDiscountSchema } from "@/validation/lc.validation";
import Loader from "@/components/ui/loader";
import useLoading from "@/hooks/useLoading";
import { useQueryClient } from "@tanstack/react-query";
import { DisclaimerDialog } from "@/components/helpers";
import useConfirmationDiscountingStore, {
  getStateValues,
} from "@/store/confirmationDiscounting.store";
import useStepStore from "@/store/lcsteps.store";
import { bankCountries } from "@/utils/data";
import { sendNotification } from "@/services/apis/notifications.api";
import { calculateDaysLeft } from "@/utils";
import useCountries from "@/hooks/useCountries";
import { useAuth } from "@/context/AuthProvider";
import * as Yup from "yup";

const ConfirmationPage = () => {
  const { user } = useAuth();
  const { register, setValue, getValues, reset, watch, handleSubmit } = useForm(
    {}
  );

  const queryClient = useQueryClient();
  const { startLoading, stopLoading, isLoading } = useLoading();
  const router = useRouter();
  const pathname = usePathname();

  const [days, setDays] = useState<number>(1);

  const setValues = useConfirmationDiscountingStore((state) => state.setValues);
  const confirmationData = useConfirmationDiscountingStore((state) => state);
  const { setStepStatus, submit } = useStepStore();

  useEffect(() => {
    if (confirmationData && confirmationData?._id) {
      Object.entries(confirmationData).forEach(([key, value]) => {
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
        if (key === "transhipment") {
          setValue(key, value === true ? "yes" : "no");
        }
        if (key === "period") {
          setValue(
            "period.expectedDate",
            value.expectedDate === true ? "yes" : "no"
          );
        }
        if (key === "amount") {
          setValue(key, value.price);
        }
        if (key === "extraInfo") {
          const daysLeft = calculateDaysLeft(value?.dats);
          setDays(daysLeft);
          setValue("extraInfo", value?.other);
        }
      });
    }
  }, [confirmationData]);

  const [proceed, setProceed] = useState(false);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    router.prefetch("/");
  }, []);

  const onSubmit: SubmitHandler<typeof confirmationDiscountSchema> = async ({
    data,
    isDraft,
    isProceed = false,
  }: {
    isDraft: boolean;
    data: any;
    isProceed;
  }) => {
    submit();
    if (
      data.confirmingBank &&
      data.issuingBank?.country === data.confirmingBank?.country
    )
      return toast.error(
        "Confirming bank country cannot be the same as issuing bank country"
      );
    if (/^\d+$/.test(data.productDescription))
      return toast.error("Product description cannot contain only digits");
    const issueBankChange = [data.issuingBank];
    const currentDate = new Date();
    const futureDate = new Date(
      currentDate.setDate(currentDate.getDate() + days)
    );
    let extraInfoObj;
    if (
      data.paymentTerms &&
      data.paymentTerms !== "Sight LC" &&
      data.extraInfo
    ) {
      extraInfoObj = { dats: futureDate, other: data.extraInfo };
    }

    let reqData;
    const baseData = {
      issuingBanks: issueBankChange,
      type: "LC Confirmation & Discounting",
      transhipment: data.transhipment === "yes" ? true : false,
      amount: {
        price: `${data.amount}.00`,
      },
      period: {
        ...data.period,
        expectedDate: data.period?.expectedDate === "yes" ? true : false,
      },
      ...(extraInfoObj && { extraInfo: extraInfoObj }),
    };
    try {
      setLoader(true); // Start the loader
      startLoading(); // Start the general loading state

      if (isDraft) {
        const {
          confirmingBank2,
          _id,
          refId,
          createdBy,
          status,
          createdAt,
          updatedAt,
          extraInfo,
          ...rest
        } = data;
        reqData = {
          ...rest,
          ...baseData,
          draft: "true",
        };
        const { response, success } = confirmationData?._id
          ? await onUpdateLC({
              payload: reqData,
              id: confirmationData?._id,
            })
          : await onCreateLC(reqData);

        if (!success) return toast.error(response);
        else {
          toast.success("LC saved as draft");
          reset();
          router.push("/");
          setValues(
            getStateValues(useConfirmationDiscountingStore.getInitialState())
          );
          queryClient.invalidateQueries({
            queryKey: ["fetch-lcs-drafts"],
          });
        }
      } else {
        const lcStartDateString = data.period?.startDate;
        const lcEndDateString = data.period?.endDate;
        const expectedDateString = data?.expectedConfirmationDate;
        const lcStartDate = lcStartDateString
          ? new Date(lcStartDateString)
          : null;
        const lcEndDate = lcEndDateString ? new Date(lcEndDateString) : null;
        const expectedConfirmationDate = expectedDateString
          ? new Date(expectedDateString)
          : null;

        const preparedData = {
          ...data,
          period: {
            ...data.period,
            startDate: lcStartDate,
            endDate: lcEndDate,
          },
          expectedConfirmationDate,
        };

        const validatedData = await confirmationDiscountSchema.validate(
          preparedData,
          {
            abortEarly: false,
          }
        );

        if (isProceed) {
          const { confirmingBank2, extraInfo, ...rest } = validatedData;
          reqData = {
            ...rest,
            ...baseData,
          };

          const { response, success } = confirmationData?._id
            ? await onUpdateLC({
                payload: reqData,
                id: confirmationData?._id,
              })
            : await onCreateLC(reqData);

          if (!success) return toast.error(response);
          else {
            setValues(
              getStateValues(useConfirmationDiscountingStore.getInitialState())
            );
            toast.success("LC created successfully");
            router.push("/");
            reset();
          }
        } else {
          let openDisclaimerBtn = document.getElementById("open-disclaimer");
          openDisclaimerBtn?.click();
        }
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        error.errors.forEach((errMessage) => {
          toast.error(errMessage);
        });
      } else {
        console.error("Unexpected error during validation:", error);
      }
    } finally {
      setLoader(false); // Stop the loader
      stopLoading(); // Stop the general loading state
    }
  };

  const countryNames = bankCountries.map((country) => country.name);
  const countryFlags = bankCountries.map((country) => country.flag);

  const { countries, flags } = useCountries();

  // reset the form on page navigation
  useEffect(() => {
    const handleRouteChange = () => {
      setValues(
        getStateValues(useConfirmationDiscountingStore.getInitialState())
      );
      reset();
      useStepStore.getState().setStepStatus(null, null);
      useStepStore.getState().resetSubmit();
    };

    handleRouteChange();
  }, [pathname, router]);

  const handleStepCompletion = (index: number, status: boolean) => {
    setStepStatus(index, status);
  };

  return (
    <CreateLCLayout isRisk={false}>
      <form className="border border-borderCol py-4 px-3 w-full flex flex-col gap-y-5 mt-4 rounded-lg bg-white">
        <Step1
          setStepCompleted={handleStepCompletion}
          register={register}
          watch={watch}
        />
        <Step2
          watch={watch}
          register={register}
          setValue={setValue}
          setStepCompleted={handleStepCompletion}
          days={days}
          setDays={setDays}
        />
        <Step3
          watch={watch}
          register={register}
          setValue={setValue}
          countries={countryNames}
          flags={countryFlags}
          setStepCompleted={handleStepCompletion}
        />
        <Step4
          register={register}
          countries={countries}
          setValue={setValue}
          flags={flags}
          setStepCompleted={handleStepCompletion}
          watch={watch}
        />
        <Step5
          register={register}
          isConfirmation
          countries={countryNames}
          flags={countryFlags}
          setValue={setValue}
          setStepCompleted={handleStepCompletion}
          watch={watch}
        />

        <div className="flex items-start gap-x-4 h-full w-full relative">
          <Step6
            watch={watch}
            register={register}
            title="Confirmation Info"
            setValue={setValue}
            setStepCompleted={handleStepCompletion}
          />
          <Step7Disounting
            watch={watch}
            getValues={getValues}
            setValue={setValue}
            register={register}
          />
        </div>
        <Step7
          register={register}
          step={8}
          setStepCompleted={handleStepCompletion}
        />

        {/* Action Buttons */}
        <div className="flex items-center gap-x-4 w-full">
          <Button
            type="button"
            // onClick={handleSubmit(saveAsDraft)}
            onClick={handleSubmit((data) => onSubmit({ data, isDraft: true }))}
            disabled={loader}
            variant="ghost"
            className="!bg-[#F1F1F5] w-1/3"
          >
            {loader ? <Loader /> : "Save as draft"}
          </Button>
          <Button
            type="button"
            disabled={isLoading}
            size="lg"
            className="bg-primaryCol hover:bg-primaryCol/90 text-white w-2/3"
            // onClick={handleSubmit(onSubmit)}
            onClick={handleSubmit((data) => onSubmit({ data, isDraft: false }))}
          >
            {isLoading ? <Loader /> : "Submit request"}
          </Button>
        </div>
        <DisclaimerDialog
          title="Submit Request"
          className="hidden"
          setProceed={setProceed}
          // onAccept={handleSubmit(onSubmit)}
          onAccept={handleSubmit((data) =>
            onSubmit({ data, isDraft: false, isProceed: true })
          )}
        />
      </form>
    </CreateLCLayout>
  );
};
export default ConfirmationPage;
