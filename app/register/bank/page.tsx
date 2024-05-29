"use client";
import {
  CountrySelect,
  DisclaimerDialog,
  TelephoneInput,
} from "@/components/helpers";
import { FloatingInput } from "@/components/helpers/FloatingInput";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { onRegister } from "@/services/apis";
import { getCities } from "@/services/apis/helpers.api";
import { bankSchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
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
    <div className="font-roboto flex items-center space-x-2 my-2">
      <input type="checkbox" id={id} />
      <label htmlFor={id} className="text-sm text-[#44444F] leading-none">
        {label}
      </label>
    </div>
  );
};

const BankRegisterPage = () => {
  const router = useRouter();
  const [allowSubmit, setAllowSubmit] = useState(false);

  const {
    register,
    setValue,
    handleSubmit,
    getValues,
    watch,
    formState: { errors, isDirty, isValid },
    trigger,
  } = useForm<z.infer<typeof bankSchema>>({
    resolver: zodResolver(bankSchema),
    mode: "all",
  });
  // console.log(watch());

  const onSubmit: SubmitHandler<z.infer<typeof bankSchema>> = async (
    data: z.infer<typeof bankSchema>
  ) => {
    if (!procceed)
      return toast.error("Please view and sign the agreement first");
    const { response, success } = await onRegister(data);
    if (!success) return toast.error(response);
    else {
      toast.success("Account Register successfully");
      router.push("/register/complete");
      console.log("Email = ", response?.data?.email);
      console.log("Password = ", response?.data?.password);
    }
  };

  const [isoCode, setIsoCode] = useState("");
  const [procceed, setProceed] = useState(false);
  const [procceedErr, setProceedErr] = useState(false);
  const [phoneInput, setPhoneInput] = useState<string>("");

  let phone = getValues("pocPhone");

  useEffect(() => {
    if (isValid && isDirty) setAllowSubmit(true);
    if (!isValid || !isDirty) setAllowSubmit(false);
  }, [errors, isValid, isDirty]);

  useEffect(() => {
    if (procceed) setProceedErr(false);
  }, [procceed]);

  const [cities, setCities] = useState([]);

  const { data: citiesData } = useQuery({
    queryKey: ["cities", isoCode],
    queryFn: () => getCities(isoCode),
    enabled: !!isoCode,
  });

  useEffect(() => {
    if (citiesData && citiesData.response && citiesData.response.length > 0) {
      const fetchedCitites = citiesData?.response?.map((city: any) => {
        return city.name;
      });
      setCities(fetchedCitites);
    }
  }, [citiesData, isoCode]);

  return (
    <AuthLayout>
      <section className="max-w-[800px] mx-auto w-full max-xs:px-1 z-10">
        <h2 className="font-semibold text-3xl text-center">Register</h2>
        <p className="font-roboto text-para text-center mt-5">
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
                placeholder="Email"
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
                placeholder="Bank Country"
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
          <div className="flex items-center gap-x-2 w-full max-sm:flex-col max-sm:gap-y-3">
            {/* {isoCode && (
              <div className="w-1/3 relative">
                <Select
                  onValueChange={(value) =>
                    setValue("accountCity", value, { shouldValidate: true })
                  }
                >
                  <SelectTrigger
                    disabled={!cities || cities.length <= 0}
                    className="w-full py-5 px-4 text-gray-400"
                  >
                    <SelectValue placeholder="City" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {cities &&
                      cities.length > 0 &&
                      cities.map((city: string, idx: number) => (
                        <SelectItem value={city} key={`${city}-${idx}`}>
                          {city}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors.accountCity && (
                  <span className="mt-1 absolute text-[11px] text-red-500">
                    {errors.accountCity.message}
                  </span>
                )}
              </div>
            )} */}
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
                value={phoneInput}
                setAllowSubmit={setAllowSubmit}
                trigger={trigger}
              />
              {errors.pocPhone && (
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
          <div className="bg-[#F5F7F9] grid sm:grid-cols-2 grid-cols-1 gap-x-2 gap-y-3 p-2 rounded-lg border border-borderCol">
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
          <div>
            <div className="flex items-center justify-between gap-x-2 border border-borderCol p-2 rounded-lg">
              <div className="flex items-center gap-x-2 ">
                <Button
                  type="button"
                  className="bg-red-200 p-1 hover:bg-red-300"
                >
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
            {procceedErr && (
              <span className="mt-1 absolute text-[11px] text-red-500">
                Please view and sign the agreement first
              </span>
            )}
          </div>
          <p className="font-roboto text-para text-sm">
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
                className="w-full text-para bg-[#F5F7F9] text-[16px]"
              >
                Login
              </Button>
            </Link>
            <Button
              className="w-full disabled:bg-[#5625F2]/30 disabled:text-white bg-primaryCol hover:bg-primaryCol/90 text-[16px] rounded-lg"
              size="lg"
              disabled={!isValid}
              type="button"
              onClick={(e) => {
                if (procceed) handleSubmit(onSubmit)();
                else setProceedErr(true);
              }}
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
