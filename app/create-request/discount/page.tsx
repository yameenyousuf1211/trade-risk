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
import { sendNotification } from "@/services/apis/notifications.api";
import { calculateDaysLeft } from "@/utils";
import useCountries from "@/hooks/useCountries";

const CreateDiscountPage = () => {
  const { register, setValue, reset, handleSubmit, watch } = useForm<
    z.infer<typeof discountingSchema>
  >({});

  const queryClient = useQueryClient();

  const { startLoading, stopLoading, isLoading } = useLoading();
  const router = useRouter();
  const pathname = usePathname();
  const [days, setDays] = useState<number>(1);

  // Edit Request
  const setValues = useDiscountingStore((state) => state.setValues);
  const discountingData = useDiscountingStore((state) => state);
  const { setStepStatus } = useStepStore();

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
  }, [discountingData]);

  const [proceed, setProceed] = useState(false);

  // const onSubmit: SubmitHandler<z.infer<typeof discountingSchema>> = async (
  //   data
  // ) => {
  //   const validationResult = discountingSchema.safeParse(data);
  //   if (validationResult.success) {
  //     const validatedData = validationResult.data;

  //     if (proceed) {
  //       if (validatedData.paymentTerms === "Usance LC" && !days)
  //         return toast.error("Please select days from");

  //       const currentDate = new Date();
  //       const futureDate = new Date(
  //         currentDate.setDate(currentDate.getDate() + days)
  //       );
  //       if (
  //         validatedData.confirmingBank &&
  //         validatedData.issuingBank.country ===
  //           validatedData.confirmingBank.country
  //       )
  //         return toast.error(
  //           "Confirming bank country cannot be the same as issuing bank country"
  //         );
  //       if (/^\d+$/.test(validatedData.productDescription))
  //         return toast.error("Product description cannot contain only digits");
  //       startLoading();
  //       let extraInfoObj;
  //       if (validatedData.paymentTerms === "Usance LC") {
  //         extraInfoObj = { dats: futureDate, other: validatedData.extraInfo };
  //       }

  //       const { confirmingBank2, ...rest } = validatedData;
  //       const reqData = {
  //         ...rest,
  //         currency: validatedData?.currency ? validatedData?.currency : "usd",
  //         transhipment: validatedData.transhipment === "yes" ? true : false,
  //         amount: {
  //           price: data.amount,
  //         },
  //         type: "LC Discounting",
  //         period: {
  //           ...validatedData.period,
  //           expectedDate:
  //             validatedData.period.expectedDate === "yes" ? true : false,
  //         },
  //         ...(extraInfoObj && { extraInfo: extraInfoObj }),
  //       };
  //       const { response, success } = discountingData?._id
  //         ? await onUpdateLC({
  //             payload: reqData,
  //             id: discountingData?._id,
  //           })
  //         : await onCreateLC(reqData);
  //       stopLoading();
  //       if (!success) return toast.error(response);
  //       else {
  //         toast.success("LC created successfully");
  //         setValues(getStateValues(useDiscountingStore.getInitialState()));
  //         // await sendNotification({
  //         //   title: "New LC Discounting Request",
  //         //   body: `Ref no ${response.data.refId} from ${response.data.issuingBank.bank} by ${user.name}`,
  //         // });
  //         reset();
  //         router.push("/");
  //       }
  //     } else {
  //       let openDisclaimerBtn = document.getElementById("open-disclaimer");
  //       // @ts-ignore
  //       openDisclaimerBtn.click();
  //       setProceed(true);
  //     }
  //   } else {
  //     if (validationResult.error && validationResult.error.errors.length > 0) {
  //       validationResult.error.errors.forEach((error) => {
  //         toast.error(`${error.message}`);
  //       });
  //     }
  //   }
  // };

  // const saveAsDraft: SubmitHandler<z.infer<typeof discountingSchema>> = async (
  //   data: z.infer<typeof discountingSchema>
  // ) => {
  //   if (data.paymentTerms === "Usance LC" && !days)
  //     return toast.error("Please select days from");
  //   const currentDate = new Date();
  //   const futureDate = new Date(
  //     currentDate.setDate(currentDate.getDate() + days)
  //   );
  //   if (
  //     data.confirmingBank &&
  //     data.issuingBank.country === data.confirmingBank.country
  //   )
  //     return toast.error(
  //       "Confirming bank country cannot be the same as issuing bank country"
  //     );
  //   if (/^\d+$/.test(data.productDescription))
  //     return toast.error("Product description cannot contain only digits");
  //   setLoader(true);
  //   let extraInfoObj;
  //   if (data.paymentTerms === "Usance LC") {
  //     extraInfoObj = { dats: futureDate, other: data.extraInfo };
  //   }
  //   const { confirmingBank2, ...rest } = data;

  //   const reqData = {
  //     ...rest,
  //     transhipment: data.transhipment === "yes" ? true : false,
  //     type: "LC Discounting",
  //     amount: {
  //       price: data.amount,
  //     },
  //     period: {
  //       ...data.period,
  //       expectedDate: data.period.expectedDate === "yes" ? true : false,
  //     },
  //     ...(extraInfoObj && { extraInfo: extraInfoObj }),
  //     draft: "true",
  //   };

  //   // @ts-ignore
  //   delete reqData._id;
  //   // @ts-ignore
  //   delete reqData.refId;
  //   // @ts-ignore
  //   delete reqData.createdBy;
  //   // @ts-ignore
  //   delete reqData.status;
  //   // @ts-ignore
  //   delete reqData.createdAt;
  //   // @ts-ignore
  //   delete reqData.updatedAt;
  //   // @ts-ignore
  //   delete reqData?.selectBaseRate;

  //   const { response, success } = discountingData?._id
  //     ? await onUpdateLC({
  //         payload: reqData,
  //         id: discountingData?._id,
  //       })
  //     : await onCreateLC(reqData);

  //   setLoader(false);
  //   if (!success) return toast.error(response);
  //   else {
  //     toast.success("LC saved as draft");
  //     setValues(getStateValues(useDiscountingStore.getInitialState()));
  //     reset();
  //     router.push("/");
  //     queryClient.invalidateQueries({
  //       queryKey: ["fetch-lcs-drafts"],
  //     });
  //   }
  // };

  const [loader, setLoader] = useState(false);

  const onSubmit: SubmitHandler<z.infer<typeof discountingSchema>> = async ({
    data,
    isDraft,
  }: {
    isDraft: boolean;
    data: any;
  }) => {
    if (
      data.confirmingBank &&
      data.issuingBank.country === data.confirmingBank.country
    )
      return toast.error(
        "Confirming bank country cannot be the same as issuing bank country"
      );
    if (/^\d+$/.test(data.productDescription))
      return toast.error("Product description cannot contain only digits");
    const currentDate = new Date();
    const futureDate = new Date(
      currentDate.setDate(currentDate.getDate() + days)
    );
    let extraInfoObj;
    if (
      data.paymentTerms &&
      data.paymentTerms === "Usance LC" &&
      data.extraInfo
    ) {
      extraInfoObj = { dats: futureDate, other: data.extraInfo };
    }

    let reqData;
    const baseData = {
      type: "LC Discounting",
      transhipment: data.transhipment === "yes" ? true : false,
      amount: {
        price: data.amount,
      },
      period: {
        ...data.period,
        expectedDate: data.period?.expectedDate === "yes" ? true : false,
      },
      ...(extraInfoObj && { extraInfo: extraInfoObj }),
    };

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
        reset();
        router.push("/");
        setValues(getStateValues(useDiscountingStore.getInitialState()));
        queryClient.invalidateQueries({
          queryKey: ["fetch-lcs-drafts"],
        });
      }
    } else {
      const lcStartDateString = data.period.startDate;
      const lcEndDateString = data.period.endDate;
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
        expectedDiscountingDate:expectedDiscountingDate,
      };
      console.log(data,preparedData)

      const validationResult = discountingSchema.safeParse(preparedData);
      console.log(validationResult)
      if (validationResult.success) {
        const validatedData = validationResult.data;
        if (proceed) {
          const { confirmingBank2, extraInfo, ...rest } = validatedData;
          reqData = {
            ...rest,
            ...baseData,
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
            // await sendNotification({
            //   title: "New LC Confirmation Request",
            //   body: `Ref no ${response.data.refId} from ${response.data.issuingBank.bank} by ${user.name}`,
            // });
            setValues(getStateValues(useDiscountingStore.getInitialState()));
            toast.success("LC created successfully");
            reset();
            router.push("/");
          }
        } else {
          let openDisclaimerBtn = document.getElementById("open-disclaimer");
          // @ts-ignore
          openDisclaimerBtn.click();
          setProceed(true);
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
      setValues(getStateValues(useDiscountingStore.getInitialState()));
      reset();
      useStepStore.getState().setStepStatus(null, null);
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

        <div className="flex items-start gap-x-4 h-full w-full relative">
          <Step6
            watch={watch}
            register={register}
            title="Discounting Info"
            isDiscount
            setValue={setValue}
          />
          <Step7 register={register} step={7} />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-x-4 w-full">
          <Button
            // onClick={handleSubmit(saveAsDraft)}
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
          onAccept={handleSubmit((data) => onSubmit({ data, isDraft: false }))}
        />
      </form>
    </CreateLCLayout>
  );
};

export default CreateDiscountPage;
