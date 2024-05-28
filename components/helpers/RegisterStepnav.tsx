"use client";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const RegisterStepnav = ({ step }: { step: number }) => {
  const pathname = usePathname();
  const isInfoPage = step === 1;
  const isContactPage = step === 2;
  const isCurrentBanking = step == 3;

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
      <nav className="flex font-roboto items-center gap-x-16">
        <div className="flex items-center gap-x-2">
          {!isInfoPage && (
            <Check strokeWidth={2.5} className="text-primaryCol size-5" />
          )}
          <p
            className={`${
              isInfoPage ? "text-primaryCol" : "text-black"
            } font-medium`}
          >
            Product Info
          </p>
        </div>

        <div className="flex items-center gap-x-2">
          {!isContactPage && !isInfoPage && (
            <Check strokeWidth={2.5} className="text-primaryCol size-5" />
          )}
          <p
            className={`${
              isContactPage
                ? "text-primaryCol font-medium"
                : isInfoPage
                ? "text-para"
                : "text-black font-medium"
            }`}
          >
            Point of Contact
          </p>
        </div>

        <div className="flex items-center gap-x-2">
          <p
            className={`${
              isCurrentBanking ? "text-primaryCol font-medium" : "text-para"
            }`}
          >
            Current Banking
          </p>
        </div>
      </nav>
      {/* Extra space */}
      <div></div>
      <div
        className="h-0.5 absolute bottom-0 left-0 bg-primaryCol transition-all duration-150"
        style={{ width: step === 1 ? "45%" : step === 2 ? "70%" : "100%" }}
      />
    </header>
  );
};
