"use client";
import {
  CountrySelect,
  DisclaimerDialog,
} from "@/components/helpers";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FloatingInput } from "@/components/helpers/FloatingInput";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/ui/phone-input";
import { onRegister } from "@/services/apis";
import { bankSchema } from "@/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Check, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { getBanks } from "@/services/apis/helpers.api";
import { bankCountries } from "@/utils/data";
import { cn } from "@/utils";

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
  const [countryOpen, setCountryOpen] = useState(false);
  const [bankOpen, setBankOpen] = useState(false);
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors, isDirty, isValid },
    trigger,
  } = useForm({
    resolver: yupResolver(bankSchema),
    mode: "all",
  });

  const accountCountry = watch("accountCountry");
  const bankVal = watch("bank");
  const onSubmit: SubmitHandler<typeof bankSchema> = async (data) => {
    if (!procceed)
      return toast.error("Please view and sign the agreement first");

    const reqData = {
      name: data?.pocName,
      email: data?.email,
      type: "bank",
      role: "admin",
      fcmTokens: ["adflskjdfklsdjfkldsj"],
      businessData: {
        name: data?.pocName,
        pocName: data?.pocName,
        email: data?.email,
        type: data?.type,
        address: data?.address,
        swiftCode: data?.swiftCode,
        pocEmail: data?.pocEmail,
        pocPhone: data?.pocPhone,
        country: data?.accountCountry,
        confirmationLcs: data?.confirmationLcs,
        discountingLcs: data?.discountingLcs,
        guaranteesCounterGuarantees: data?.guaranteesCounterGuarantees,
        discountingAvalizedBills: data?.discountingAvalizedBills,
        avalizationExportBills: data?.avalizationExportBills,
        riskParticipation: data?.riskParticipation,
      },
    };

    const { response, success } = await onRegister(reqData);
    if (!success) return toast.error(response);
    else {
      toast.success("Account Register successfully");
      router.push("/register/complete");
      console.log("Email = ", response?.data?.email);
      console.log("Password = ", response?.data?.password);
    }
  };

  const [procceed, setProceed] = useState(false);
  const [procceedErr, setProceedErr] = useState(false);
  const [phoneInput, setPhoneInput] = useState<string>("");

  const countryNames = bankCountries.map((country) => country.name);

  const { data: banks, isLoading: banksLoading } = useQuery({
    queryKey: ["banks", accountCountry],
    queryFn: () => getBanks(accountCountry),
    enabled: !!accountCountry,
  });

  useEffect(() => {
    if (isValid && isDirty) setAllowSubmit(true);
    if (!isValid || !isDirty) setAllowSubmit(false);
  }, [errors, isValid, isDirty]);

  useEffect(() => {
    if (procceed) setProceedErr(false);
  }, [procceed]);

  return (
    <AuthLayout>
      <section className="max-w-[800px] mx-auto w-full max-xs:px-1 z-10">
        <h2 className="font-semibold text-3xl text-center">Register</h2>
        <p className="font-roboto text-para text-center mt-5">
          Please complete the form below to register your bank. The designated
          point of contact will also serve as the admin for user access at your
          bank.
        </p>
        <form
          className="max-w-[800px] mx-auto w-full shadow-md bg-white rounded-xl xs:p-8 max-xs:py-8 max-xs:px-4 z-10 mt-3 flex flex-col sm:gap-y-[22px] gap-y-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex items-center gap-x-2 w-full max-sm:flex-col max-sm:gap-y-3">
            <div className="w-full relative">
              <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    aria-expanded={countryOpen}
                    role="combobox"
                    className={`capitalize font-roboto w-full justify-between py-6 font-normal text-sm ${accountCountry ? "text-lightGray" : "text-gray-400"
                      } `}
                  >
                    {accountCountry
                      ? countryNames?.find(
                        (country) =>
                          country.toLowerCase() === accountCountry.toLowerCase()
                      )
                      : "Bank Country"}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command className="font-roboto">
                    <CommandInput placeholder="Search country..." />
                    <CommandEmpty>No country found.</CommandEmpty>
                    <CommandGroup className="max-h-[300px] overflow-y-auto">
                      {countryNames &&
                        countryNames.length > 0 &&
                        countryNames.map((country, idx) => (
                          <CommandItem
                            key={country}
                            value={country}
                            onSelect={(currentValue) => {
                              setCountryOpen(false); // Close the dropdown
                              setValue('accountCountry', currentValue, { shouldValidate: true });
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                country.toLowerCase() === accountCountry?.toLowerCase()
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {country}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              {errors.accountCountry && (
                <span className="mt-1 absolute text-[11px] text-red-500">
                  {errors.accountCountry.message}
                </span>
              )}
            </div>

            <div className="w-full relative">
              <Popover onOpenChange={setBankOpen} open={bankOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    disabled={!accountCountry}
                    className="capitalize font-roboto w-full justify-between truncate  py-6"
                  >
                    <span className="truncate w-full text-left">
                      {bankVal
                        ? banks?.response.find(
                          (bank: string) =>
                            bank.toLowerCase() === bankVal.toLowerCase()
                        )
                        : "Bank Name"}
                    </span>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[230px] p-0">
                  <Command className="font-roboto">
                    <CommandInput placeholder="Search bank..." />
                    <CommandEmpty>No bank found.</CommandEmpty>
                    <CommandGroup className="max-h-[300px] overflow-y-auto">
                      {!banksLoading &&
                        banks &&
                        banks.success &&
                        banks?.response.map((bank: string) => (
                          <CommandItem
                            key={bank}
                            value={bank}
                            onSelect={(currentValue) => {
                              setBankOpen(false);
                              setValue("bank", currentValue);
                            }}
                          >
                            {bank}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              {errors.name && (
                <span className="mt-1 absolute text-[11px] text-red-500">
                  {errors.name.message}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-x-2 w-full max-sm:flex-col max-sm:gap-y-3">
            <div className="w-full relative">
              <FloatingInput
                name="email"
                placeholder="Bank Email Address"
                register={register}
              />
              {errors.email && (
                <span className="mt-1 absolute text-[11px] text-red-500">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="w-full relative">
              <FloatingInput
                name="swiftCode"
                placeholder="Swift Code"
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
                name="pocName"
                placeholder="Authorized Point of Contact Name"
                type="text"
              />
              {errors.pocName && (
                <span className="mt-1 absolute text-[11px] text-red-500">
                  {errors.pocName.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-x-2 w-full">
            <div className="w-full relative p-1">
              <FloatingInput
                register={register}
                name="pocEmail"
                placeholder="Authorized Point of Contact Email"
                type="email"
              />
              {errors.pocEmail && (
                <span className="mt-1 absolute text-[11px] text-red-500">
                  {errors.pocEmail.message}
                </span>
              )}
            </div>

            <div className="w-full relative">
              <label
                id="pocPhone"
                className="border flex-1 p-1 px-1 rounded-md  flex items-center justify-between bg-white"
              >
                <p className=" text-sm w-32 text-lightGray">Phone Number</p>
                <PhoneInput
                  value={phoneInput}
                  name="pocPhone"
                  // className="h-10"
                  onChange={(value) => {
                    setValue("pocPhone", value);
                  }}
                />
              </label>

              {/* <TelephoneInput
                name="pocPhone"
                placeholder="POC Telephone"
                setValue={setValue}
                setPhoneInput={setPhoneInput}
                value={phoneInput}
                setAllowSubmit={setAllowSubmit}
                trigger={trigger}
              /> */}
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
          <div className="bg-[#F5F7F9] grid sm:grid-cols-2 grid-cols-1 gap-x-2 gap-y-1 p-2 rounded-lg border border-borderCol">
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
