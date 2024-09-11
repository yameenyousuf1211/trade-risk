"use client";
import { FloatingInput } from "@/components/helpers/FloatingInput";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  SelectItem,
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { companyInfoSchema } from "@/validation";
import { z } from "zod";
import useRegisterStore from "@/store/register.store";
import {
  CountrySelect,
  DisclaimerDialog,
  TelephoneInput,
} from "@/components/helpers";
import { getCities } from "@/services/apis/helpers.api";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { PhoneInput } from "@/components/ui/phone-input";
import { Input } from "@/components/ui/input";
import { emailVerification, phoneVerification } from "@/services/apis";
import { toast } from "sonner";
import CorporateStepLayout from "@/components/layouts/CorporateStepLayout";

const CompanyInfoPage = () => {
  const router = useRouter();
  const setValues = useRegisterStore((state) => state.setValues);
  const [phoneInput, setPhoneInput] = useState<string>("");
  const [allowSubmit, setAllowSubmit] = useState(false);
  const [businessNature, setBusinessNature] = useState("");

  const corporateData =
    typeof window !== "undefined"
      ? localStorage.getItem("corporateData")
      : null;

  console.log(corporateData, "corporateData");
  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    trigger,
    watch,

    formState: { errors, isValid, dirtyFields },
  } = useForm({
    resolver: yupResolver(companyInfoSchema),
    mode: "all",
  });
  // console.log("🚀 ~ CompanyInfoPage ~ getValues:", getValues())

  // const isValid = true

  useEffect(() => {
    const storedIsoCode = localStorage.getItem("isoCode");
    if (storedIsoCode) {
      setIsoCode(storedIsoCode || ""); // Set ISO code for fetching cities
    }
    if (corporateData) {
      const data = JSON.parse(corporateData);
      data && setValues(data);
      Object.entries(data).forEach(([key, value]) => {
        // @ts-ignore
        setValue(key, value);
      });
      data && setBusinessNature(data.businessNature);
    }
  }, [corporateData]);
  useEffect(() => {
    getValues("phone");
    console.log(
      "🚀 ~ file: page.tsx ~ line 139 ~ useEffect ~ getValues",
      getValues("phone")
    );
    console.log(
      "🚀 ~ file: page.tsx ~ line 139 ~ useEffect ~ phoneInput",
      corporateData
    );

    if (corporateData) {
      setAllowSubmit(true);
    } else if (isValid) {
      setAllowSubmit(true);
    } else {
      !isValid && setAllowSubmit(false);
    }
  }, [errors, isValid, corporateData]);

  const onSubmit: SubmitHandler<typeof companyInfoSchema> = async (
    data: any
  ) => {
    localStorage.setItem("isoCode", isoCode);
    const { response: emailResponse, success: emailSuccess } =
      await emailVerification(data.email);
    console.log(emailResponse, "email");

    if (emailResponse?.isExist) {
      console.log(
        "🚀 ~ file: page.tsx ~ line 139 ~ onSubmit: ~ emailResponse",
        emailResponse
      );
      toast.error("Email is already exists");
      return;
    }
    const { response, success } = await phoneVerification(data.phone);

    if (!success) {
      console.log(
        "🚀 ~ file: page.tsx ~ line 139 ~ onSubmit: ~ response",
        response
      );
      toast.error("Phone number is invalid");
      return;
    }

    setValues(data);
    console.log(data, "corporateDataSet");
    localStorage.setItem("corporateData", JSON.stringify(data));
    router.push("/register/corporate/product-info");
  };

  const [isoCode, setIsoCode] = useState("");
  const [cities, setCities] = useState([]);
  const [cityVal, setCityVal] = useState("");
  const [cityOpen, setCityOpen] = useState(false);
  const [constitution, setConstitution] = useState("");
  const [businessSector, setBusinessSector] = useState("");

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

  const [procceed, setProceed] = useState(false);

  let phone = getValues("phone");

  const handleNatureChange = (e: any) => {
    const { value } = e.target;
    // Remove digit characters
    const nonDigitsOnly = value.replace(/\d/g, "");
    setBusinessNature(nonDigitsOnly);
    setValue("businessNature", nonDigitsOnly);
  };

  console.log(
    "🚀 ~ file: page.tsx ~ line 139 ~ useEffect ~ error",
    dirtyFields
  );

  /// Reseting city when entering country!
  const { accountCountry, accountCity } = watch();
  console.log(accountCity, "ACCOUNTCITY");

  useEffect(() => {
    if (accountCountry != JSON.parse(corporateData as string)?.accountCountry) {
      setValue("accountCity", "");
      setCityVal("");
      console.log(cityVal, "accountCity");
    } else {
      setValue("accountCity", JSON.parse(corporateData as string)?.accountCity);
    }
  }, [accountCountry]);

  return (
    <CorporateStepLayout
      step={1}
      title="Company Info"
      text="Please add information about your company. This cannot be changed later."
    >
      <section className="max-xs:px-1 z-10 mx-auto w-full max-w-2xl">
        <form
          className="max-xs:py-8 max-xs:px-4 z-10 mx-auto mt-8 flex w-full max-w-2xl flex-col gap-y-3 rounded-3xl bg-white shadow-md sm:gap-y-6 xs:p-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h3 className="text-[#585858]">Your Company information</h3>
          <div className="max-sm:flex-col max-sm:gap-y-3 flex items-center gap-x-2">
            <div className="relative w-full">
              <FloatingInput
                name="name"
                placeholder="Company Name"
                register={register}
              />
              {errors.name && (
                <span className="absolute mt-1 text-[11px] text-red-500">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className="relative w-full">
              <FloatingInput
                name="crNumber"
                placeholder="Commercial registration number"
                register={register}
              />
              {errors.crNumber && (
                <span className="absolute mt-1 text-[11px] text-red-500">
                  {errors.crNumber.message}
                </span>
              )}
            </div>
          </div>
          <div className="max-sm:flex-col max-sm:gap-y-3 flex items-center gap-x-2">
            <div className="relative w-full">
              <CountrySelect
                setIsoCode={setIsoCode}
                setValue={setValue}
                value={corporateData && JSON.parse(corporateData).country}
                name="country"
                placeholder="Company Country"
              />
              {errors.country && (
                <span className="absolute mt-1 text-[11px] text-red-500">
                  {errors.country.message}
                </span>
              )}
            </div>
            <div className="relative w-full">
              <Select
                onValueChange={(value) => {
                  setValue("constitution", value, { shouldValidate: true });
                  setConstitution(value);
                }}
              >
                <SelectTrigger
                  className={`w-full px-4 py-5 font-roboto capitalize ${
                    corporateData || constitution
                      ? "text-lightGray"
                      : "text-gray-400"
                  }`}
                >
                  <SelectValue
                    className="capitalize"
                    placeholder={
                      corporateData
                        ? JSON.parse(corporateData).constitution
                        : "Company Constitution"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="font-roboto">
                  <SelectItem value="Proprietorship Company">
                    Proprietorship Company
                  </SelectItem>
                  <SelectItem value="Individual">Individual</SelectItem>
                  <SelectItem value="Limited Liability Company">
                    Limited Liability Company
                  </SelectItem>
                  <SelectItem value="Public Limited Company">
                    Public Limited Company
                  </SelectItem>
                  <SelectItem value="Partnership">Partnership</SelectItem>
                  <SelectItem value="Establishment">Establishment</SelectItem>
                </SelectContent>
              </Select>
              {errors.constitution && (
                <span className="absolute mt-1 text-[11px] text-red-500">
                  {errors.constitution.message}
                </span>
              )}
            </div>
          </div>
          <div className="relative w-full">
            <FloatingInput
              name="address"
              placeholder="Company Address"
              register={register}
            />
            {errors.address && (
              <span className="absolute mt-1 text-[11px] text-red-500">
                {errors.address.message}
              </span>
            )}
          </div>
          <div className="max-sm:flex-col max-xs:gap-y-3 flex items-center gap-x-2">
            <div className="relative w-full">
              <FloatingInput
                name="email"
                placeholder="Company Email"
                type="email"
                register={register}
              />
              {errors.email && (
                <span className="absolute mt-1 text-[11px] text-red-500">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="relative w-full">
              {/* <TelephoneInput
                name="phone"
                placeholder="Telephone"
                setValue={setValue}
                setPhoneInput={setPhoneInput}
                trigger={trigger}
                value={(corporateData && JSON.parse(corporateData).phone) || ""}
              /> */}
              <div className="flex items-center gap-3">
                <label
                  id="beneficiaryDetails.address"
                  className="bo rder flex w-full items-center justify-between rounded-md bg-white pl-3"
                >
                  <div className="w-full">
                    <PhoneInput
                      value={
                        corporateData
                          ? JSON.parse(corporateData).phone
                          : phoneInput
                      }
                      // value={phoneInput}
                      name="phone"
                      onChange={(value) => {
                        setValue("phone", value);
                        trigger("phone");
                        setValue("phone", value || "");
                      }}
                    />
                  </div>
                </label>
              </div>
              {errors.phone && (
                <span className="absolute mt-1 text-[11px] text-red-500">
                  {errors.phone.message}
                </span>
              )}
            </div>
          </div>
          <div className="max-sm:flex-col max-sm:gap-y-3 flex items-center gap-x-2">
            <div className="relative w-full">
              <div className="relative w-full">
                <input
                  type="text"
                  id="businessNature"
                  {...register("businessNature")}
                  className="peer relative z-[1] w-full appearance-none rounded-lg border border-borderCol bg-transparent px-2.5 pb-2.5 pt-2.5 font-roboto text-sm text-lightGray focus:border-text focus:outline-none focus:ring-0"
                  placeholder=""
                  value={businessNature}
                  onKeyUp={(e: any) => e.target.value.replace(/\d/g, "")}
                  onChange={handleNatureChange}
                />
                <label
                  htmlFor="businessNature"
                  className="absolute start-1 top-2 z-[1] origin-[0] -translate-y-4 scale-75 transform bg-white px-2 font-roboto text-sm text-gray-400 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-text rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
                >
                  Nature of Business
                </label>
              </div>
              {errors.businessNature && (
                <span className="absolute mt-1 text-[11px] text-red-500">
                  {errors.businessNature.message}
                </span>
              )}
            </div>
            <div className="relative w-full">
              <Select
                onValueChange={(value) => {
                  setValue("businessType", value, { shouldValidate: true });
                  setBusinessSector(value);
                }}
              >
                <SelectTrigger
                  className={`w-full px-4 py-5 font-roboto capitalize ${
                    corporateData || businessSector
                      ? "text-lightGray"
                      : "text-gray-400"
                  }`}
                >
                  <SelectValue
                    placeholder={
                      corporateData
                        ? JSON.parse(corporateData).businessType
                        : "Business Sector"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="font-roboto">
                  <SelectItem value="Automotive">Automotive</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                </SelectContent>
              </Select>{" "}
              {errors.businessType && (
                <span className="absolute mt-1 text-[11px] text-red-500">
                  {errors.businessType.message}
                </span>
              )}
            </div>
          </div>

          <div className="h-[2px] w-full bg-borderCol" />
          <h3 className="text-[#585858]">Your main bank information</h3>

          <div className="max-sm:flex-col max-sm:gap-y-3 flex items-center gap-x-2">
            <div className="relative w-full">
              <FloatingInput
                name="bank"
                placeholder="Bank Name"
                register={register}
              />
              {errors.bank && (
                <span className="absolute mt-1 text-[11px] text-red-500">
                  {errors.bank.message}
                </span>
              )}
            </div>
            <div className="relative w-full">
              <FloatingInput
                name="accountNumber"
                type="number"
                inputMode="numeric"
                placeholder="Account Number"
                register={register}
              />
              {errors.accountNumber && (
                <span className="absolute mt-1 text-[11px] text-red-500">
                  {errors.accountNumber.message}
                </span>
              )}
            </div>
          </div>

          <div className="max-sm:flex-col max-sm:gap-y-3 flex items-center gap-x-2">
            <div className="relative w-full">
              <FloatingInput
                name="swiftCode"
                placeholder="SWIFT Code"
                register={register}
              />
              {errors.swiftCode && (
                <span className="absolute mt-1 text-[11px] text-red-500">
                  {errors.swiftCode.message}
                </span>
              )}
            </div>
            <div className="relative w-full">
              <FloatingInput
                name="accountHolderName"
                placeholder="Account holder name"
                register={register}
              />
              {errors.accountHolderName && (
                <span className="absolute mt-1 text-[11px] text-red-500">
                  {errors.accountHolderName.message}
                </span>
              )}
            </div>
          </div>

          <div className="max-sm:flex-col max-sm:gap-y-3 flex items-center gap-x-2">
            <div className="relative w-full">
              <CountrySelect
                setIsoCode={setIsoCode}
                setValue={setValue}
                value={
                  corporateData && JSON.parse(corporateData).accountCountry
                }
                name="accountCountry"
                placeholder={"Bank Country"}
              />
              {errors.accountCountry && (
                <span className="absolute mt-1 text-[11px] text-red-500">
                  {errors.accountCountry.message}
                </span>
              )}
            </div>
            <div className="relative w-full">
              <Popover open={cityOpen} onOpenChange={setCityOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={cityOpen}
                    className={`w-full justify-between font-roboto text-sm font-normal capitalize ${
                      cityVal
                        ? "text-lightGray"
                        : cities.length > 0 && accountCountry
                        ? "text-lightGray"
                        : "text-gray-400"
                    }`}
                    disabled={
                      !cities || (cities.length === 0 && !accountCountry)
                    }
                  >
                    {cityVal == "" &&
                    accountCountry != JSON.parse(corporateData)?.accountCountry
                      ? "Account City"
                      : cityVal
                      ? cities?.find(
                          (country: string) =>
                            country.toLowerCase() === cityVal.toLowerCase()
                        )
                      : corporateData
                      ? JSON.parse(corporateData).accountCity
                      : "Account City"}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command className="font-roboto">
                    <CommandInput placeholder="Search country..." />
                    <CommandEmpty>No city found.</CommandEmpty>
                    <CommandGroup className="max-h-[300px] overflow-y-auto">
                      {cities &&
                        cities.length > 0 &&
                        cities.map((country: string, idx: number) => (
                          <CommandItem
                            key={country}
                            value={country}
                            onSelect={(currentValue) => {
                              setCityVal(
                                currentValue.toLowerCase() ===
                                  cityVal.toLowerCase()
                                  ? ""
                                  : currentValue
                              );
                              setCityOpen(false);
                              setValue("accountCity", currentValue, {
                                shouldValidate: true,
                              });
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                country.toLowerCase() === cityVal.toLowerCase()
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
              {errors.accountCity && (
                <span className="absolute left-0 top-10 mt-1 w-full text-[11px] text-red-500">
                  {errors.accountCity.message}
                </span>
              )}
            </div>
          </div>

          <div className="my-2 flex items-center space-x-2">
            <input
              type="checkbox"
              id="agree"
              required
              checked={corporateData ? true : undefined}
            />
            <label
              htmlFor="agree"
              className="font-roboto text-sm leading-none text-[#44444F]"
            >
              I agree to TradeRisk&apos;s{" "}
              <span className="text-text">
                <DisclaimerDialog
                  title="Privacy Policy"
                  setProceed={setProceed}
                />
              </span>
            </label>
          </div>
          {/* Action Buttons */}
          <div className="max-xs:flex-col-reverse max-xs:gap-y-3 flex items-center gap-x-2">
            <Link href="/login" className="text-center sm:w-1/3">
              <Button
                type="button"
                variant="ghost"
                className="bg-[#F5F7F9] text-[16px] text-[#92929D]"
                onClick={() => {
                  localStorage.removeItem("corporateData");
                  localStorage.removeItem("isoCode");
                }}
              >
                Go back to login
              </Button>
            </Link>
            <Button
              type="submit"
              className="w-full rounded-lg bg-primaryCol text-[16px] hover:bg-primaryCol/90 disabled:bg-borderCol disabled:text-[#B5B5BE]"
              size="lg"
              // disabled={!allowSubmit}
            >
              Get Started
            </Button>
          </div>
        </form>
      </section>
    </CorporateStepLayout>
  );
};

export default CompanyInfoPage;
