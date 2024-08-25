"use client";
import Link from "next/link";
import { UserProfile } from "../helpers/UserProfile";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/services/apis";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { toast } from "sonner";

export const Header = () => {
  const pathname = usePathname();

  const { user, setUser } = useAuth();
  const router = useRouter();

  // Fetching current User
  const { data, isLoading } = useQuery({
    queryKey: ["current-user"],
    queryFn: () => getCurrentUser(),
    initialData: user ? { success: true, response: user } : undefined,
  });
  if (!isLoading && data && !data.success) {
    localStorage.removeItem("accessToken");
    Cookies.remove("accessToken");
    toast.error("Session expired");
    router.push("/login");
  }
  useEffect(() => {
    if (!isLoading && data && data.success && data.response) {
      setUser(data.response);
    }
  }, [data]);

  return (
    <header className="relative 2xl:px-20 px-6 xl:px-10 flex items-center justify-between gap-x-2 ">
      <div className="flex flex-col xl:flex-row items-center gap-x-2 py-4">
        <Image
          src="/images/logo.svg"
          alt="logo"
          width={500}
          height={500}
          className="object-cover size-8"
        />
        <Link href="/" className="font-normal text-2xl">
          <span className="font-semibold">Trade</span>Risk
        </Link>
      </div>
      <nav className="flex items-center gap-x-4 lg:gap-x-10 xl:gap-x-20">
        {user && user.type === "bank" ? (
          <>
            <div className="relative py-6">
              <Link
                href="/dashboard"
                className={`${
                  pathname === "/dashboard"
                    ? "text-primaryCol"
                    : "hover:text-primaryCol transition-colors duration-150"
                }  font-semibold`}
              >
                Corporate Deals
              </Link>
              {pathname === "/dashboard" && (
                <div className="absolute top-0 h-1.5 rounded-b-full w-full bg-primaryCol" />
              )}
            </div>

            <div className="relative py-6">
              <Link
                href="/my-bids"
                className={`${
                  pathname === "/my-bids"
                    ? "text-primaryCol"
                    : "hover:text-primaryCol transition-colors duration-150"
                }  font-semibold`}
              >
                My Bids 
              </Link>
              {pathname === "/my-bids" && (
                <div className="absolute top-0 h-1.5 rounded-b-full w-full bg-primaryCol" />
              )}
            </div>

            <div className="relative py-6">
              <Link
                href="/risk-participation"
                className={`${
                  pathname === "/risk-participation"
                    ? "text-primaryCol"
                    : "hover:text-primaryCol transition-colors duration-150"
                }  font-semibold`}
              >
                Risk Participation
              </Link>
              {pathname === "/risk-participation" && (
                <div className="absolute top-0 h-1.5 rounded-b-full w-full bg-primaryCol" />
              )}
            </div>

            <div className="relative py-6">
              <Link
                href="/risk-assessment"
                className={`${
                  pathname === "/risk-assessment"
                    ? "text-primaryCol"
                    : "hover:text-primaryCol transition-colors duration-150"
                }  font-semibold`}
              >
                Risk Assessment
              </Link>
              {pathname === "/risk-assessment" && (
                <div className="absolute top-0 h-1.5 rounded-b-full w-full bg-primaryCol" />
              )}
            </div>
          </>
        ) : (
          <>
            <div className="relative py-6">
              <Link
                href="/"
                className={`${
                  pathname === "/"
                    ? "text-primaryCol"
                    : "hover:text-primaryCol transition-colors duration-150"
                }  font-semibold`}
              >
                My Requests
              </Link>
              {pathname === "/" && (
                <div className="absolute top-0 h-1.5 rounded-b-full w-full bg-primaryCol" />
              )}
            </div>
            <div className="relative py-6">
              <Link
                href="/corporate-bids?filter=LC Confirmation"
                className={`${
                  pathname.includes("/corporate-bids")
                    ? "text-primaryCol"
                    : "hover:text-primaryCol transition-colors duration-150"
                }  font-semibold`}
              >
                My Bids
              </Link>
              {pathname.includes("/corporate-bids") && (
                <div className="absolute top-0 h-1.5 rounded-b-full w-full bg-primaryCol" />
              )}
            </div>

            <div className="relative py-6">
              <Link
                href="/create-request"
                className={`${
                  pathname === "/create-request"
                    ? "text-primaryCol"
                    : "hover:text-primaryCol transition-colors duration-150"
                }  font-semibold`}
              >
                Create a Request
              </Link>
              {pathname.includes("/create-request") && (
                <div className="absolute top-0 h-1.5 rounded-b-full w-full bg-primaryCol" />
              )}
            </div>
            <div className="relative py-6">
              <Link
                href="/risk-assessment"
                className={`${
                  pathname === "/risk-assessment"
                    ? "text-primaryCol"
                    : "hover:text-primaryCol transition-colors duration-150"
                }  font-semibold`}
              >
                Risk Assessment
              </Link>
              {pathname === "/risk-assessment" && (
                <div className="absolute top-0 h-1.5 rounded-b-full w-full bg-primaryCol" />
              )}
            </div>
          </>
        )}
        {!user && <div></div>}
      </nav>
      <div>
        <UserProfile />
      </div>
    </header>
  );
};
