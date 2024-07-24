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

const AmountInput = ({
  register,
  setValue,
  name,
  value,
  placeholder,
  trigger,
}: {
  register: any;
  setValue: any;
  name: string;
  value: string;
  placeholder: string;
  trigger: any;
}) => {
  const [currencyValue, setCurrencyValue] = useState(value || "");
  const [rawValue, setRawValue] = useState(value || "");

  const handleChange = (e: any) => {
    const { value } = e.target;
    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly) {
      const formattedValue = parseInt(digitsOnly).toLocaleString();
      setCurrencyValue(formattedValue);
      setRawValue(digitsOnly);
      setValue(name, digitsOnly);
      trigger(name);
    } else {
      setCurrencyValue("");
      setRawValue("");
      setValue(name, "");
    }
  };

  const handleBlur = () => {
    if (rawValue) {
      const formattedValueWithCents = `${parseInt(
        rawValue
      ).toLocaleString()}.00`;
      setCurrencyValue(formattedValueWithCents);
    }
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        inputMode="numeric"
        name={name}
        {...register(name)}
        value={currencyValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className="z-[1] font-roboto relative px-2.5 pb-2.5 pt-2.5 w-full text-sm text-lightGray bg-transparent rounded-lg border border-borderCol appearance-none focus:outline-none focus:ring-0 focus:border-text peer"
        placeholder=""
      />
      <label
        htmlFor={name}
        className="pointer-events-none z-[1] absolute text-sm text-gray-400  duration-300 transform -translate-y-4 scale-75 top-2 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-text peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
      >
        {placeholder}
      </label>
    </div>
  );
};

const ProductInfoPage = () => {
  const router = useRouter();
  const setValues = useRegisterStore((state) => state.setValues);
  const {
    register,
    setValue,
    handleSubmit,
    trigger,
    formState: { errors, isDirty, isValid },
  } = useForm<z.infer<typeof productsInfoSchema>>({
    resolver: zodResolver(productsInfoSchema),
    mode: "all",
  });

  const productData =
    typeof window !== "undefined" ? localStorage.getItem("productData") : null;

  const [products, setProducts] = useState<string[]>([]);
  const [productInput, setProductInput] = useState("");
  const [allowSubmit, setAllowSubmit] = useState(false);

  useEffect(() => {
    if (productData) {
      const data = JSON.parse(productData);
      data && setValues({ productInfo: data });
      data && setProducts(data.products);
      Object.entries(data).forEach(([key, value]) => {
        // @ts-ignore
        setValue(key, value);
      });
    }
  }, [productData]);

  useEffect(() => {
    if (productData) {
      setAllowSubmit(true);
    } else if (isValid && isDirty) {
      setAllowSubmit(true);
    } else {
      (!isValid || !isDirty || products.length <= 0) && setAllowSubmit(false);
    }
  }, [errors, isValid, isDirty, productData]);

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
    
    console.log("Checking Product Values Schema",values);
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
        className="max-w-xl w-full shadow-md bg-white rounded-2xl p-8 z-10 mt-3 flex flex-col gap-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-full">
          <TagsInput
            value={products}
            onChange={(val: any) => {
              setProducts(val);
              setValue("product", val.join(", "));
              setProductInput("");
              // val.length >= 1 && setAllowSubmit(true);
            }}
            onKeyUp={(e) => {
              if (e.key.length === 1) {
                setProductInput((prev) => prev + e.key);
              }
            }}
            onBlur={(e: any) => {
              if (e.target.value) {
                setProducts((prev: any) => [...prev, e.target.value]);
                setTimeout(() => {
                  e.target.value = "";
                }, 10);
              }
              setProductInput("");
            }}
            onRemoved={() => {
              products.length <= 1 && setAllowSubmit(false);
            }}
            name="product"
            placeHolder={"Your Product(s)"}
          />
          {errors.product && products?.length === 0 && (
            <span className="text-[11px] text-red-500">
              {errors.product.message}
            </span>
          )}
        </div>

        <div className="w-full">
          <div className="flex items-center gap-x-2 w-full">
            <div className="border-[2px] font-roboto border-primaryCol text-primaryCol rounded-lg w-16 h-12 center font-medium">
              USD
            </div>
            <div className="w-full">
              <AmountInput
                register={register}
                setValue={setValue}
                name="annualSalary"
                placeholder="Annual Sales of your Company"
                value={
                  (productData && JSON.parse(productData)?.annualSalary) || ""
                }
                trigger={trigger}
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
            <div className="border-[2px] font-roboto border-primaryCol text-primaryCol rounded-lg w-16 h-12 center font-medium">
              USD
            </div>
            <div className="w-full">
              <AmountInput
                register={register}
                setValue={setValue}
                name="annualValueExports"
                placeholder="Annual Value of Exports"
                value={
                  (productData &&
                    JSON.parse(productData)?.annualValueExports) ||
                  ""
                }
                trigger={trigger}
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
            <div className="border-[2px] font-roboto border-primaryCol text-primaryCol rounded-lg w-16 h-12 center font-medium">
              USD
            </div>
            <div className="w-full">
              <AmountInput
                register={register}
                setValue={setValue}
                name="annualValueImports"
                placeholder="Annual Value of Imports"
                value={
                  (productData &&
                    JSON.parse(productData)?.annualValueImports) ||
                  ""
                }
                trigger={trigger}
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
            // disabled={!allowSubmit}
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
