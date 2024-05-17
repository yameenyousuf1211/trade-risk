"use client";
import {
  CountrySelect,
  DisclaimerDialog,
  TelephoneInput,
} from "@/components/helpers";
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
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof bankSchema>>({
    resolver: zodResolver(bankSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof bankSchema>> = async (
    data: z.infer<typeof bankSchema>
  ) => {
    const { response, success } = await onRegister(data);
    if (!success) return toast.error(response);
    console.log("Password = " ,response?.data?.password);
    if (success) {
      toast.success("Account Register successfully");
      router.push("/register/complete");
    }
  };

  const [isoCode, setIsoCode] = useState("");
  const [procceed, setProceed] = useState(false);
  const [phoneInput, setPhoneInput] = useState<string>("");

  let phone = getValues("pocPhone");

  useEffect(() => {
  }, [phoneInput]);

  return (
    <AuthLayout>
      <section className="max-w-[800px] mx-auto w-full max-xs:px-1 z-10">
        <h2 className="font-semibold text-3xl text-center">Register</h2>
        <p className="text-para text-center mt-5">
          Please fill in the form below to register your bank
        </p>
        <form
          className="max-w-[800px] mx-auto w-full shadow-md bg-white rounded-xl xs:p-8 max-xs:py-8 max-xs:px-4 z-10 mt-5 flex flex-col sm:gap-y-6 gap-y-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex items-center gap-x-2 w-full max-sm:flex-col max-sm:gap-y-3">
            <div className="w-full relative">
              <FloatingInput
                name="name"
                placeholder="Bank Name"
                register={register}
              />
              {errors.name && (
                <span className="mt-1 absolute text-[11px] text-red-500">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className="w-full relative">
              <FloatingInput
                name="email"
                placeholder="email"
                register={register}
              />
              {errors.email && (
                <span className="mt-1 absolute text-[11px] text-red-500">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="w-full relative">
              <CountrySelect
                setIsoCode={setIsoCode}
                setValue={setValue}
                name="accountCountry"
              />
              {errors.accountCountry && (
                <span className="mt-1 absolute text-[11px] text-red-500">
                  {errors.accountCountry.message}
                </span>
              )}
            </div>
            <div className="w-full relative">
              <FloatingInput
                name="swiftCode"
                placeholder="Swift"
                register={register}
              />
              {errors.swiftCode && (
                <span className="mt-1 absolute text-[11px] text-red-500">
                  {errors.swiftCode.message}
                </span>
              )}
            </div>
          </div>
          <div className="w-full relative">
            <FloatingInput
              name="address"
              placeholder="Registered Address"
              register={register}
            />
            {errors.address && (
              <span className="mt-1 absolute text-[11px] text-red-500">
                {errors.address.message}
              </span>
            )}
          </div>

          <div className="flex items-center gap-x-2 w-full">
            <div className="w-full relative">
              <FloatingInput
                register={register}
                name="pocEmail"
                placeholder="POC Email"
                type="email"
              />
              {errors.pocEmail && (
                <span className="mt-1 absolute text-[11px] text-red-500">
                  {errors.pocEmail.message}
                </span>
              )}
            </div>

            <div className="w-full relative">
              <TelephoneInput
                name="pocPhone"
                placeholder="POC Telephone"
                setValue={setValue}
                setPhoneInput={setPhoneInput}
              />
              {(phone === "" || phone === undefined) && errors.pocPhone && (
                <span className="mt-1 absolute text-[11px] text-red-500">
                  {errors.pocPhone.message}
                </span>
              )}
            </div>
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
          <div className="flex items-center justify-between gap-x-2 border border-borderCol p-2 rounded-lg">
            <div className="flex items-center gap-x-2 ">
              <Button type="button" className="bg-red-200 p-1 hover:bg-red-300">
                <Image
                  src="/images/pdf.png"
                  alt="pdf"
                  width={500}
                  height={500}
                  className="size-8"
                />
              </Button>
              <span className="text-[#50B5FF] underline text-sm">
                <DisclaimerDialog
                  title="Click to view and sign the agreement"
                  className="underline"
                  setProceed={setProceed}
                />
              </span>
            </div>
            {procceed && <Check className="text-[#29C084]" strokeWidth={3} />}
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
