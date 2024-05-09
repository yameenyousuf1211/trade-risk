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
import { RadioInput } from "@/components/LCSteps/helpers";
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
import { useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { onCreateLC } from "@/services/apis/lcs.api";
import { useRouter } from "next/navigation";
import { confirmationDiscountSchema } from "@/validation/lc.validation";
import Loader from "@/components/ui/loader";
import useLoading from "@/hooks/useLoading";
import { getCountries } from "@/services/apis/helpers.api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const ConfirmationPage = () => {
  const {
    register,
    setValue,
    getValues,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof confirmationDiscountSchema>>({
    resolver: zodResolver(confirmationDiscountSchema),
  });

  const queryClient = useQueryClient();

  const { startLoading, stopLoading, isLoading } = useLoading();
  const router = useRouter();
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
              const fieldName = parentKey ? `${parentKey}.${key}` : key;
              toast.error(`${fieldName}: ${errorMessage}`);
            } else if (typeof errorsObj[key] === "object") {
              showNestedErrors(errorsObj[key], key);
            }
          });
      };

      showNestedErrors(errors);
    }
  }, [errors]);

  const onSubmit: SubmitHandler<
    z.infer<typeof confirmationDiscountSchema>
  > = async (data: z.infer<typeof confirmationDiscountSchema>) => {
    startLoading();
    const reqData = {
      ...data,
      transhipment: data.transhipment === "yes" ? true : false,
      lcType: "LC Confirmation & Discounting",
    };

    const { response, success } = await onCreateLC(reqData);
    stopLoading();
    if (!success) return toast.error(response);
    else {
      toast.success(response?.message);
      reset();
      router.push("/");
    }
  };

  const saveAsDraft: SubmitHandler<
    z.infer<typeof confirmationDiscountSchema>
  > = async (data: z.infer<typeof confirmationDiscountSchema>) => {
    startLoading();
    const reqData = {
      ...data,
      transhipment: data.transhipment === "yes" ? true : false,
      lcType: "LC Confirmation & Discounting",
      isDraft: "true",
    };
    const { response, success } = await onCreateLC(reqData);
    stopLoading();
    if (!success) return toast.error(response);
    else {
      toast.success("LC saved as draft");
      reset();
      queryClient.invalidateQueries({
        queryKey: ["fetch-lcs-drafts"],
      });
    }
  };

  const handleSelectChange = (value: string) => {
    register("currency", { value: value });
  };

  const { data: countries, isLoading: countriesLoading } = useQuery({
    queryKey: ["countries"],
    queryFn: () => getCountries(),
  });

  return (
    <CreateLCLayout>
      <form className="border border-borderCol py-4 px-3 w-full flex flex-col gap-y-5 mt-4 rounded-lg bg-white">
        <Step1 register={register} />
        {/* Step 2 */}
        <div className="py-3 px-2 border border-borderCol rounded-lg w-full">
          <div className="flex items-center gap-x-2 justify-between mb-3">
            <div className="flex items-center gap-x-2 ml-3">
              <p className="size-6 rounded-full bg-primaryCol center text-white font-semibold">
                2
              </p>
              <p className="font-semibold text-lg text-lightGray">Amount</p>
            </div>
            <div className="flex items-center gap-x-2">
              <Select onValueChange={handleSelectChange}>
                <SelectTrigger className="w-[100px] bg-borderCol/80">
                  <SelectValue placeholder="USD" defaultValue="USD" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="PKR">PKR</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="text"
                register={register}
                name="amount"
                className="border border-borderCol focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>

          <div className="border border-borderCol px-2 py-3 rounded-md bg-[#F5F7F9]">
            <h5 className="font-semibold ml-3">LC Payment Terms</h5>
            <div className="flex items-center gap-x-3 w-full mt-2">
              <RadioInput
                id="payment-sight"
                label="Sight LC"
                name="paymentTerms"
                register={register}
                value="sight-lc"
              />
              <RadioInput
                id="payment-usance"
                label="Usance LC"
                name="paymentTerms"
                value="usance-lc"
                register={register}
              />
              <RadioInput
                id="payment-deferred"
                label="Deferred LC"
                name="paymentTerms"
                value="deferred-lc"
                register={register}
              />
              <RadioInput
                id="payment-upas"
                label="UPAS LC (Usance payment at sight)"
                name="paymentTerms"
                value="upas-lc"
                register={register}
              />
            </div>
          </div>
        </div>
        {/* Step 3 */}
        <div className="py-3 px-2 border border-borderCol rounded-lg w-full">
          <div className="flex items-center gap-x-2 ml-3 mb-3">
            <p className="size-6 rounded-full bg-primaryCol center text-white font-semibold">
              3
            </p>
            <p className="font-semibold text-lg text-lightGray">LC Details</p>
          </div>
          <DiscountBanks
            countries={countries?.response}
            setValue={setValue}
            getValues={getValues}
          />
          {/* Period */}
          <Period setValue={setValue} getValues={getValues} />
          {/* Transhipment */}
          <Transhipment register={register} setValue={setValue} />
        </div>

        <Step4
          register={register}
          countries={countries?.response}
          setValue={setValue}
        />
        <Step5
          register={register}
          isConfirmation
          countries={countries?.response}
          setValue={setValue}
        />

        <div className="flex items-start gap-x-4 h-full w-full relative">
          <Step6
            register={register}
            title="Confirmation Info"
            getValues={getValues}
            setValue={setValue}
          />
          <Step7Disounting
            getValues={getValues}
            setValue={setValue}
            register={register}
          />
        </div>
        <Step7 register={register} step={8} />

        {/* Action Buttons */}
        <div className="flex items-center gap-x-4 w-full">
          <Button
            type="button"
            onClick={handleSubmit(saveAsDraft)}
            disabled={isLoading}
            variant="ghost"
            className="bg-none w-1/3"
          >
            {isLoading ? <Loader /> : "Save as draft"}
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
        {/* <DisclaimerDialog /> */}
      </form>
    </CreateLCLayout>
  );
};

export default ConfirmationPage;
