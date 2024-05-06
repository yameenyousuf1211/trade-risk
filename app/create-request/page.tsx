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
import { confirmationSchema } from "@/validation/lc.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import { toast } from "sonner";
import { onCreateLC } from "@/services/apis/lcs.api";

const CreateRequestPage = () => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof confirmationSchema>>({
    resolver: zodResolver(confirmationSchema),
  });

  useEffect(() => {
    if (errors) {
      Object.keys(errors).forEach((fieldName: string) => {
        const errorMessage = errors[fieldName as keyof typeof errors]?.message;
        if (errorMessage) {
          toast.error(`${fieldName}: ${errorMessage}`);
        }
      });
    }
  }, [errors]);

  const onSubmit: SubmitHandler<z.infer<typeof confirmationSchema>> = async (
    data: any
  ) => {
    console.log(data, "DATA");
    const reqData = {
      ...data,
      lcType: "LC Confirmation",
      advisingBank: { bank: "Al habib", country: "Pak" }, // will be removed
      transhipment: false,
      expectedDiscountingDate: new Date(), // will be removed
    };
    const { response, success } = await onCreateLC(reqData);
    if (!success) return toast.error(response);
    if (success) toast.success(response?.message);

    console.log(response);
  };
  return (
    <CreateLCLayout>
      <form
        className="border border-borderCol py-4 px-3 w-full flex flex-col gap-y-5 mt-4 rounded-lg"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Step1 register={register} />
        <Step2 register={register} />
        <Step3 register={register} setValue={setValue} />
        <Step4 register={register} setValue={setValue} />
        <Step5 register={register} setValue={setValue} />
        <div className="flex items-start gap-x-4 h-full w-full relative">
          <Step6 register={register} title="Confirmation Charges" step={6} />
          <Step7 register={register} step={7} />
        </div>
        {/* Action Buttons */}
        <div className="flex items-center gap-x-4 w-full">
          <Button variant="ghost" className="bg-none w-1/3">
            Save as draft
          </Button>
          <Button
            size="lg"
            className="bg-primaryCol hover:bg-primaryCol/90 text-white w-2/3"
          >
            Submit request
          </Button>
        </div>
        {/* <DisclaimerDialog /> */}
      </form>
    </CreateLCLayout>
  );
};

export default CreateRequestPage;
