"use client";
import { FloatingInput } from "@/components/helpers/FloatingInput";
import CorporateStepLayout from "@/components/layouts/CorporateStepLayout";
import { Button } from "@/components/ui/button";
import useRegisterStore from "@/store/register.store";
import { productsInfoSchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { TagsInput } from "react-tag-input-component";
import { useQuery } from "@tanstack/react-query";
import { getCurrenncy } from "@/services/apis/helpers.api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CurrencyDropdown = () => {
  const { data: currency } = useQuery({
    queryKey: ["currency"],
    queryFn: () => getCurrenncy(),
  });

  return (
    <Select onValueChange={(value) => {}}>
      <SelectTrigger className="border-[2px] border-primaryCol text-primaryCol rounded-lg w-16 h-12 text-sm font-medium bg-transparent px-1">
        <SelectValue placeholder="USD" className="text-sm" />
      </SelectTrigger>
      <SelectContent className="max-h-[300px]">
        {currency &&
          currency.response.length > 0 &&
          currency.response.map((curr: string, idx: number) => (
            <SelectItem
              defaultValue="USD"
              key={`${curr}-${idx + 1}`}
              value={curr}
            >
              {curr}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};

const ProductInfoPage = () => {
  const router = useRouter();
  const setValues = useRegisterStore((state) => state.setValues);
  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    
    formState: { errors,isDirty, isValid},
  } = useForm<z.infer<typeof productsInfoSchema>>({
    resolver: zodResolver(productsInfoSchema),
    mode:'all'
  });

  const productData =
    typeof window !== "undefined" ? localStorage.getItem("productData") : null;

  useEffect(() => {
    if (productData) {
      const data = JSON.parse(productData);
      data && setValues({ productInfo: data });
      Object.entries(data).forEach(([key, value]) => {
        // @ts-ignore
        setValue(key, value);
      });
    }
  }, [productData]);

  const [products, setProducts] = useState([]);

  const onSubmit: SubmitHandler<z.infer<typeof productsInfoSchema>> = async (
    data: any
  ) => {
    const { product, ...rest } = data;
    const values = {
      ...rest,
      products,
    };
    setValues({
      productInfo: values,
    });
    localStorage.setItem("productData", JSON.stringify(values));
    router.push("/register/corporate/point-contact");
  };

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
        <div className="w-full">
          {/* <FloatingInput
            register={register}
            type="text"
            name="product"
            placeholder="Your Product(s)"
          /> */}
          <TagsInput
            value={products}
            onChange={(val: any) => {
              setProducts(val);
              setValue("product", val.join(", "));
            }}
            name="product"
            placeHolder="Your Product(s)"
          />
          {errors.product && (
            <span className="text-[11px] text-red-500">
              {errors.product.message}
            </span>
          )}
        </div>

        <div className="w-full">
          <div className="flex items-center gap-x-2 w-full">
            {/* <div className="border-[2px] border-primaryCol text-primaryCol rounded-lg w-16 h-12 center font-medium">
              USD
            </div> */}
            <CurrencyDropdown />
            <div className="w-full">
              <FloatingInput
                register={register}
                type="number"
                inputMode="numeric"
                name="annualSalary"
                placeholder="Annual Sales of your Company"
              />
            </div>
          </div>
          {errors.annualSalary && (
            <span className="text-[11px] text-red-500">
              {errors.annualSalary.message}
            </span>
          )}
        </div>

        <div className="w-full">
          <div className="flex items-center gap-x-2 w-full">
            <CurrencyDropdown />
            <div className="w-full">
              <FloatingInput
                register={register}
                type="number"
                inputMode="numeric"
                name="annualValueExports"
                placeholder="Annual Value of Exports"
              />
            </div>
          </div>
          {errors.annualValueExports && (
            <span className="text-[11px] text-red-500">
              {errors.annualValueExports.message}
            </span>
          )}
        </div>
        <div className="w-full">
          <div className="flex items-center gap-x-2 w-full">
            <CurrencyDropdown />
            <div className="w-full">
              <FloatingInput
                register={register}
                type="number"
                inputMode="numeric"
                name="annualValueImports"
                placeholder="Annual Value of Imports"
              />
            </div>
          </div>
          {errors.annualValueImports && (
            <span className="text-[11px] text-red-500">
              {errors.annualValueImports.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-y-2">
          <Button
            className="disabled:bg-[#E2E2EA] disabled:text-[#B5B5BE] bg-primaryCol hover:bg-primaryCol/90 text-[16px] rounded-lg"
            size="lg"
            type="submit"
            disabled={!isValid || !isDirty}
          >
            Continue
          </Button>

          <Link href="/register/corporate" className="text-center">
            <Button
              type="button"
              variant="ghost"
              className="text-lightGray text-[16px] w-full"
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
