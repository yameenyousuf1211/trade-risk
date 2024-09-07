"use client";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const RegisterStepnav = ({ step }: { step: number }) => {
  const pathname = usePathname();
  const isCompanyInfo = step === 1;
  const isProductInfo = step === 2;
  const isContactPage = step === 3;
  const isCurrentBanking = step === 4;

  const getStepClass = (isCurrentStep: boolean, isCompleted: boolean) => {
    if (isCurrentStep) {
      return "text-primaryCol font-medium"; // Current step - purple
    } else if (isCompleted) {
      return "text-primaryCol"; // Completed step - purple with check
    }
    return "text-gray-400"; // Incomplete step - grey
  };

  return (
    <header className="relative flex items-center justify-between py-4 md:px-10 px-4 bg-white">
      {/* Logo */}
      <Link href="/login" className="flex items-center justify-center gap-2">
        <Image
          src="/images/logo.svg"
          alt="logo"
          width={50}
          height={50}
          className="object-cover size-10"
        />
        <h1 className="font-normal text-2xl">
          <span className="font-semibold">Trade</span>Risk
        </h1>
      </Link>
      {/* Nav */}
      <nav className="flex font-roboto items-center gap-x-16 mr-40">
        {/* Company Info Step */}
        <div className="flex items-center gap-x-2">
          {step > 1 && (
            <Check strokeWidth={2.5} className="text-primaryCol size-5" />
          )}
          <p className={getStepClass(isCompanyInfo, step > 1)}>Company Info</p>
        </div>

        {/* Product Info Step */}
        <div className="flex items-center gap-x-2">
          {step > 2 && (
            <Check strokeWidth={2.5} className="text-primaryCol size-5" />
          )}
          <p className={getStepClass(isProductInfo, step > 2)}>Product Info</p>
        </div>

        {/* Point of Contact Step */}
        <div className="flex items-center gap-x-2">
          {step > 3 && (
            <Check strokeWidth={2.5} className="text-primaryCol size-5" />
          )}
          <p className={getStepClass(isContactPage, step > 3)}>
            Point of Contact
          </p>
        </div>

        {/* Current Banking Step */}
        <div className="flex items-center gap-x-2">
          <p className={getStepClass(isCurrentBanking, step === 4)}>
            Current Banking
          </p>
        </div>
      </nav>

      {/* Extra space */}
      <div></div>
      <div
        className="h-0.5 absolute bottom-0 left-0 bg-primaryCol transition-all duration-150"
        style={{
          width:
            step === 1
              ? "25%"
              : step === 2
              ? "50%"
              : step === 3
              ? "75%"
              : "100%",
        }}
      />
    </header>
  );
};
