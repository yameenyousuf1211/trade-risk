"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "../ui/button";
import Image from "next/image";
import { useAuth } from "@/context/AuthProvider";
import { usePathname } from "next/navigation";
import { ApiResponse, ILcs } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import { fetchLcs } from "@/services/apis/lcs.api";
import useStepStore from "@/store/lcsteps.store";
import { CheckIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

const Separator = () => {
  return (
    <BreadcrumbSeparator>
      <Image
        src="/images/arrow.png"
        alt="arr"
        width={8}
        height={8}
        className=""
      />
    </BreadcrumbSeparator>
  );
};

export const BreadcrumbDetails = ({ isLg }: { isLg: boolean }) => {
  const crumbs = [
    "Transaction as",
    "Amount",
    "LC Details",
    "Importer Info",
    "Exporter Info",
    "Confirmation Charges",
    "Attachments",
  ];

  const lgCrumbs = [
    "Choose Type",
    "Applicant Details",
    "LG issuing Bank",
    "Type of LG",
    "Standard Text",
    "LG Details",
    "Beneficiary",
    "Physical LG",
    "Remarks",
    "Price Quote",
  ];

  const { stepStatus, isSubmitted } = useStepStore();

  const { user } = useAuth();
  const pathname = usePathname();
  const isConfirmation = pathname === "/create-request";
  const isDiscounting = pathname === "/create-request/discount";
  const isConfirmationDiscounting = pathname === "/create-request/confirmation";
  const isLgIssuance = pathname === "/create-request/lg-issuance";

  const scrollToForm = () => {
    document?.querySelector('#step1')?.scroll({ behavior: 'smooth' });
  };

  const { data }: { data: ApiResponse<ILcs> | undefined; error: any; isLoading: boolean } =
    useQuery({
      queryKey: ["fetch-lcs-drafts"],
      queryFn: () => fetchLcs({ draft: true, userId: user._id }),
      enabled: !!user?._id,
    });

  const filteredData =
    data &&
    data.data.length > 0 &&
    data?.data.filter((draft) => {
      if (isConfirmation) {
        return draft.type === "LC Confirmation";
      } else if (isDiscounting) {
        return draft.type === "LC Discounting";
      } else if (isConfirmationDiscounting) {
        return draft.type === "LC Confirmation & Discounting";
      } else if (isLgIssuance) {
        return draft.type === "LG Issuance";
      } else {
        return true;
      }
    });

  const breadcrumbItems = isLg ? lgCrumbs : crumbs;

  return (
    <div className="bg-bg sticky top-0 relative z-[2] flex items-center justify-between gap-x-2">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((crumb, idx) => (
            <div className="flex items-center gap-x-2" key={`${crumb}-${idx}`}>
              <div className="flex gap-1 items-center">
                {stepStatus[idx] && (
                  <div>
                    <CheckIcon color="#29C084" size={20} />
                  </div>
                )}
                {isSubmitted && !stepStatus[idx] && (
                  <div>
                    <XIcon color="red" size={20} />
                  </div>
                )}

                <BreadcrumbItem key={`${crumb}-${idx}`}>
                  <Link href={`${pathname}#${isLg ? 'lg-step' : 'step'}${idx + 1}`}>
                    {crumb}
                  </Link>
                </BreadcrumbItem>
              </div>
              {idx !== breadcrumbItems.length - 1 && <Separator />}
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <Link href="#step7">
        <Button className="bg-transparent text-para hover:bg-para hover:text-white rounded-lg py-1 border border-para">
          Draft
          {/* ({(filteredData && filteredData.length) || 0}) */}
        </Button>
      </Link>
    </div>
  );
};
