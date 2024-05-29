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
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { discountingSchema } from "@/validation/lc.validation";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { onCreateLC, onUpdateLC } from "@/services/apis/lcs.api";
import { usePathname, useRouter } from "next/navigation";
import useLoading from "@/hooks/useLoading";
import Loader from "@/components/ui/loader";
import { getCountries } from "@/services/apis/helpers.api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Country } from "@/types/type";
import { DisclaimerDialog } from "@/components/helpers";
import useDiscountingStore, { getStateValues } from "@/store/discounting.store";
import useStepStore from "@/store/lcsteps.store";
import { bankCountries } from "@/utils/data";
import { sendNotification } from "@/services/apis/notifications.api";
import { calculateDaysLeft } from "@/utils";

const CreateDiscountPage = () => {
  const {
    register,
    setValue,
    getValues,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof discountingSchema>>({
    // resolver: zodResolver(discountingSchema),
  });

  const queryClient = useQueryClient();

  const { startLoading, stopLoading, isLoading } = useLoading();
  const router = useRouter();
  const pathname = usePathname();
  const [valueChanged, setValueChanged] = useState<boolean>(false);
  const [days, setDays] = useState<number>(1);

  // Edit Request
  const setValues = useDiscountingStore((state) => state.setValues);
  const discountingData = useDiscountingStore((state) => state);
  const { setStepStatus } = useStepStore(); // Access setStepStatus

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
        if (key === "lcPeriod.expectedDate") {
          setValue(key, value === true ? "yes" : "no");
        }
        if (key === "extraInfo") {
          const daysLeft = calculateDaysLeft(value.dats);
          setDays(daysLeft);
          setValue("extraInfo", value.other);
        }
      });
    }
    setValueChanged(!valueChanged);
  }, [discountingData]);

  // Showing errors
  useEffect(() => {
    if (errors) {
      const showNestedErrors = (errorsObj: any, parentKey = "") => {
        Object.keys(errorsObj)
          .reverse()
          .forEach((key) => {
            const errorMessage =
              errorsObj[key as keyof typeof errorsObj]?.message;

            if (errorMessage) {
              // const fieldName = parentKey ? `${parentKey}.${key}` : key;
              toast.error(`${errorMessage}`);
            } else if (typeof errorsObj[key] === "object") {
              showNestedErrors(errorsObj[key], key);
            }
          });
      };

      showNestedErrors(errors);
    }
  }, [errors]);

  const [proceed, setProceed] = useState(false);

  const onSubmit: SubmitHandler<z.infer<typeof discountingSchema>> = async (
    data
  ) => {
    const validationResult = discountingSchema.safeParse(data);
    if (validationResult.success) {
      if (proceed) {
        if (data.paymentTerms === "Usance LC" && !days)
          return toast.error("Please select days from");

        const currentDate = new Date();
        const futureDate = new Date(
          currentDate.setDate(currentDate.getDate() + days)
        );
        if (
          data.confirmingBank &&
          data.issuingBank.country === data.confirmingBank.country
        )
          return toast.error(
            "Confirming bank country cannot be the same as issuing bank country"
          );
        if (/^\d+$/.test(data.productDescription))
          return toast.error("Product description cannot contain only digits");
        startLoading();
        let extraInfo;
        if (data.paymentTerms === "Usance LC") {
          extraInfo = { dats: futureDate, other: data.extraInfo };
        }

        const { confirmingBank2, ...rest } = data;
        const reqData = {
          ...rest,
          currency: data?.currency ? data?.currency : "usd",
          transhipment: data.transhipment === "yes" ? true : false,
          lcType: "LC Discounting",
          lcPeriod: {
            ...data.lcPeriod,
            expectedDate: data.lcPeriod.expectedDate === "yes" ? true : false,
          },
          ...(extraInfo && { extraInfo }),
        };
        // @ts-ignore
        delete reqData._id;
        // @ts-ignore
        delete reqData.refId;
        // @ts-ignore
        delete reqData.createdBy;
        // @ts-ignore
        delete reqData.status;
        // @ts-ignore
        delete reqData.createdAt;
        // @ts-ignore
        delete reqData.updatedAt;

        const { response, success } = discountingData?._id
          ? await onUpdateLC({
              payload: reqData,
              id: discountingData?._id,
            })
          : await onCreateLC(reqData);
        stopLoading();
        if (!success) return toast.error(response);
        else {
          toast.success("LC created successfully");
          setValues(getStateValues(useDiscountingStore.getInitialState()));
          // await sendNotification({
          //   title: "New LC Discounting Request",
          //   body: `Ref no ${response.data.refId} from ${response.data.issuingBank.bank} by ${user.name}`,
          // });
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
      if (validationResult.error && validationResult.error.errors.length > 0) {
        validationResult.error.errors.forEach((error) => {
          toast.error(`Validation Error: ${error.message}`);
        });
      }
    }
  };

  const [loader, setLoader] = useState(false);

  const saveAsDraft: SubmitHandler<z.infer<typeof discountingSchema>> = async (
    data: z.infer<typeof discountingSchema>
  ) => {
    if (data.paymentTerms === "Usance LC" && !days)
      return toast.error("Please select days from");
    const currentDate = new Date();
    const futureDate = new Date(
      currentDate.setDate(currentDate.getDate() + days)
    );
    if (
      data.confirmingBank &&
      data.issuingBank.country === data.confirmingBank.country
    )
      return toast.error(
        "Confirming bank country cannot be the same as issuing bank country"
      );
    if (/^\d+$/.test(data.productDescription))
      return toast.error("Product description cannot contain only digits");
    setLoader(true);
    let extraInfo;
    if (data.paymentTerms === "Usance LC") {
      extraInfo = { dats: futureDate, other: data.extraInfo };
    }
    const { confirmingBank2, ...rest } = data;

    const reqData = {
      ...rest,
      currency: data?.currency ? data?.currency : "usd",
      transhipment: data.transhipment === "yes" ? true : false,
      lcType: "LC Discounting",
      lcPeriod: {
        ...data.lcPeriod,
        expectedDate: data.lcPeriod.expectedDate === "yes" ? true : false,
      },
      ...(extraInfo && { extraInfo }),
      draft: "true",
    };
    console.log(reqData, "REQDATA");

    // @ts-ignore
    delete reqData._id;
    // @ts-ignore
    delete reqData.refId;
    // @ts-ignore
    delete reqData.createdBy;
    // @ts-ignore
    delete reqData.status;
    // @ts-ignore
    delete reqData.createdAt;
    // @ts-ignore
    delete reqData.updatedAt;
    // @ts-ignore
    delete reqData?.selectBaseRate;

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
      setValues(getStateValues(useDiscountingStore.getInitialState()));
      reset();
      router.push("/");
      queryClient.invalidateQueries({
        queryKey: ["fetch-lcs-drafts"],
      });
    }
  };
  const [allCountries, setAllCountries] = useState<Country[]>([]);
  const [countries, setCountries] = useState([]);
  const [flags, setFlags] = useState([]);

  const countryNames = bankCountries.map((country) => country.name);
  const countryFlags = bankCountries.map((country) => country.flag);

  const { data: countriesData } = useQuery({
    queryKey: ["countries"],
    queryFn: () => getCountries(),
  });

  useEffect(() => {
    if (
      countriesData &&
      countriesData.success &&
      countriesData.response &&
      countriesData.response.length > 0
    ) {
      setAllCountries(countriesData.response);
      const fetchedCountries = countriesData.response.map(
        (country: Country) => {
          return country.name;
        }
      );
      setCountries(fetchedCountries);
      const fetchedFlags = countriesData.response.map((country: Country) => {
        return country.flag;
      });
      setFlags(fetchedFlags);
    }
  }, [countriesData]);

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
          getValues={getValues}
          valueChanged={valueChanged}
          setValueChanged={setValueChanged}
          setStepCompleted={handleStepCompletion}
          days={days}
          setDays={setDays}
        />
        <Step3
          watch={watch}
          register={register}
          setValue={setValue}
          countries={countryNames}
          getValues={getValues}
          flags={countryFlags}
          valueChanged={valueChanged}
          setValueChanged={setValueChanged}
          setStepCompleted={handleStepCompletion}
          isDiscount
        />

        <Step4
          register={register}
          setValue={setValue}
          countries={countries}
          getValues={getValues}
          flags={flags}
          valueChanged={valueChanged}
          setValueChanged={setValueChanged}
          setStepCompleted={handleStepCompletion}
        />
        <Step5
          register={register}
          countries={countries}
          flags={flags}
          setValue={setValue}
          getValues={getValues}
          valueChanged={valueChanged}
          setValueChanged={setValueChanged}
          setStepCompleted={handleStepCompletion}
        />

        <div className="flex items-start gap-x-4 h-full w-full relative">
          <Step6
            watch={watch}
            register={register}
            title="Discounting Info"
            isDiscount
            setValue={setValue}
            getValues={getValues}
            valueChanged={valueChanged}
            setStepCompleted={handleStepCompletion}
          />
          <Step7 register={register} step={7} />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-x-4 w-full">
          <Button
            onClick={handleSubmit(saveAsDraft)}
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
            onClick={handleSubmit(onSubmit)}
          >
            {isLoading ? <Loader /> : "Submit request"}
          </Button>
        </div>
        <DisclaimerDialog
          title="Submit Request"
          className="hidden"
          setProceed={setProceed}
          onAccept={handleSubmit(onSubmit)}
        />
      </form>
    </CreateLCLayout>
  );
};

export default CreateDiscountPage;
