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
import { z } from "zod";
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
import { sendNotification } from "@/services/apis/notifications.api";
import { calculateDaysLeft } from "@/utils";
import useCountries from "@/hooks/useCountries";
import { useAuth } from "@/context/AuthProvider";

const CreateRequestPage = () => {
  const { user } = useAuth();
  const { register, setValue, reset, watch, handleSubmit } = useForm<
    z.infer<typeof confirmationSchema>
  >({});

  const { startLoading, stopLoading, isLoading } = useLoading();
  const router = useRouter();
  const pathname = usePathname();
  const [days, setDays] = useState<number>(1);

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
          const daysLeft = calculateDaysLeft(value.dats);
          setDays(daysLeft);
          setValue("extraInfo", value.other);
        }
      });
    }
  }, [confirmationData]);

  const [proceed, setProceed] = useState(false);

  const [loader, setLoader] = useState(false);

  const onSubmit: SubmitHandler<z.infer<typeof confirmationSchema>> = async ({
    data,
    isDraft,
    isProceed = false,
  }: {
    isDraft: boolean;
    data: any;
    isProceed?: boolean;
  }) => {
    submit();
    if (
      data.confirmingBank &&
      data.issuingBank.country === data.confirmingBank.country
    )
      return toast.error(
        "Confirming bank country cannot be the same as issuing bank country"
      );
    if (/^\d+$/.test(data.productDescription))
      return toast.error("Product description cannot contain only digits");
    if (data.period?.startDate > data.period?.endDate)
      return toast.error("LC Issuance date cannot be greater than expiry date");
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
      type: "LC Confirmation",
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
    console.log("🚀 ~ CreateRequestPage ~ baseData:", baseData)

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
      console.log(reqData, "REQDAATA");

      setLoader(true);
      const { response, success } = confirmationData?._id
        ? await onUpdateLC({
            payload: reqData,
            id: confirmationData?._id,
          })
        : await onCreateLC(reqData);
        console.log("🚀 ~ CreateRequestPage ~ response:", response)
      setLoader(false);
      if (!success) return toast.error(response);
      else {
        toast.success("LC saved as draft");
        reset();
        router.push("/");
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
        period: {
          ...data.period,
          startDate: lcStartDate,
          endDate: lcEndDate,
        },
        expectedConfirmationDate,
      };
      const validationResult = confirmationSchema.safeParse(preparedData);
      console.log("🚀 ~ CreateRequestPage ~ preparedData:", preparedData)
      console.log("🚀 ~ CreateRequestPage ~ validationResult:", validationResult)
      if (validationResult.success) {
        const validatedData = validationResult.data;
        if (isProceed) {
          const { confirmingBank2, extraInfo, ...rest } = validatedData;
          reqData = {
            ...rest,
            ...baseData,
          };
          startLoading();
          const { response, success } = confirmationData?._id
            ? await onUpdateLC({
                payload: reqData,
                id: confirmationData?._id,
              })
            : await onCreateLC(reqData);
          stopLoading();
          if (!success) return toast.error(response);
          else {
            console.log(response?.data?._id, "hi response");
            const notificationResp = await sendNotification({
              role: "bank",
              title: `New LC Confirmation Request ${response?.data?._id}`,
              body: `Ref no ${response.data.refId} from ${response.data.issuingBank.bank} by ${user?.name}`,
            });
            console.log(notificationResp);
            setValues(getStateValues(useConfirmationStore.getInitialState()));
            toast.success("LC created successfully");
            reset();
            router.push("/");
          }
        } else {
          let openDisclaimerBtn = document.getElementById("open-disclaimer");
          // @ts-ignore
          openDisclaimerBtn.click();
          console.log("hellooooojeee asssalamualaikum");
          // setProceed(true);
        }
      } else {
        if (
          validationResult.error &&
          validationResult.error.errors.length > 0
        ) {
          validationResult.error.errors.forEach((error) => {
            toast.error(`${error.message}`);
          });
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
          <Step7
            register={register}
            step={7}
            setStepCompleted={handleStepCompletion}
          />
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
