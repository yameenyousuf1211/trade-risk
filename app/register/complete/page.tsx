import RegisterComplete from "@/components/layouts/RegisterComplete";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

const RegisterCompletepage = () => {
 
  return (
    <RegisterComplete>
      <section className="p-4 flex items-center justify-center flex-col bg-white/80 mx-10 sm:w-[97%] w-[90%] min-h-[90vh] h-full z-10 rounded-lg">
        <div className="flex items-center gap-x-4">
          <Image
            src="/images/logo.svg"
            alt="logo"
            width={500}
            height={500}
            className="object-cover size-16"
          />
          <h1 className="font-normal text-5xl">
            <span className="font-semibold">Trade</span>Risk
          </h1>
        </div>
        <div className="flex flex-col items-center gap-y-4 mt-10">
          <h2 className="text-2xl text-[#1A1A26] font-semibold text-center">
            Information Submitted!
          </h2>
          <p className="text-sm  font-bold max-w-lg text-center text-[#5625F2]">
            Thank you for adding your information. We will verify your
            information and a sales agent will contact you soon to conclude your
            onboarding.
          </p>

          <Link href="/login">
            <Button
              size="lg"
              className="px-8 py-5 bg-[#C0C0C0] hover:bg-[#c0c0c0c4] rounded-lg text-black"
            >
              Learn more about us
            </Button>
          </Link>
        </div>
      </section>
    </RegisterComplete>
  );
};

export default RegisterCompletepage;
