"use client";
import CreateLCLayout from "@/components/layouts/CreateLCLayout";
import { Button } from "@/components/ui/button";
import { DisclaimerDialog } from "@/components/helpers";
import {
  Step1,
  Step2,
  Step3,
  Step4,
  Step5,
  Step6,
  Step7,
} from "@/components/LCSteps";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { onCreateLC, onUpdateLC } from "@/services/apis/lcs.api";
import { confirmationSchema } from "@/validation/lc.validation";
import useLoading from "@/hooks/useLoading";
import Loader from "../../components/ui/loader";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import useConfirmationStore, { getStateValues } from "@/store/lc.store";
import useStepStore from "@/store/lcsteps.store";
import { bankCountries } from "@/utils/data";
import { calculateDaysLeft } from "@/utils";
import useCountries from "@/hooks/useCountries";
import { useAuth } from "@/context/AuthProvider";
import * as Yup from "yup";
import LgStep12 from "@/components/LG-Steps/LgStep12";

const CreateRequestPage = () => {
  const { user } = useAuth();
  const { register, setValue, reset, watch, handleSubmit } = useForm({});

  const { startLoading, stopLoading, isLoading } = useLoading();
  const router = useRouter();
  const pathname = usePathname();
  const [days, setDays] = useState<number>(90);

  const queryClient = useQueryClient();
  const setValues = useConfirmationStore((state) => state.setValues);
  const confirmationData = useConfirmationStore((state) => state);
  const { setStepStatus, submit } = useStepStore();

  useEffect(() => {
    if (confirmationData && confirmationData?._id) {
      Object.entries(confirmationData).forEach(([key, value]) => {
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
  }, [confirmationData]);

  const [proceed, setProceed] = useState(false);
  const [loader, setLoader] = useState(false);

  const onSubmit: SubmitHandler<typeof confirmationSchema> = async ({
    data,
    isDraft,
    isProceed = false,
  }: {
    isDraft: boolean;
    data: any;
    isProceed?: boolean;
  }) => {
    console.log(data.paymentTerms, "data");
    submit();
    delete data.createdBy;
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
    if (data.period?.startDate > data.period?.endDate)
      return toast.error("LC Issuance date cannot be greater than expiry date");

    let extraInfoObj;
    if (
      data.paymentTerms &&
      data.paymentTerms !== "Sight LC" &&
      data.extraInfo
    ) {
      console.log("something");
      extraInfoObj = { days: days, other: data.extraInfo.other };
    }
    console.log(extraInfoObj, "extraInfoObj");
    let reqData;
    const baseData = {
      issuingBanks: data.issuingBanks, // Handle the array of issuing banks
      type: "LC Confirmation",
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
    console.log(baseData, "baseData");
    if (baseData?.issuingBanks?.[0]?._id) delete baseData.issuingBanks[0]._id;
    try {
      setLoader(true); // Start the loader
      startLoading(); // Start the general loading state

      if (isDraft) {
        const {
          confirmingBank2,
          _id,
          refId,
          status,
          createdAt,
          updatedAt,
          ...rest
        } = data;
        reqData = {
          ...rest,
          ...(extraInfoObj && { extraInfo: extraInfoObj }),
          ...baseData,
          draft: true,
        };
        console.log(reqData, "REQDATA_______FOR CONFIRMATION");
        const { response, success } = confirmationData?._id
          ? await onUpdateLC({
              payload: reqData,
              id: confirmationData?._id,
            })
          : await onCreateLC(reqData);

        if (!success) {
          toast.error(response);
        } else {
          toast.success("LC saved as draft");
          router.push("/");
          reset();
          setValues(getStateValues(useConfirmationStore.getInitialState()));
          queryClient.invalidateQueries({
            queryKey: ["fetch-lcs-drafts"],
          });
        }
      } else {
        const lcStartDateString = data.period?.startDate;
        const lcEndDateString = data.period?.endDate;
        const expectedConfirmationDateString = data?.expectedConfirmationDate;
        const lcStartDate = lcStartDateString
          ? new Date(lcStartDateString)
          : null;
        const lcEndDate = lcEndDateString ? new Date(lcEndDateString) : null;
        const expectedConfirmationDate = expectedConfirmationDateString
          ? new Date(expectedConfirmationDateString)
          : null;
        const preparedData = {
          ...data,
          extraInfo: extraInfoObj,
          period: {
            ...data.period,
            startDate: lcStartDate,
            endDate: lcEndDate,
          },
          expectedConfirmationDate,
        };
        console.log(preparedData, "preparedData");
        try {
          const validatedData = await confirmationSchema.validate(
            preparedData,
            {
              abortEarly: true,
              stripUnknown: true,
            }
          );
          if (isProceed) {
            const { confirmingBank2, extraInfo, ...rest } = validatedData;
            reqData = {
              ...rest,
              ...baseData,
              draft: false,
            };

            const { response, success } = confirmationData?._id
              ? await onUpdateLC({
                  payload: reqData,
                  id: confirmationData?._id,
                })
              : await onCreateLC(reqData);

            if (!success) {
              toast.error(response);
            } else {
              setValues(getStateValues(useConfirmationStore.getInitialState()));
              console.log(response, "response submit request");
              queryClient.invalidateQueries({
                queryKey: ["bid-status"],
              });
              queryClient.invalidateQueries(["fetch-lcs"]);
              toast.success("LC created successfully");
              router.push("/");
              reset();
            }
          } else {
            const openDisclaimerBtn =
              document.getElementById("open-disclaimer");
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
    } catch (error) {
      console.error("Error during LC creation/update:", error);
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
      setValues(getStateValues(useConfirmationStore.getInitialState()));
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
      <form className="border border-borderCol bg-white py-4 px-3 w-full flex flex-col gap-y-5 mt-4 rounded-lg">
        <Step1
          watch={watch}
          register={register}
          setStepCompleted={handleStepCompletion}
        />
        <Step2
          watch={watch}
          register={register}
          setValue={setValue}
          setStepCompleted={handleStepCompletion}
          draftDataId={confirmationData?._id}
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
          setValue={setValue}
          countries={countries}
          flags={flags}
          watch={watch}
          setStepCompleted={handleStepCompletion}
        />
        <Step5
          register={register}
          setValue={setValue}
          countries={countries}
          flags={flags}
          setStepCompleted={handleStepCompletion}
          watch={watch}
        />
        <div className="flex items-start gap-x-4 h-full w-full relative">
          <Step6
            watch={watch}
            register={register}
            setValue={setValue}
            setStepCompleted={handleStepCompletion}
            title="Confirmation Charges"
          />
          <div className="min-w-[50%] flex flex-col gap-5">
            <Step7
              register={register}
              setValue={setValue}
              watch={watch}
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
        <div className="flex items-center gap-x-4 w-full">
          <Button
            onClick={handleSubmit((data) => onSubmit({ data, isDraft: true }))}
            type="button"
            variant="ghost"
            className="!bg-[#F1F1F5] w-1/3"
            disabled={loader}
          >
            {loader ? <Loader /> : "Save as draft"}
          </Button>
          <Button
            type="button"
            size="lg"
            disabled={isLoading}
            className="bg-primaryCol hover:bg-primaryCol/90 text-white w-2/3"
            onClick={handleSubmit((data) => onSubmit({ data, isDraft: false }))}
          >
            {isLoading ? <Loader /> : "Submit request"}
          </Button>
        </div>
        <DisclaimerDialog
          title="Submit Request"
          className="hidden"
          setProceed={setProceed}
          onAccept={handleSubmit((data) =>
            onSubmit({ data, isDraft: false, isProceed: true })
          )}
        />
      </form>
    </CreateLCLayout>
  );
};

export default CreateRequestPage;
