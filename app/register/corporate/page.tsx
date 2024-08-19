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

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    trigger,
    formState: { errors, isValid, isDirty },
  } = useForm({
    resolver: yupResolver(companyInfoSchema),
    mode: "all",
  });

  useEffect(() => {
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
    if (corporateData) {
      setAllowSubmit(true);
    } else if (isValid && isDirty) {
      setAllowSubmit(true);
    } else {
      (!isValid || !isDirty) && setAllowSubmit(false);
    }
  }, [errors, isValid, isDirty, corporateData]);

  const onSubmit: SubmitHandler<typeof companyInfoSchema> = async (
    data: any
  ) => {
    setValues(data);
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

  useEffect(() => {}, [phoneInput]);

  const handleNatureChange = (e: any) => {
    const { value } = e.target;
    // Remove digit characters
    const nonDigitsOnly = value.replace(/\d/g, "");
    setBusinessNature(nonDigitsOnly);
    setValue("businessNature", nonDigitsOnly);
  };

  return (
    <AuthLayout>
      <section className="max-w-2xl mx-auto w-full max-xs:px-1 z-10 ">
        <h2 className="font-semibold text-3xl text-center">Company Info</h2>
        <p className="text-para font-roboto text-center mt-5">
          Please add information about your company. This cannot be changed
          later.
        </p>
        <form
          className="max-w-2xl mx-auto w-full shadow-md bg-white rounded-3xl xs:p-8 max-xs:py-8 max-xs:px-4 z-10 mt-8 flex flex-col sm:gap-y-6 gap-y-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h3 className="text-[#585858]">Your Company information</h3>
          <div className="flex items-center gap-x-2 max-sm:flex-col max-sm:gap-y-3">
            <div className="w-full relative">
              <FloatingInput
                name="name"
                placeholder="Company Name"
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
                name="crNumber"
                placeholder="Commercial Registration Number"
                register={register}
              />
              {errors.crNumber && (
                <span className="mt-1 absolute text-[11px] text-red-500">
                  {errors.crNumber.message}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-x-2 max-sm:flex-col max-sm:gap-y-3">
            <div className="w-full relative">
              <CountrySelect
                setIsoCode={setIsoCode}
                setValue={setValue}
                name="accountCountry"
                placeholder="Company Country"
              />
              {errors.accountCountry && (
                <span className="mt-1 absolute text-[11px] text-red-500">
                  {errors.accountCountry.message}
                </span>
              )}
            </div>
            <div className="w-full relative">
              <Select
                onValueChange={(value) => {
                  setValue("constitution", value, { shouldValidate: true });
                  setConstitution(value);
                }}
              >
                <SelectTrigger
                  className={`capitalize font-roboto w-full py-5 px-4 ${
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
                  <SelectItem value="individual_proprietorship_co">
                    Proprietorship Company
                  </SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="limited_liability_co">
                    Limited Liability Company
                  </SelectItem>
                  <SelectItem value="public_limited_co">
                    Public Limited Company
                  </SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                  <SelectItem value="establishment">Establishment</SelectItem>
                </SelectContent>
              </Select>
              {errors.constitution && (
                <span className="mt-1 absolute text-[11px] text-red-500">
                  {errors.constitution.message}
                </span>
              )}
            </div>
          </div>
          <div className="w-full relative">
            <FloatingInput
              name="address"
              placeholder="Company Address"
              register={register}
            />
            {errors.address && (
              <span className="mt-1 absolute text-[11px] text-red-500">
                {errors.address.message}
              </span>
            )}
          </div>
          <div className="flex items-center gap-x-2 max-sm:flex-col max-xs:gap-y-3">
            <div className="w-full relative">
              <FloatingInput
                name="email"
                placeholder="Company Email"
                type="email"
                register={register}
              />
              {errors.email && (
                <span className="mt-1 absolute text-[11px] text-red-500">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="w-full relative">
              <TelephoneInput
                name="phone"
                placeholder="Telephone"
                setValue={setValue}
                setPhoneInput={setPhoneInput}
                trigger={trigger}
                value={(corporateData && JSON.parse(corporateData).phone) || ""}
              />
              {errors.phone && (
                <span className="mt-1 absolute text-[11px] text-red-500">
                  {errors.phone.message}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-x-2 max-sm:flex-col max-sm:gap-y-3">
            <div className="w-full relative">
              <div className="relative w-full">
                <input
                  type="text"
                  id="businessNature"
                  {...register("businessNature")}
                  className="z-[1] relative px-2.5 pb-2.5 pt-2.5 w-full text-sm text-lightGray font-roboto bg-transparent rounded-lg border border-borderCol appearance-none focus:outline-none focus:ring-0 focus:border-text peer"
                  placeholder=""
                  value={businessNature}
                  onKeyUp={(e: any) => e.target.value.replace(/\d/g, "")}
                  onChange={handleNatureChange}
                />
                <label
                  htmlFor="businessNature"
                  className="z-[1] font-roboto absolute text-sm text-gray-400  duration-300 transform -translate-y-4 scale-75 top-2 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-text peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >
                  Nature of Business
                </label>
              </div>
              {errors.businessNature && (
                <span className="mt-1 absolute text-[11px] text-red-500">
                  {errors.businessNature.message}
                </span>
              )}
            </div>
            <div className="w-full relative">
              <Select
                onValueChange={(value) => {
                  setValue("businessType", value, { shouldValidate: true });
                  setBusinessSector(value);
                }}
              >
                <SelectTrigger
                  className={`capitalize font-roboto w-full py-5 px-4 ${
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
                <span className="mt-1 absolute text-[11px] text-red-500">
                  {errors.businessType.message}
                </span>
              )}
            </div>
          </div>

          <div className="h-[2px] w-full bg-borderCol" />
          <h3 className="text-[#585858]">Your main bank information</h3>

          <div className="flex items-center gap-x-2 max-sm:flex-col max-sm:gap-y-3">
            <div className="w-full relative">
              <FloatingInput
                name="bank"
                placeholder="Bank Name"
                register={register}
              />
              {errors.bank && (
                <span className="mt-1 absolute text-[11px] text-red-500">
                  {errors.bank.message}
                </span>
              )}
            </div>
            <div className="w-full relative">
              <FloatingInput
                name="accountNumber"
                type="number"
                inputMode="numeric"
                placeholder="Account Number"
                register={register}
              />
              {errors.accountNumber && (
                <span className="mt-1 absolute text-[11px] text-red-500">
                  {errors.accountNumber.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-x-2 max-sm:flex-col max-sm:gap-y-3">
            <div className="w-full relative">
              <FloatingInput
                name="swiftCode"
                placeholder="SWIFT Code"
                register={register}
              />
              {errors.swiftCode && (
                <span className="mt-1 absolute text-[11px] text-red-500">
                  {errors.swiftCode.message}
                </span>
              )}
            </div>
            <div className="w-full relative">
              <FloatingInput
                name="accountHolderName"
                placeholder="Account holder name"
                register={register}
              />
              {errors.accountHolderName && (
                <span className="mt-1 absolute text-[11px] text-red-500">
                  {errors.accountHolderName.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-x-2 max-sm:flex-col max-sm:gap-y-3">
            <div className="w-full relative">
              <CountrySelect
                setIsoCode={setIsoCode}
                setValue={setValue}
                name="accountCountry"
                placeholder={
                  corporateData
                    ? JSON.parse(corporateData).accountCountry
                    : "Account Country"
                }
              />
              {errors.accountCountry && (
                <span className="mt-1 absolute text-[11px] text-red-500">
                  {errors.accountCountry.message}
                </span>
              )}
            </div>
            <div className="w-full relative">
              <Popover open={cityOpen} onOpenChange={setCityOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={cityOpen}
                    className={`capitalize font-roboto w-full justify-between font-normal text-sm ${
                      cityVal ? "text-lightGray" : "text-gray-400"
                    }`}
                    disabled={!cities || cities.length <= 0}
                  >
                    {cityVal
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
                <span className="mt-1 absolute text-[11px] text-red-500">
                  {errors.accountCity.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 my-2">
            <input
              type="checkbox"
              id="agree"
              required
              checked={corporateData ? true : undefined}
            />
            <label
              htmlFor="agree"
              className="text-sm font-roboto text-[#44444F] leading-none"
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
          <div className="flex items-center gap-x-2 max-xs:flex-col-reverse max-xs:gap-y-3">
            <Link href="/login" className="text-center sm:w-1/3">
              <Button
                type="button"
                variant="ghost"
                className="text-[#92929D] bg-[#F5F7F9] text-[16px]"
                onClick={() => localStorage.removeItem("corporateData")}
              >
                Go back to login
              </Button>
            </Link>
            <Button
              type="submit"
              className="w-full disabled:bg-borderCol disabled:text-[#B5B5BE] bg-primaryCol hover:bg-primaryCol/90 text-[16px] rounded-lg"
              size="lg"
              disabled={!allowSubmit}
            >
              Get Started
            </Button>
          </div>
        </form>
      </section>
    </AuthLayout>
  );
};

export default CompanyInfoPage;
