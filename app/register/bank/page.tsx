"use client";
import { FloatingInput } from "@/components/helpers/FloatingInput";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import {
  SelectItem,
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { onRegister } from "@/services/apis";
import { bankSchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const CheckBoxInput = ({ label, id }: { label: string; id: string }) => {
  return (
    <div className="flex items-center space-x-2 my-2">
      <input type="checkbox" id={id} />
      <label htmlFor={id} className="text-sm text-[#44444F] leading-none">
        {label}
      </label>
    </div>
  );
};

const BankRegisterPage = () => {
  const router = useRouter();

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof bankSchema>>({
    resolver: zodResolver(bankSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof bankSchema>> = async (
    data: any
  ) => {
    const { response, success } = await onRegister(data);
    if (!success) return toast.error(response);
    if (success) {
      toast.success("Account Register successfully");
      router.push("/register/complete");
    }
    // router.push("/register/corporate/current-banking");
  };

  useEffect(() => {
    if (errors) {
      Object.keys(errors)
        .reverse()
        .forEach((fieldName: string) => {
          const errorMessage =
            errors[fieldName as keyof typeof errors]?.message;
          if (errorMessage) {
            toast.error(`${fieldName}: ${errorMessage}`);
          }
        });
    }
  }, [errors]);

  return (
    <AuthLayout>
      <section className="max-w-[800px] mx-auto w-full max-xs:px-1 z-10">
        <h2 className="font-semibold text-3xl text-center">Register</h2>
        <p className="text-para text-center mt-5">
          Please fill in the form below to register your bank
        </p>
        <form
          className="max-w-[800px] mx-auto w-full shadow-md bg-white rounded-xl xs:p-8 max-xs:py-8 max-xs:px-4 z-10 mt-5 flex flex-col sm:gap-y-5 gap-y-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex items-center gap-x-2 w-full max-sm:flex-col max-sm:gap-y-3">
            <FloatingInput
              name="name"
              placeholder="Bank Name"
              register={register}
            />
            <FloatingInput
              name="email"
              placeholder="email"
              register={register}
            />

            <Select>
              <SelectTrigger className="w-full py-5 px-4 text-gray-500">
                <SelectValue placeholder="Select Country*" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pakistan">Pakistan</SelectItem>
              </SelectContent>
            </Select>

            <FloatingInput
              name="swiftCode"
              placeholder="Swift"
              register={register}
            />
          </div>

          <FloatingInput
            name="address"
            placeholder="Registered Address"
            register={register}
          />

          <div className="flex items-center gap-x-2 w-full">
            <FloatingInput
              register={register}
              name="pocEmail"
              placeholder="POC Email"
              type="email"
            />
            <FloatingInput
              type="number"
              name="pocPhone"
              placeholder="POC Telephone"
              register={register}
            />
          </div>

          <p className="text-[16px] font-semibold">
            Select all the type of deals you would be interested in
          </p>

          {/* Checkboxes */}
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-x-2 gap-y-3 p-2 rounded-lg border border-borderCol">
            <CheckBoxInput
              label="Confirmation of LCs"
              id="confirmation-of-lcs"
            />
            <CheckBoxInput label="Discounting of LCs" id="discounting-of-lcs" />
            <CheckBoxInput
              label="Guarantees and counter guarantees"
              id="guarantees"
            />
            <CheckBoxInput
              label="Avalization of Export Bills"
              id="avalization-export"
            />
            <CheckBoxInput
              label="Avalization & Discounting of Avalized Bills"
              id="avalization"
            />
            <CheckBoxInput
              label="Risk Participation (bank to bank)"
              id="risk-participation"
            />
          </div>

          {/* PDF */}
          <div className="flex items-center gap-x-2 border border-borderCol p-2 rounded-lg">
            <Button type="button" className="bg-red-200 p-1 hover:bg-red-300">
              <Image
                src="/images/pdf.png"
                alt="pdf"
                width={500}
                height={500}
                className="size-8"
              />
            </Button>
            <Link href="#" className="text-[#50B5FF] underline text-sm">
              Click to view and sign the agreement
            </Link>
          </div>

          <p className="text-para text-sm">
            By signing up you agree that final confirmation to abide by the
            above and the transaction will be processed, (based on Legal rules
            and regulation of the country)
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-x-2">
            <Link href="/login" className="text-center w-1/3">
              <Button
                type="button"
                variant="ghost"
                className="text-para text-[16px]"
              >
                Login
              </Button>
            </Link>
            <Button
              className="w-full disabled:bg-borderCol disabled:text-[#B5B5BE] bg-primaryCol hover:bg-primaryCol/90 text-[16px] rounded-lg"
              size="lg"
              disabled={isSubmitting}
              type="submit"
            >
              Get Started
            </Button>
          </div>
        </form>
      </section>
    </AuthLayout>
  );
};

export default BankRegisterPage;
