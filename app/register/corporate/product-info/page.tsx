"use client";
import { FloatingInput } from "@/components/helpers/FloatingInput";
import CorporateStepLayout from "@/components/layouts/CorporateStepLayout";
import { Button } from "@/components/ui/button";
import useRegisterStore, { getStateValues } from "@/store/register.store";
import { companyInfoSchema, productsInfoSchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const ProductInfoPage = () => {
  const router = useRouter();
  const setValues = useRegisterStore((state) => state.setValues);
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof productsInfoSchema>>({
    resolver: zodResolver(productsInfoSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof productsInfoSchema>> = async (
    data: any
  ) => {
    setValues(data);
    console.log(getStateValues(useRegisterStore.getState()));
    console.log(data);

    router.push("/register/corporate/point-contact");
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
      step={1}
      title="Product Info"
      text="Please add information about your products and trade volume below"
    >
      <form
        className="max-w-xl w-full shadow-md bg-white rounded-xl p-8 z-10 mt-5 flex flex-col gap-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FloatingInput
          register={register}
          type="text"
          name="product"
          placeholder="product"
        />

        <div className="flex items-center gap-x-2 w-full">
          <div className="border-[2px] border-primaryCol text-primaryCol rounded-lg w-16 h-12 center font-medium">
            USD
          </div>
          <div className="w-full">
            <FloatingInput
              register={register}
              type="text"
              name="annualSalary"
              placeholder="Annual Sales of your Company"
            />
          </div>
        </div>

        <div className="flex items-center gap-x-2 w-full">
          <div className="border-[2px] border-primaryCol text-primaryCol rounded-lg w-16 h-12 center font-medium">
            USD
          </div>
          <div className="w-full">
            <FloatingInput
              register={register}
              type="text"
              name="annualValueExports"
              placeholder="Annual Value of Exports"
            />
          </div>
        </div>

        <div className="flex items-center gap-x-2 w-full">
          <div className="border-[2px] border-primaryCol text-primaryCol rounded-lg w-16 h-12 center font-medium">
            USD
          </div>
          <div className="w-full">
            <FloatingInput
              register={register}
              type="text"
              name="annualValueImports"
              placeholder="Annual Value of Imports"
            />
          </div>
        </div>

        <div className="flex flex-col gap-y-2">
          <Button
            className="disabled:bg-[#E2E2EA] disabled:text-[#B5B5BE] bg-primaryCol hover:bg-primaryCol/90 text-[16px] rounded-lg"
            size="lg"
            disabled={false}
            type="submit"
          >
            Continue
          </Button>

          <Link href="/register/corporate" className="text-center">
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

export default ProductInfoPage;
