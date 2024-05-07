"use client";
import CorporateStepLayout from "@/components/layouts/CorporateStepLayout";
import { FloatingInput } from "@/components/helpers/FloatingInput";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Paperclip } from "lucide-react";
import useRegisterStore, { getStateValues } from "@/store/register.store";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { pointOfContractSchema } from "@/validation";
import { z } from "zod";

const PointContactPage = () => {
  const router = useRouter();
  const navigate = () => {
    router.push("/register/corporate/current-banking");
  };
  const setValues = useRegisterStore((state) => state.setValues);
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof pointOfContractSchema>>({
    resolver: zodResolver(pointOfContractSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof pointOfContractSchema>> = async (
    data: any
  ) => {
    setValues(data);
    console.log(getStateValues(useRegisterStore.getState()));

    router.push("/register/corporate/current-banking");
  };

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

  return (
    <CorporateStepLayout
      step={2}
      title="Point of Contact"
      text="Give us the details of the POC our sales team should get in touch with after verification"
    >
      <form
        className="max-w-xl w-full shadow-md bg-white rounded-xl p-8 z-10 mt-5 flex flex-col gap-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FloatingInput
          register={register}
          type="text"
          name="pocName"
          placeholder="Authorized Point of Contact"
        />
        <div className="flex items-center gap-x-2">
          <FloatingInput
            register={register}
            name="pocEmail"
            placeholder="Company Email"
            type="email"
          />
          <FloatingInput
            type="text"
            name="pocPhone"
            placeholder="pocPhone"
            register={register}
          />
        </div>

        <div className="h-[2px] w-full bg-borderCol" />

        <div className="flex items-center gap-x-2">
          <FloatingInput
            type="text"
            name="poc"
            placeholder="Authorized POC"
            register={register}
          />
          <FloatingInput
            type="text"
            name="pocDesignation"
            placeholder="POC Designation"
            register={register}
          />
        </div>

        <label
          htmlFor="pdf-file"
          className="flex items-center justify-between border border-borderCol py-3 rounded-md px-4 cursor-pointer"
        >
          <div className="flex items-center gap-x-1">
            <Paperclip className="text-gray-500 size-4" />
            <p className="text-sm">Upload authorization letter</p>
          </div>
          <p className="text-sm text-[#92929D]">Select PDF file</p>
        </label>
        <input type="file" id="pdf-file" accept=".pdf" className="hidden" />

        <div className="flex flex-col gap-y-2">
          <Button
            className="disabled:bg-borderCol disabled:text-[#B5B5BE] bg-primaryCol hover:bg-primaryCol/90 text-[16px] rounded-lg"
            size="lg"
            disabled={false}
            onClick={navigate}
          >
            Continue
          </Button>

          <Link href="/register/corporate/product-info" className="text-center">
            <Button
              type="button"
              variant="ghost"
              className="text-para text-[16px]"
            >
              Previous
            </Button>
          </Link>
        </div>
      </form>
    </CorporateStepLayout>
  );
};

export default PointContactPage;
