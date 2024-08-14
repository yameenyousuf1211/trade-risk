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

import { LG } from "@/utils";
import { useForm } from "react-hook-form";
import useBreadCrumbsTypeStore from "@/store/breadCrumbsType.store";
import { useEffect } from "react";
import {
  AMOUNT,
  APPLICANT_DETAILS,
  ATTACHMENTS,
  BENEFICIARY,
  CHOOSE_TYPE,
  CONFIRMATION_CHARGES,
  EXPORTER_INFO,
  IMPORTER_INFO,
  LC_DETAILS,
  LG_DETAILS,
  LG_ISSUING_BANK,
  PHYSICAL_LG,
  PRICE_QUOTE,
  REMARKS,
  STANDARD_TEXT,
  TRANSACTION_AS,
  TYPE_OF_LG,
} from "@/utils/constant/lg";

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
    TRANSACTION_AS,
    AMOUNT,
    LC_DETAILS,
    IMPORTER_INFO,
    EXPORTER_INFO,
    CONFIRMATION_CHARGES,
    ATTACHMENTS,
  ];

  const lgCrumbs = [
    CHOOSE_TYPE,
    APPLICANT_DETAILS,
    LG_ISSUING_BANK,
    TYPE_OF_LG,
    STANDARD_TEXT,
    LG_DETAILS,
    BENEFICIARY,
    PHYSICAL_LG,
    REMARKS,
    PRICE_QUOTE,
  ];

  const lgCrumbs2 = [
    CHOOSE_TYPE,
    APPLICANT_DETAILS,
    LG_ISSUING_BANK,
    LG_DETAILS,
    BENEFICIARY,
    REMARKS,
    PRICE_QUOTE,
  ];
  const { stepStatus, isSubmitted } = useStepStore();

  const stepCompleted = (step: string) => stepStatus?.find((e) => e === step) ? true: false;

  const { user } = useAuth();
  const pathname = usePathname();
  const isConfirmation = pathname === "/create-request";
  const isDiscounting = pathname === "/create-request/discount";
  const isConfirmationDiscounting = pathname === "/create-request/confirmation";
  const isLgIssuance = pathname === "/create-request/lg-issuance";

  const { watch } = useForm();

  const {
    data,
  }: { data: ApiResponse<ILcs> | undefined; error: any; isLoading: boolean } =
    useQuery({
      queryKey: ["fetch-lcs-drafts"],
      queryFn: () => fetchLcs({ draft: true, userId: user._id }),
      enabled: !!user?._id,
    });

  const filteredData =
    data &&
    data?.data?.length &&
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

  const { value } = useBreadCrumbsTypeStore();

  const breadcrumbItems = isLg
    ? value == LG.reIssuanceInAnotherCountry
      ? lgCrumbs2
      : lgCrumbs
    : crumbs;

  return (
    <div className="bg-bg sticky top-0 relative z-[2] flex items-center justify-between gap-x-2">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((crumb, idx) => (
            <div className="flex items-center gap-x-2" key={`${crumb}-${idx}`}>
              <div className="flex gap-1 items-center">
                {stepCompleted(crumb) && (
                  <div>
                    <CheckIcon color="#29C084" size={20} />
                  </div>
                )}
                {isSubmitted && !stepCompleted(crumb) && (
                  <div>
                    <XIcon color="red" size={20} />
                  </div>
                )}

                <BreadcrumbItem key={`${crumb}-${idx}`}>
                  <Link
                    href={`${pathname}#${isLg ? "lg-step" : "step"}${idx + 1}`}
                  >
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
          Save as draft
          {/* ({(filteredData && filteredData.length) || 0}) */}
        </Button>
      </Link>
    </div>
  );
};
