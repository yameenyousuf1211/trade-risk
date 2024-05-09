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
import { CountrySelect, TelephoneInput } from "@/components/helpers";
import { getCities } from "@/services/apis/helpers.api";
import { useQuery } from "@tanstack/react-query";

const CompanyInfoPage = () => {
  const router = useRouter();
  const setValues = useRegisterStore((state) => state.setValues);

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof companyInfoSchema>>({
    resolver: zodResolver(companyInfoSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof companyInfoSchema>> = async (
    data: any
  ) => {
    setValues(data);
    router.push("/register/corporate/product-info");
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

  const [valueChanged, setValueChanged] = useState(false);
  let country = getValues("accountCountry");

  useEffect(() => {
    country = getValues("accountCountry");
  }, [valueChanged]);

  const { data: cities, isLoading } = useQuery({
    queryKey: ["cities", country],
    queryFn: () => getCities(country),
    enabled: !!country,
  });

  return (
    <AuthLayout>
      <section className="max-w-2xl mx-auto w-full max-xs:px-1 z-10 ">
        <h2 className="font-semibold text-3xl text-center">Company Info</h2>
        <p className="text-para text-center mt-5">
          Please add information about your company. This cannot be changed
          later.
        </p>
        <form
          className="max-w-2xl mx-auto w-full shadow-md bg-white rounded-xl xs:p-8 max-xs:py-8 max-xs:px-4 z-10 mt-5 flex flex-col sm:gap-y-5 gap-y-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex items-center gap-x-2 max-sm:flex-col max-sm:gap-y-3">
            <FloatingInput
              name="name"
              placeholder="Company Name"
              register={register}
            />
            {/* Company Constitution */}
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
              </SelectContent>
            </Select>
          </div>

          <FloatingInput
            name="address"
            placeholder="Company Address"
            register={register}
          />
          <div className="flex items-center gap-x-2 max-sm:flex-col max-xs:gap-y-3">
            <div className="w-full">
              <FloatingInput
                name="email"
                placeholder="Company Email"
                type="email"
                register={register}
              />
              {errors.email && (
                <span className="text-[11px] text-red-500">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="w-full">
              {/* <FloatingInput
                name="phone"
                placeholder="Telephone"
                register={register}
              /> */}
              <TelephoneInput
                name="phone"
                placeholder="Telephone"
                setValue={setValue}
              />
              {errors.phone && (
                <span className="text-[11px] text-red-500">
                  {errors.phone.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-x-2 max-sm:flex-col max-sm:gap-y-3">
            <div className="w-full">
              <FloatingInput
                type="text"
                name="businessNature"
                placeholder="Nature of Business"
                register={register}
              />
              {/* {errors.businessNature && <p className="text-red-500 text-sm">{errors.businessNature.message}</p>} */}
            </div>
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
              </SelectContent>
            </Select>{" "}
            {/* Company Constitution */}
          </div>

          <div className="h-[2px] w-full bg-borderCol" />

          <div className="flex items-center gap-x-2 max-sm:flex-col max-sm:gap-y-3">
            <FloatingInput
              name="bank"
              placeholder="Bank Name"
              register={register}
            />

            <FloatingInput
              name="accountNumber"
              placeholder="Account Number"
              register={register}
            />
          </div>

          <div className="flex items-center gap-x-2 max-sm:flex-col max-sm:gap-y-3">
            <FloatingInput
              name="swiftCode"
              placeholder="SWIFT Code"
              register={register}
            />
            <FloatingInput
              name="accountHolderName"
              placeholder="Account holder name"
              register={register}
            />
          </div>

          <div className="flex items-center gap-x-2 max-sm:flex-col max-sm:gap-y-3">
            {/* Country */}
            <CountrySelect
              setValue={setValue}
              name="accountCountry"
              setValueChange={setValueChanged}
            />
            {/* City */}
            <Select
              onValueChange={(value) =>
                setValue("accountCity", value, { shouldValidate: true })
              }
            >
              <SelectTrigger
                disabled={!cities || !cities?.response || !cities.success}
                className="w-full py-5 px-4 text-gray-500"
              >
                <SelectValue placeholder="Account City" />
              </SelectTrigger>
              <SelectContent>
                {!isLoading &&
                  cities &&
                  cities.response.length > 0 &&
                  cities?.response.map((city: string, idx: number) => (
                    <SelectItem value={city} key={`${city}-${idx}`}>
                      {city}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 my-2">
            <input type="checkbox" id="agree" required />
            <label
              htmlFor="agree"
              className="text-sm text-[#44444F] leading-none"
            >
              I agree to TradeRisk&apos;s{" "}
              <Link href="#" className="text-text">
                Privacy Policy
              </Link>
            </label>
          </div>
          {/* Action Buttons */}
          <div className="flex items-center gap-x-2 max-xs:flex-col-reverse max-xs:gap-y-3">
            <Link href="/login" className="text-center sm:w-1/3">
              <Button
                type="button"
                variant="ghost"
                className="text-para text-[16px]"
              >
                Go back to login
              </Button>
            </Link>
            <Button
              type="submit"
              className="w-full disabled:bg-borderCol disabled:text-[#B5B5BE] bg-primaryCol hover:bg-primaryCol/90 text-[16px] rounded-lg"
              size="lg"
              // disabled={false}
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
