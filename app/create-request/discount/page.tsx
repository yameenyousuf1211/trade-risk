"use client";
import CreateLCLayout from "@/components/layouts/CreateLCLayout";
import { Button } from "@/components/ui/button";
import { Step1, Step4, Step5, Step6, Step7 } from "@/components/LCSteps";
import {
  DiscountBanks,
  Period,
  Transhipment,
} from "@/components/LCSteps/Step3Helpers";
import { RadioInput } from "@/components/LCSteps/helpers";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { discountingSchema } from "@/validation/lc.validation";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { onCreateLC } from "@/services/apis/lcs.api";
import { useRouter } from "next/navigation";
import useLoading from "@/hooks/useLoading";
import Loader from "@/components/ui/loader";
import { getCountries, getCurrenncy } from "@/services/apis/helpers.api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const CreateDiscountPage = () => {
  const {
    register,
    setValue,
    getValues,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof discountingSchema>>({
    resolver: zodResolver(discountingSchema),
  });

  const queryClient = useQueryClient();

  const { startLoading, stopLoading, isLoading } = useLoading();
  const router = useRouter();
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

  const onSubmit: SubmitHandler<z.infer<typeof discountingSchema>> = async (
    data: z.infer<typeof discountingSchema>
  ) => {
    startLoading();
    const reqData = {
      ...data,
      transhipment: data.transhipment === "yes" ? true : false,
      lcType: "LC Discounting",
      extraInfo: {
        dats: new Date("2024-04-28"),
        other: "nothing",
      },
      expectedDiscountingDate: new Date("2024-04-28"),
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

  const [loader, setLoader] = useState(false);

  const saveAsDraft: SubmitHandler<z.infer<typeof discountingSchema>> = async (
    data: z.infer<typeof discountingSchema>
  ) => {
    setLoader(true);
    const reqData = {
      ...data,
      transhipment: data.transhipment === "yes" ? true : false,
      lcType: "LC Discounting",
      extraInfo: {
        dats: new Date("2024-04-28"),
        other: "nothing",
      },
      expectedDiscountingDate: new Date("2024-04-28"),
      isDraft: "true",
    };
    const { response, success } = await onCreateLC(reqData);
    setLoader(false);
    if (!success) return toast.error(response);
    else {
      toast.success("LC saved as draft");
      reset();
      queryClient.invalidateQueries({
        queryKey: ["fetch-lcs-drafts"],
      });
    }
  };

  const { data: countries } = useQuery({
    queryKey: ["countries"],
    queryFn: () => getCountries(),
  });

  const { data: currency } = useQuery({
    queryKey: ["currency"],
    queryFn: () => getCurrenncy(),
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
              <Select onValueChange={(value) => setValue("currency", value)}>
                <SelectTrigger className="w-[100px] bg-borderCol/80">
                  <SelectValue placeholder="USD" />
                </SelectTrigger>
                <SelectContent>
                  {currency &&
                    currency.response.length > 0 &&
                    currency.response.map((curr: string, idx: number) => (
                      <SelectItem key={`${curr}-${idx}`} value={curr}>
                        {curr}
                      </SelectItem>
                    ))}
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
            {/* Days input */}
            <div className="flex items-center gap-x-2 my-3 ml-2">
              <div className="border-b-2 border-black flex items-center">
                <Input
                  placeholder="enter days"
                  register={register}
                  name="ddas"
                  className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 max-w-[150px]"
                />
                <div className="flex items-center gap-x-1">
                  <button
                    type="button"
                    className="rounded-sm border border-para size-6 center"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="rounded-sm border border-para size-6 center"
                  >
                    -
                  </button>
                </div>
              </div>
              <p className="font-semibold">days from</p>
            </div>
            <div className="flex items-center gap-x-3 justify-between">
              <RadioInput
                id="lc-terms-shipment"
                label="BL Date/Shipment Date"
                name="lc-payment-terms-date"
                value=""
                register={register}
              />
              <RadioInput
                id="lc-terms-acceptance"
                label="Acceptance Date"
                name="lc-payment-terms-date"
                value=""
                register={register}
              />
            </div>
            <div className="flex items-center gap-x-3 justify-between">
              <RadioInput
                id="lc-terms-negotiation"
                label="Negotiation Date"
                name="lc-payment-terms-date"
                value=""
                register={register}
              />
              <RadioInput
                id="lc-terms-invoice"
                label="Invoice Date"
                name="lc-payment-terms-date"
                value=""
                register={register}
              />
              <RadioInput
                id="lc-terms-sight"
                label="Sight"
                name="lc-payment-terms-date"
                value=""
                register={register}
              />
            </div>
            <div className="flex items-end gap-x-5 px-3 py-4 w-full rounded-md mb-2 border border-borderCol">
              <label
                htmlFor="lc-terms-others"
                className=" flex items-center gap-x-2  text-lightGray"
              >
                <input
                  type="radio"
                  name="lc-payment-terms-date"
                  id="lc-terms-others"
                  className="accent-primaryCol size-4"
                />
                Others
              </label>
              <Input
                register={register}
                type="text"
                name="ds"
                className="bg-transparent !border-b-2 !border-b-neutral-300 rounded-none border-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
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
            setValue={setValue}
            countries={countries?.response}
            getValues={getValues}
          />
          {/* Period */}
          <Period setValue={setValue} getValues={getValues} />
          {/* Transhipment */}
          <Transhipment register={register} isDiscount setValue={setValue} />
        </div>

        <Step4
          register={register}
          setValue={setValue}
          countries={countries?.response}
        />
        <Step5
          register={register}
          countries={countries?.response}
          setValue={setValue}
        />

        <div className="flex items-start gap-x-4 h-full w-full relative">
          <Step6
            register={register}
            title="Discounting Info"
            isDiscount
            setValue={setValue}
            getValues={getValues}
          />
          <Step7 register={register} step={7} />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-x-4 w-full">
          <Button
            onClick={handleSubmit(saveAsDraft)}
            type="button"
            variant="ghost"
            className="bg-[#F5F7F9] w-1/3"
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
      </form>
    </CreateLCLayout>
  );
};

export default CreateDiscountPage;
