"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import AuthLayout from "@/components/layouts/AuthLayout";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState("");

  const navigate = () => {
    if (!role) return;
    router.push(`/register/${role === "corporate" ? "corporate" : "bank"}`);
  };

  return (
    <AuthLayout>
      <section className="max-w-xl mx-auto w-full max-xs:px-4 z-10">
        <h2 className="font-bold text-5xl text-center">Register</h2>
        <p className="text-para font-roboto text-center mt-5">
          Please select your business entity{" "}
        </p>

        <div className="bg-white shadow-md rounded-xl p-8 mt-8 flex flex-col gap-y-8">
          <div className="flex items-center justify-between gap-x-4">
            <div
              className={`${
                role === "corporate"
                  ? "border-2 border-primaryCol shadow-lg bg-[#5625F20A]"
                  : "border border-neutral-200"
              }  rounded-xl w-full flex flex-col items-center gap-y-4 p-5 cursor-pointer`}
              onClick={() => setRole("corporate")}
            >
              <Image
                src="/images/corporate-register.png"
                alt="corporate"
                width={500}
                height={500}
                className="object-contain size-24"
              />
              <p
                className={`${
                  role === "corporate" && "text-primaryCol"
                } text-sm`}
              >
                Register as a Corporate
              </p>
            </div>
            <div
              className={`${
                role === "bank"
                  ? "border-2 border-primaryCol shadow-lg bg-[#5625F20A]"
                  : "border border-neutral-200"
              }  rounded-xl w-full flex flex-col items-center gap-y-4 p-5 cursor-pointer`}
              onClick={() => setRole("bank")}
            >
              <Image
                src="/images/bank-register.png"
                alt="bank"
                width={500}
                height={500}
                className="object-contain size-24"
              />
              <p className={`${role === "bank" && "text-primaryCol"} text-sm`}>
                Register as a Bank
              </p>
            </div>
          </div>

          <Button
            className="py-6 disabled:bg-[#E2E2EA] disabled:text-[#B5B5BE] bg-primaryCol hover:bg-primaryCol/90 text-[16px] rounded-lg"
            size="lg"
            disabled={!role}
            onClick={navigate}
          >
            Continue
          </Button>
        </div>
      </section>
    </AuthLayout>
  );
}
