"use client";
import CorporateStepLayout from "@/components/layouts/CorporateStepLayout";
import { FloatingInput } from "@/components/helpers/FloatingInput";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Paperclip, X } from "lucide-react";
import useRegisterStore, { getStateValues } from "@/store/register.store";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { pointOfContractSchema } from "@/validation";
import { z } from "zod";
import { TelephoneInput } from "@/components/helpers";

const PointContactPage = () => {
  const router = useRouter();

  const setValues = useRegisterStore((state) => state.setValues);
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof pointOfContractSchema>>({
    resolver: zodResolver(pointOfContractSchema),
  });

  // Updating the locally saved values
  const contactData =
    typeof window !== "undefined" ? localStorage.getItem("contactData") : null;

  useEffect(() => {
    if (contactData) {
      const data = JSON.parse(contactData);
      data && setValues(data);
      Object.entries(data).forEach(([key, value]) => {
        // @ts-ignore
        setValue(key, value);
      });
    }
  }, [contactData]);

  const onSubmit: SubmitHandler<z.infer<typeof pointOfContractSchema>> = async (
    data: any
  ) => {
    setValues(data);
    localStorage.setItem("contactData", JSON.stringify(data));
    router.push("/register/corporate/current-banking");
  };

  const [pdfFile, setPdfFile] = useState<File | undefined>(undefined);

  return (
    <CorporateStepLayout
      step={2}
      title="Point of Contact"
      text="Give us the details of the POC our sales team should get in touch with after verification"
    >
      <form
        className="max-w-xl w-full shadow-md bg-white rounded-xl p-8 z-10 mt-5 flex flex-col gap-y-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-full relative">
          <FloatingInput
            register={register}
            type="text"
            name="pocName"
            placeholder="Authorized Point of Contact"
          />
          {errors.pocName && (
            <span className="mt-1 absolute text-[11px] text-red-500">
              {errors.pocName.message}
            </span>
          )}
        </div>
        <div className="flex items-center gap-x-2">
          <div className="w-full relative">
            <FloatingInput
              register={register}
              name="pocEmail"
              placeholder="Company Email"
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
              placeholder="pocPhone"
              setValue={setValue}
            />
            {errors.pocPhone && (
              <span className="mt-1 absolute text-[11px] text-red-500">
                {errors.pocPhone.message}
              </span>
            )}
          </div>
        </div>

        <div className="h-[2px] w-full bg-borderCol" />

        <div className="flex items-center gap-x-2">
          <div className="w-full relative">
            <FloatingInput
              type="text"
              name="poc"
              placeholder="Authorized POC"
              register={register}
            />
            {errors.poc && (
              <span className="mt-1 absolute text-[11px] text-red-500">
                {errors.poc.message}
              </span>
            )}
          </div>
          <div className="w-full relative">
            <FloatingInput
              type="text"
              name="pocDesignation"
              placeholder="POC Designation"
              register={register}
            />
            {errors.pocDesignation && (
              <span className="mt-1 absolute text-[11px] text-red-500">
                {errors.pocDesignation.message}
              </span>
            )}
          </div>
        </div>

        <div className="w-full">
          <label
            htmlFor="pdf-file"
            className="flex items-center justify-between border border-borderCol py-3 rounded-md px-4 cursor-pointer"
          >
            <div className="flex items-center gap-x-1">
              <Paperclip className="text-gray-500 size-4" />
              <p className="text-sm">Upload authorization letter</p>
            </div>
            <p className="relative text-sm text-[#333]">
              {pdfFile ? pdfFile.name.substring(0, 20) : "Select PDF file"}
              {pdfFile && (
                <div className="bg-red-500 text-white size-4 rounded-full center absolute text-[12px] -top-3 -right-2 z-20" onClick={() => setPdfFile(undefined)}>
                  <X />
                </div>
              )}
            </p>
          </label>
          <input
            type="file"
            id="pdf-file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => setPdfFile(e.target.files?.[0])}
          />
          {Object.entries(errors).length > 0 && !pdfFile && (
            <span className="text-[11px] text-red-500">
              Please select a file
            </span>
          )}
        </div>

        <div className="flex flex-col gap-y-2">
          <Button
            className="disabled:bg-borderCol disabled:text-[#B5B5BE] bg-primaryCol hover:bg-primaryCol/90 text-[16px] rounded-lg"
            size="lg"
            disabled={false}
          >
            Continue
          </Button>

          <Link href="/register/corporate/product-info" className="text-center">
            <Button
              type="button"
              variant="ghost"
              className="text-para text-[16px] w-full"
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
