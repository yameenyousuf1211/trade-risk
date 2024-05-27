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
import { BgRadioInput } from "@/components/LCSteps/helpers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  DiscountBanks,
  Period,
  Transhipment,
} from "@/components/LCSteps/Step3Helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { onCreateLC, onUpdateLC } from "@/services/apis/lcs.api";
import { usePathname, useRouter } from "next/navigation";
import { confirmationDiscountSchema } from "@/validation/lc.validation";
import Loader from "@/components/ui/loader";
import useLoading from "@/hooks/useLoading";
import { getCountries, getCurrenncy } from "@/services/apis/helpers.api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Country } from "@/types/type";
import { DisclaimerDialog, NumberInput } from "@/components/helpers";
import useConfirmationDiscountingStore, {
  getStateValues,
} from "@/store/confirmationDiscounting.store";
import useStepStore from "@/store/lcsteps.store";
import { bankCountries } from "@/utils/data";
import { sendNotification } from "@/services/apis/notifications.api";
import { calculateDaysLeft } from "@/utils";

const ConfirmationPage = () => {
  const {
    register,
    setValue,
    getValues,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof confirmationDiscountSchema>>({
    resolver: zodResolver(confirmationDiscountSchema),
  });

  const queryClient = useQueryClient();
  const { startLoading, stopLoading, isLoading } = useLoading();
  const router = useRouter();
  const pathname = usePathname();

  const [valueChanged, setValueChanged] = useState<boolean>(false);
  const [days, setDays] = useState<number>(1);

  const setValues = useConfirmationDiscountingStore((state) => state.setValues);
  const confirmationData = useConfirmationDiscountingStore((state) => state);
  const { setStepStatus } = useStepStore();

  useEffect(() => {
    if (confirmationData && confirmationData?._id) {
      Object.entries(confirmationData).forEach(([key, value]) => {
        // @ts-ignore
        setValue(key, value);
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
  }, [confirmationData]);

  // Show errors
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

  const onSubmit: SubmitHandler<
    z.infer<typeof confirmationDiscountSchema>
  > = async (data: z.infer<typeof confirmationDiscountSchema>) => {
    if (proceed) {
      if (
        data.confirmingBank &&
        data.issuingBank.country === data.confirmingBank.country
      )
        return toast.error(
          "Confirming bank country cannot be the same as issuing bank country"
        );
      if (/^\d+$/.test(data.productDescription))
        return toast.error("Product description cannot contain only digits");
      // startLoading();
      const currentDate = new Date();
      const futureDate = new Date(
        currentDate.setDate(currentDate.getDate() + days)
      );

      let extraInfo;
      if (data.paymentTerms === "usance-lc") {
        extraInfo = { dats: futureDate, other: data.extraInfo };
      }

      const { confirmingBank2, ...rest } = data;
      const reqData = {
        ...rest,
        transhipment: data.transhipment === "yes" ? true : false,
        lcType: "LC Confirmation & Discounting",
        lcPeriod: {
          ...data.lcPeriod,
          expectedDate: data.lcPeriod.expectedDate === "yes" ? true : false,
        },
        ...(extraInfo && { extraInfo }),
      };
      console.log(reqData);
      // const { response, success } = confirmationData?._id
      //   ? await onUpdateLC({
      //       payload: reqData,
      //       id: confirmationData?._id,
      //     })
      //   : await onCreateLC(reqData);
      // stopLoading();
      // if (!success) return toast.error(response);
      // else {
      //   toast.success("LC created successfully");
      //   setValues(
      //     getStateValues(useConfirmationDiscountingStore.getInitialState())
      //   );
      //   // await sendNotification({
      //   //   title: "New LC Confirmation & Discounting Request",
      //   //   body: `Ref no ${response.data.refId} from ${response.data.issuingBank.bank} by ${user.name}`,
      //   // });
      //   reset();
      //   router.push("/");
      // }
    } else {
      let openDisclaimerBtn = document.getElementById("open-disclaimer");
      // @ts-ignore
      openDisclaimerBtn.click();
      setProceed(true);
    }
  };

  const [loader, setLoader] = useState(false);

  const saveAsDraft: SubmitHandler<
    z.infer<typeof confirmationDiscountSchema>
  > = async (data: z.infer<typeof confirmationDiscountSchema>) => {
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

    const currentDate = new Date();
    const futureDate = new Date(
      currentDate.setDate(currentDate.getDate() + days)
    );

    let extraInfo;
    if (data.paymentTerms === "usance-lc") {
      extraInfo = { dats: futureDate, other: data.extraInfo };
    }

    const { confirmingBank2, ...rest } = data;
    const reqData = {
      ...rest,
      transhipment: data.transhipment === "yes" ? true : false,
      lcType: "LC Confirmation & Discounting",
      lcPeriod: {
        ...data.lcPeriod,
        expectedDate: data.lcPeriod.expectedDate === "yes" ? true : false,
      },
      ...(extraInfo && { extraInfo }),
      isDraft: "true",
    };
    console.log(reqData);
    // const { response, success } = confirmationData?._id
    //   ? await onUpdateLC({
    //       payload: reqData,
    //       id: confirmationData?._id,
    //     })
    //   : await onCreateLC(reqData);

    // setLoader(false);
    // if (!success) return toast.error(response);
    // else {
    //   toast.success("LC saved as draft");
    //   setValues(
    //     getStateValues(useConfirmationDiscountingStore.getInitialState())
    //   );
    //   reset();
    //   router.push("/");
    //   queryClient.invalidateQueries({
    //     queryKey: ["fetch-lcs-drafts"],
    //   });
    // }
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
      setValues(
        getStateValues(useConfirmationDiscountingStore.getInitialState())
      );
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
          type="discount"
          setStepCompleted={handleStepCompletion}
          register={register}
        />
        <Step2
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
          register={register}
          setValue={setValue}
          countries={countryNames}
          getValues={getValues}
          flags={countryFlags}
          valueChanged={valueChanged}
          setValueChanged={setValueChanged}
          setStepCompleted={handleStepCompletion}
        />
        <Step4
          register={register}
          countries={countries}
          setValue={setValue}
          getValues={getValues}
          flags={flags}
          valueChanged={valueChanged}
          setValueChanged={setValueChanged}
          setStepCompleted={handleStepCompletion}
        />
        <Step5
          register={register}
          isConfirmation
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
            register={register}
            title="Confirmation Info"
            getValues={getValues}
            setValue={setValue}
            setStepCompleted={handleStepCompletion}
            valueChanged={valueChanged}
          />
          <Step7Disounting
            getValues={getValues}
            setValue={setValue}
            register={register}
            valueChanged={valueChanged}
          />
        </div>
        <Step7 register={register} step={8} />

        {/* Action Buttons */}
        <div className="flex items-center gap-x-4 w-full">
          <Button
            type="button"
            onClick={handleSubmit(saveAsDraft)}
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

export default ConfirmationPage;
