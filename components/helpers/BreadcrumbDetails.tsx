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
import { CheckIcon } from "lucide-react";

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

export const BreadcrumbDetails = () => {
  const crumbs = [
    "Transaction as",
    "Amount",
    "LC Details",
    "Importer Info",
    "Exporter Info",
    "Confirmation Charges",
    "Attachments",
  ];

  const { stepStatus } = useStepStore();

  const { user } = useAuth();
  const pathname = usePathname();
  const isConfirmation = pathname === "/create-request";
  const isDiscounting = pathname === "/create-request/discount";
  const isConfirmationDiscounting = pathname === "/create-request/confirmation";

  const {
    isLoading,
    data,
  }: { data: ApiResponse<ILcs> | undefined; error: any; isLoading: boolean } =
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
        return draft.lcType === "LC Confirmation";
      } else if (isDiscounting) {
        return draft.lcType === "LC Discounting";
      } else if (isConfirmationDiscounting) {
        return draft.lcType === "LC Confirmation & Discounting";
      } else {
        return true;
      }
    });

  return (
    <div className="flex items-center justify-between gap-x-2">
      <Breadcrumb>
        <BreadcrumbList>
          {crumbs.map((crumb, idx) => (
            <div className="flex items-center gap-x-2" key={`${crumb}-${idx}`}>
              <div className="flex gap-1 items-center">
                {stepStatus[idx] && (
                 <div>
                  <CheckIcon color="#29C084" size={20}/>
                 </div>
                )}
                <BreadcrumbItem key={`${crumb}-${idx}`}>
                  <BreadcrumbList>{crumb}</BreadcrumbList>
                </BreadcrumbItem>
              </div>
              {idx !== crumbs.length - 1 && <Separator />}
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <Button className="bg-transparent text-para hover:bg-para hover:text-white rounded-lg py-1 border border-para">
        Drafts ({(filteredData && filteredData.length) || 0})
      </Button>
    </div>
  );
};
