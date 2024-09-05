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
} from "@/components/LCSteps";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { discountingSchema } from "@/validation/lc.validation";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { onCreateLC, onUpdateLC } from "@/services/apis/lcs.api";
import { usePathname, useRouter } from "next/navigation";
import useLoading from "@/hooks/useLoading";
import Loader from "@/components/ui/loader";
import { useQueryClient } from "@tanstack/react-query";
import { DisclaimerDialog } from "@/components/helpers";
import useDiscountingStore, { getStateValues } from "@/store/discounting.store";
import useStepStore from "@/store/lcsteps.store";
import { bankCountries } from "@/utils/data";
import { calculateDaysLeft } from "@/utils";
import useCountries from "@/hooks/useCountries";
import { useAuth } from "@/context/AuthProvider";
import * as Yup from "yup";
import LgStep12 from "@/components/LG-Steps/LgStep12";

const CreateDiscountPage = () => {
  const { user } = useAuth();

  const { register, setValue, reset, handleSubmit, watch } = useForm({});

  const queryClient = useQueryClient();

  const { startLoading, stopLoading, isLoading } = useLoading();
  const router = useRouter();
  const pathname = usePathname();
  const [days, setDays] = useState<number>(1);

  // Edit Request
  const setValues = useDiscountingStore((state) => state.setValues);
  const discountingData = useDiscountingStore((state) => state);
  const { setStepStatus, submit } = useStepStore();

  useEffect(() => {
    if (discountingData && discountingData?._id) {
      Object.entries(discountingData).forEach(([key, value]) => {
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
          const transhipmentValue =
            value === true ? "yes" : value === false ? "no" : null;
          setValue(key, transhipmentValue);
        }
        if (key === "period") {
          const expectedDateValue =
            value.expectedDate === true
              ? "yes"
              : value.expectedDate === false
              ? "no"
              : null;
          setValue("period.expectedDate", expectedDateValue);
        }
        if (key === "amount") {
          setValue(key, value.price);
        }
        if (key === "extraInfo") {
          // const daysLeft = calculateDaysLeft(value?.days);
          // console.log(daysLeft, "daysLeft");
          setDays(value?.days);
          setValue("extraInfo.days", value.days);
          setValue("extraInfo.other", value?.other);
        }
        // Handle array of issuing banks
        if (key === "issuingBanks" && Array.isArray(value)) {
          value.forEach((bank, index) => {
            setValue(`issuingBanks[${index}].country`, bank.country);
            setValue(`issuingBanks[${index}].bank`, bank.bank);
          });
        }
      });
    }
  }, [discountingData]);

  const [proceed, setProceed] = useState(false);

  const [loader, setLoader] = useState(false);

  const onSubmit: SubmitHandler<typeof discountingSchema> = async ({
    data,
    isDraft,
    isProceed = false,
  }: {
    isDraft: boolean;
    data: any;
    isProceed?: boolean;
  }) => {
    delete data.lcPeriod;
    submit();
    if (
      data.confirmingBank &&
      data.issuingBanks.some(
        (bank: any) => bank.country === data.confirmingBank.country
      )
    )
      return toast.error(
        "Confirming bank country cannot be the same as issuing bank country"
      );
    if (/^\d+$/.test(data.productDescription))
      return toast.error("Product description cannot contain only digits");
    let extraInfoObj;
    if (
      data.paymentTerms &&
      data.paymentTerms !== "Sight LC" &&
      data.extraInfo
    ) {
      extraInfoObj = { days: days, other: data.extraInfo.other };
    }

    let reqData;
    const baseData = {
      issuingBanks: data.issuingBanks,
      type: "LC Discounting",
      transhipment:
        data.transhipment === "yes"
          ? true
          : data.transhipment === "no"
          ? false
          : null,
      amount: {
        price: `${data.amount}.00`,
      },
      attachments: data.attachments,
      period: {
        ...data.period,
        expectedDate:
          data.period?.expectedDate === "yes"
            ? true
            : data.period?.expectedDate === "no"
            ? false
            : null,
      },
      ...(extraInfoObj && { extraInfo: extraInfoObj }),
    };

    if (baseData.issuingBanks?.[0]._id) delete baseData.issuingBanks[0]._id;
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
      console.log(reqData, "reqData Discounting");
      reqData.currency = reqData.currency ?? "USD";
      setLoader(true);
      const { response, success } = discountingData?._id
        ? await onUpdateLC({
            payload: reqData,
            id: discountingData?._id,
          })
        : await onCreateLC(reqData);
      setLoader(false);
      if (!success) return toast.error(response);
      else {
        toast.success("LC saved as draft");
        router.push("/");
        reset();
        setValues(getStateValues(useDiscountingStore.getInitialState()));
        queryClient.invalidateQueries({
          queryKey: ["fetch-lcs-drafts"],
        });
      }
    } else {
      const lcStartDateString = data.period?.startDate;
      const lcEndDateString = data.period?.endDate;
      const expectedDateString = data?.expectedDiscountingDate;
      const lcStartDate = lcStartDateString
        ? new Date(lcStartDateString)
        : null;
      const lcEndDate = lcEndDateString ? new Date(lcEndDateString) : null;
      const expectedDiscountingDate = expectedDateString
        ? new Date(expectedDateString)
        : null;
      const preparedData = {
        ...data,
        period: {
          ...data.period,
          startDate: lcStartDate,
          endDate: lcEndDate,
        },
        expectedDiscountingDate: expectedDiscountingDate,
        exporterInfo: {
          ...data.exporterInfo,
          bank: "Something",
        },
      };
      preparedData.currency = preparedData.currency ?? "USD";
      try {
        const validatedData = await discountingSchema.validate(preparedData, {
          abortEarly: false,
          stripUnknown: true,
        });

        if (isProceed) {
          const { confirmingBank2, extraInfo, ...rest } = validatedData;
          reqData = {
            ...rest,
            ...baseData,
            draft: false,
          };
          startLoading();
          const { response, success } = discountingData?._id
            ? await onUpdateLC({
                payload: reqData,
                id: discountingData?._id,
              })
            : await onCreateLC(reqData);
          stopLoading();
          if (!success) return toast.error(response);
          else {
            setValues(getStateValues(useDiscountingStore.getInitialState()));
            toast.success("LC created successfully");
            router.push("/");
            reset();
          }
        } else {
          let openDisclaimerBtn = document.getElementById("open-disclaimer");
          openDisclaimerBtn?.click();
        }
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          error.errors.forEach((errMessage) => {
            toast.error(errMessage);
          });
        } else {
          console.error("Unexpected error during validation:", error);
        }
      }
    }
  };

  const countryNames = bankCountries.map((country) => country.name);
  const countryFlags = bankCountries.map((country) => country.flag);

  const { countries, flags } = useCountries();

  // reset the form on page navigation
  useEffect(() => {
    const handleRouteChange = () => {
      setValues(getStateValues(useDiscountingStore.getInitialState()));
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
      <form className="mt-4 flex w-full flex-col gap-y-5 rounded-lg border border-borderCol bg-white px-3 py-4">
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
          isDiscount
        />

        <Step4
          register={register}
          setValue={setValue}
          countries={countries}
          flags={flags}
          setStepCompleted={handleStepCompletion}
          watch={watch}
        />
        <Step5
          register={register}
          countries={countries}
          flags={flags}
          setValue={setValue}
          watch={watch}
          setStepCompleted={handleStepCompletion}
        />

        <div className="relative flex h-full w-full items-start gap-x-4">
          <Step6
            watch={watch}
            register={register}
            title="Discounting Info"
            isDiscount
            setValue={setValue}
            setStepCompleted={handleStepCompletion}
          />
          <div className="min-w-[50%] flex flex-col gap-5">
            <Step7
              register={register}
              setValue={setValue}
              step={7}
              setStepCompleted={handleStepCompletion}
            />
            <LgStep12
              register={register}
              setValue={setValue}
              step={8}
              setStepCompleted={handleStepCompletion}
              watch={watch}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full items-center gap-x-4">
          <Button
            // onClick={handleSubmit(saveAsDraft)}
            onClick={handleSubmit((data) => onSubmit({ data, isDraft: true }))}
            type="button"
            variant="ghost"
            className="w-1/3 !bg-[#F1F1F5]"
            disabled={loader}
          >
            {loader ? <Loader /> : "Save as draft"}
          </Button>
          <Button
            type="button"
            disabled={isLoading}
            size="lg"
            className="w-2/3 bg-primaryCol text-white hover:bg-primaryCol/90"
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

export default CreateDiscountPage;
