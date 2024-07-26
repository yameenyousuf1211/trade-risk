"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const CreateTabs = () => {
  const pathname = usePathname();

  return (
    <div className="flex  items-center gap-x-8 mb-2 border-b-2 border-borderCol">
      <div className="relative py-3">
        <Link
          href="/create-request"
          className={`${
            pathname === "/create-request"
              ? "text-primaryCol font-medium"
              : "text-lightGray"
          }`}
        >
          LC Confirmation
        </Link>
        {pathname === "/create-request" && (
          <div className="absolute bottom-0 h-1 w-full bg-primaryCol" />
        )}
      </div>
      <div className="relative py-3">
        <Link
          href="/create-request/discount"
          className={`${
            pathname === "/create-request/discount"
              ? "text-primaryCol font-medium"
              : "text-lightGray"
          }`}
        >
          LC Discounting
        </Link>
        {pathname === "/create-request/discount" && (
          <div className="absolute bottom-0 h-1 w-full bg-primaryCol" />
        )}
      </div>
      <div className="relative py-3">
        <Link
          href="/create-request/confirmation"
          className={`${
            pathname === "/create-request/confirmation"
              ? "text-primaryCol font-medium"
              : "text-lightGray"
          }`}
        >
          LC Confirmation & Discounting
        </Link>
        {pathname === "/create-request/confirmation" && (
          <div className="absolute bottom-0 h-1 w-full bg-primaryCol" />
        )}
      </div>
      <div className="relative py-3">
        <Link href="/create-request/lg-issuance" className="text-lightGray">
          LC Issuance
        </Link>
        {pathname === "/create-request/lg-issuance" && (
          <div className="absolute bottom-0 h-1 w-full bg-primaryCol" />
        )}
      </div>
    </div>
  );
};
