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
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { onCreateLC, onUpdateLC } from "@/services/apis/lcs.api";
import { confirmationSchema } from "@/validation/lc.validation";
import useLoading from "@/hooks/useLoading";
import Loader from "../../components/ui/loader";
import { usePathname, useRouter } from "next/navigation";
import { getCountries } from "@/services/apis/helpers.api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import useConfirmationStore, { getStateValues } from "@/store/lc.store";
import { Country } from "@/types/type";
import useStepStore from "@/store/lcsteps.store";
import { bankCountries } from "@/utils/data";

const CreateRequestPage = () => {
  const {
    register,
    setValue,
    getValues,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof confirmationSchema>>({
    resolver: zodResolver(confirmationSchema),
  });
  const { startLoading, stopLoading, isLoading } = useLoading();
  const router = useRouter();
  const pathname = usePathname();
  const [valueChanged, setValueChanged] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const setValues = useConfirmationStore((state) => state.setValues);
  const confirmationData = useConfirmationStore((state) => state);
  const { setStepStatus } = useStepStore(); // Access setStepStatus
  const stepStatus = useStepStore((state) => state.stepStatus);

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

  const onSubmit: SubmitHandler<z.infer<typeof confirmationSchema>> = async (
    data: z.infer<typeof confirmationSchema>
  ) => {
    if (proceed) {
      if (data.issuingBank.country === data.confirmingBank.country)
        return toast.error(
          "Confirming bank country cannot be the same as issuing bank country"
        );
      startLoading();
      const reqData = {
        ...data,
        lcType: "LC Confirmation",
        transhipment: data.transhipment === "yes" ? true : false,
        shipmentPort: {
          country: data.shipmentPort.country,
          port: "Jeddah",
        },
        lcPeriod: {
          ...data.lcPeriod,
          expectedDate: data.lcPeriod.expectedDate === "yes" ? true : false,
        },
      };
      const { response, success } = confirmationData?._id
        ? await onUpdateLC({
            payload: reqData,
            id: confirmationData?._id,
          })
        : await onCreateLC(reqData);
      stopLoading();
      if (!success) return toast.error(response);
      else {
        setValues(getStateValues(useConfirmationStore.getInitialState()));
        toast.success(response?.message);
        reset();
        router.push("/");
      }
    } else {
      let openDisclaimerBtn = document.getElementById("open-disclaimer");
      // @ts-ignore
      openDisclaimerBtn.click();
      setProceed(true);
    }
  };

  const [loader, setLoader] = useState(false);

  const saveAsDraft: SubmitHandler<z.infer<typeof confirmationSchema>> = async (
    data: z.infer<typeof confirmationSchema>
  ) => {
    if (data.issuingBank.country === data.confirmingBank.country)
      return toast.error(
        "Confirming bank country cannot be the same as issuing bank country"
      );
    setLoader(true);
    const reqData = {
      ...data,
      lcType: "LC Confirmation",
      isDraft: "true",
      transhipment: data.transhipment === "yes" ? true : false,
      shipmentPort: {
        country: data.shipmentPort.country,
        port: "Jeddah",
      },
      lcPeriod: {
        ...data.lcPeriod,
        expectedDate: data.lcPeriod.expectedDate === "yes" ? true : false,
      },
    };

    const { response, success } = confirmationData?._id
      ? await onUpdateLC({
          payload: reqData,
          id: confirmationData?._id,
        })
      : await onCreateLC(reqData);
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
      setValues(getStateValues(useConfirmationStore.getInitialState()));
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
      <form className="border border-borderCol bg-white py-4 px-3 w-full flex flex-col gap-y-5 mt-4 rounded-lg">
        <Step1 register={register} setStepCompleted={handleStepCompletion} />
        <Step2
          register={register}
          setValue={setValue}
          getValues={getValues}
          valueChanged={valueChanged}
          setValueChanged={setValueChanged}
          setStepCompleted={handleStepCompletion}
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
          setValue={setValue}
          countries={countries}
          getValues={getValues}
          flags={flags}
          valueChanged={valueChanged}
          setValueChanged={setValueChanged}
          watch={watch}
          setStepCompleted={handleStepCompletion}
        />
        <Step5
          register={register}
          setValue={setValue}
          countries={countries}
          getValues={getValues}
          flags={flags}
          setStepCompleted={handleStepCompletion}
        />
        <div className="flex items-start gap-x-4 h-full w-full relative">
          <Step6
            register={register}
            setValue={setValue}
            getValues={getValues}
            title="Confirmation Charges"
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
            size="lg"
            disabled={isLoading}
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

export default CreateRequestPage;
