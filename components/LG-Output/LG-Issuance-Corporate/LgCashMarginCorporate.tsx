import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, ListFilter, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { BgRadioInputLG, getLgBondTotal } from "../helper";
import { BidsSort } from "@/components/helpers";
import { BidCard } from "./BidCard";
import { convertDateToCommaString, formatAmount } from "@/utils";
import { CashMarginBidCard } from "./CashMarginBidCard";

const LGInfo = ({
  label,
  value,
  noBorder,
}: {
  label: string;
  value: string;
  noBorder?: boolean;
}) => {
  return (
    <div
      className={`flex items-start justify-between py-2 ${
        !noBorder && "border-b border-b-borderCol"
      }`}
    >
      <p className="font-roboto text-para font-normal text-base text-[#696974]">
        {label}
      </p>
      <p className="capitalize text-black font-semibold text-right text-base max-w-[60%]">
        {value}
      </p>
    </div>
  );
};

export const LGCashMarginCorporate = ({
  isViewAll,
  buttonTitle,
  data,
}: {
  buttonTitle?: string;
  isViewAll?: boolean;
  data: any;
}) => {
  const lgDetails = [
    { label: "LG Type", value: data?.typeOfLg },
    { label: "LG Standard Text", value: data?.lgDetails?.standardText },
    {
      label: "LG Tenor",
      value: `${data?.lgDetails?.lgTenor?.lgTenorValue} ${data?.lgDetails?.lgTenor?.lgTenorType}`,
    },
    {
      label: "Expected Date of LG Issuance",
      value: convertDateToCommaString(data?.lastDateOfReceivingBids),
    },
    { label: "Purpose Of LG", value: data?.purpose },
  ].filter((detail) => detail.value);

  const beneficiaryDetails = [
    { label: "Country", value: data?.beneficiaryDetails?.country },
    { label: "Name", value: data?.beneficiaryDetails?.name },
    { label: "Address", value: data?.beneficiaryDetails?.address },
    { label: "Phone Number", value: data?.beneficiaryDetails?.phoneNumber },
  ].filter((detail) => detail.value);

  const sortedBids = data?.bids?.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <Dialog>
      <DialogTrigger className={`center border  rounded-md w-full px-1 py-2`}>
        {isViewAll ? (
          <p>View all</p>
        ) : buttonTitle ? (
          <p> {buttonTitle}</p>
        ) : (
          <Eye className="size-5" />
        )}
      </DialogTrigger>
      <DialogContent className="h-full !max-h-[95vh] w-full max-w-6xl !p-0 flex flex-col">
        <div className="col-span-2 flex items-center justify-between border-b border-b-borderCol px-7 !py-5 max-h-20">
          <h2 className="text-lg font-semibold">LG Re-Issuance Request</h2>
          <DialogClose>
            <X className="size-7" />
          </DialogClose>
        </div>

        <div className="mt-0 flex w-full h-full items-start overflow-y-scroll">
          <div className="overflow-auto m-0 p-0 pb-8 w-full h-full border-r border-b border-t border-borderCol">
            <div className="border-b bg-[#F5F7F9] p-4 flex flex-col gap-3 border-[#F5F7F9]">
              <h5 className="text-sm text-[#696974] font-light">
                Created at,{" "}
                {new Date(data?.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}{" "}
                {new Date(data?.createdAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
                , by{" "}
                <span className="text-[#50B5FF]">
                  {data?.applicantDetails?.company}
                </span>
              </h5>
              <h1 className="text-[#92929D] text-2xl">
                LG Amount:{" "}
                <span className="font-semibold text-black">
                  {data?.lgDetails?.currency || "USD"}{" "}
                  {formatAmount(data?.lgDetails?.amount)}
                </span>
                <LGInfo
                  label={"Applicant City"}
                  value={data.createdBy.accountCity}
                />
                <LGInfo
                  label={"Applicant Country"}
                  value={data.applicantDetails.country}
                />
              </h1>
            </div>

            <div className="px-8">
              <h2 className="text-[18px] font-semibold mt-4 text-[#1A1A26]">
                Lg Details
              </h2>
              {lgDetails.map(
                (
                  detail: { label: string; value: string },
                  index: Key | null | undefined
                ) => (
                  <LGInfo
                    key={index}
                    label={detail.label}
                    value={detail.value}
                  />
                )
              )}
              <h2 className="text-[18px] font-semibold mt-6 text-[#1A1A26]">
                Beneficiary Details
              </h2>

              {beneficiaryDetails.map(
                (
                  detail: { label: string; value: string },
                  index: Key | null | undefined
                ) => (
                  <LGInfo
                    key={index}
                    label={detail.label}
                    value={detail.value}
                  />
                )
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="px-3 overflow-auto w-full pb-8 flex flex-col">
            <div className="flex items-center justify-between w-full pt-5">
              <div className="flex items-center gap-x-2">
                <p className="bg-primaryCol text-white font-semibold text-lg rounded-xl py-1 px-3">
                  {data?.bids?.length}
                </p>
                <p className="text-xl font-semibold">Bids received</p>
              </div>

              <div className="flex items-center gap-x-4">
                <BidsSort />
                <div className="flex items-center gap-x-1 text-sm">
                  <ListFilter className="size-5" />
                  <p>Filter</p>
                </div>
              </div>
            </div>

            {sortedBids.map((bidDetail: any, key: any) => (
              <CashMarginBidCard
                key={bidDetail._id}
                bidDetail={bidDetail}
                overallStatus={data.status}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
