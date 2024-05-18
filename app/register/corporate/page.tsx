"use client";
import { FloatingInput } from "@/components/helpers/FloatingInput";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  SelectItem,
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { companyInfoSchema } from "@/validation";
import { z } from "zod";
import useRegisterStore, { getStateValues } from "@/store/register.store";
import {
  CountrySelect,
  DisclaimerDialog,
  TelephoneInput,
} from "@/components/helpers";
import { getCities } from "@/services/apis/helpers.api";
import { useQuery } from "@tanstack/react-query";
import { Country } from "@/types/type";

const CompanyInfoPage = () => {
  const router = useRouter();
  const setValues = useRegisterStore((state) => state.setValues);
  const [phoneInput, setPhoneInput] = useState<string>("");

  const corporateData =
    typeof window !== "undefined"
      ? localStorage.getItem("corporateData")
      : null;

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<z.infer<typeof companyInfoSchema>>({
    resolver: zodResolver(companyInfoSchema),
  });

  useEffect(() => {
    if (corporateData) {
      const data = JSON.parse(corporateData);
      data && setValues(data);
      Object.entries(data).forEach(([key, value]) => {
        // @ts-ignore
        setValue(key, value);
      });
    }
  }, [corporateData]);
  useEffect(() => {
    getValues("phone");
    console.log(getValues("phone"));
  }, [errors]);

  const onSubmit: SubmitHandler<z.infer<typeof companyInfoSchema>> = async (
    data: any
  ) => {
    setValues(data);
    localStorage.setItem("corporateData", JSON.stringify(data));
    router.push("/register/corporate/product-info");
  };

  const [isoCode, setIsoCode] = useState("");
  const [cities, setCities] = useState([]);

  const { data: citiesData, isLoading } = useQuery({
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

  return (
    <AuthLayout>
      <section className="max-w-2xl mx-auto w-full max-xs:px-1 z-10 ">
        <h2 className="font-semibold text-3xl text-center">Company Info</h2>
        <p className="text-para text-center mt-5">
          Please add information about your company. This cannot be changed
          later.
        </p>
        <form
          className="max-w-2xl mx-auto w-full shadow-md bg-white rounded-xl xs:p-8 max-xs:py-8 max-xs:px-4 z-10 mt-5 flex flex-col sm:gap-y-6 gap-y-3"
          onSubmit={handleSubmit(onSubmit)}
        >
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
              <Select
                onValueChange={(value) =>
                  setValue("constitution", value, { shouldValidate: true })
                }
              >
                <SelectTrigger className="w-full py-5 px-4 text-gray-500">
                  <SelectValue placeholder="Company Constitution" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual_proprietorship_co">
                    Individual/Proprietorship Co.
                  </SelectItem>
                  <SelectItem value="limited_liability_co">
                    Limited Liability Co
                  </SelectItem>
                  <SelectItem value="public_limited_co">
                    Public Limited Co.
                  </SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
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
              />
              {(phone === "" || phone === undefined) && errors.phone && (
                <span className="mt-1 absolute text-[11px] text-red-500">
                  {errors.phone.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-x-2 max-sm:flex-col max-sm:gap-y-3">
            <div className="w-full relative">
              <FloatingInput
                type="text"
                name="businessNature"
                placeholder="Nature of Business"
                register={register}
              />
              {errors.businessNature && (
                <span className="mt-1 absolute text-[11px] text-red-500">
                  {errors.businessNature.message}
                </span>
              )}
            </div>
            <div className="w-full relative">
              <Select
                onValueChange={(value) =>
                  setValue("businessType", value, { shouldValidate: true })
                }
              >
                <SelectTrigger className="w-full py-5 px-4 text-gray-500">
                  <SelectValue placeholder="Business Sector" />
                </SelectTrigger>
                <SelectContent>
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
              />
              {errors.accountCountry && (
                <span className="mt-1 absolute text-[11px] text-red-500">
                  {errors.accountCountry.message}
                </span>
              )}
            </div>
            <div className="w-full relative">
              <Select
                onValueChange={(value) =>
                  setValue("accountCity", value, { shouldValidate: true })
                }
              >
                <SelectTrigger
                  disabled={!cities || cities.length <= 0}
                  className="w-full py-5 px-4 text-gray-500"
                >
                  <SelectValue placeholder="Account City" />
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
          </div>

          <div className="flex items-center space-x-2 my-2">
            <input type="checkbox" id="agree" required />
            <label
              htmlFor="agree"
              className="text-sm text-[#44444F] leading-none"
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
              // disabled={isDirty}
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
