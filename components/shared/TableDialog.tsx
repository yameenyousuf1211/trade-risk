"use client";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Eye, ListFilter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IBids } from "@/types/type";
import { acceptOrRejectBid } from "@/services/apis/bids.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  convertDateAndTimeToStringGMTNoTsx,
  convertDateToCommaString,
} from "@/utils";
import { toast } from "sonner";
import { fetchSingleLc } from "@/services/apis/lcs.api";
import { useAuth } from "@/context/AuthProvider";
import { BidsSort } from "../helpers";
import { fetchSingleRisk } from "@/services/apis/risk.api";
import Image from "next/image";
import LGIssuanceDialog from "../LG-Output/LG-Issuance-Bank/LGIssuance";
import { LGCashMarginDialog } from "../LG-Output/Bank/LG-Cash-Margin/LGCashMargin";
import ViewFileAttachment from "./ViewFileAttachment";
import { convertDateAndTimeToStringGMT } from "@/utils/helper/dateAndTimeGMT";
import { formatFirstLetterOfWord, LcLgInfo } from "../LG-Output/helper";
import {
  formatAmount,
  formatNumberByAddingDigitsToStart,
} from "../../utils/helper/helper";
import LGIssuanceCashMarginDialog from "../LG-Output/LG-Issuance-Bank/LGIssuanceCashMargin";

export const BidCard = ({
  data,
  isBank,
  isRisk,
}: {
  data: IBids;
  isBank?: boolean;
  isRisk?: boolean;
}) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: acceptOrRejectBid,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bid-status"] });
    },
  });

  // Function to check if the bid has expired
  const isExpired = new Date(data.bidValidity) < new Date();

  const handleSubmit = async (status: string, id: string) => {
    const { success, response } = await mutateAsync({
      status,
      id,
      key: isRisk ? "risk" : "lc",
    });
    if (!success) return toast.error(response as string);
    else {
      let closeBtn = document.getElementById("close-button");
      // @ts-ignore
      closeBtn.click();
      toast.success(`Bid ${status}`);
    }
  };

  return (
    <div
      className={`rounded-lg border border-borderCol px-3 py-5 ${
        isExpired ? "opacity-60" : ""
      }`}
    >
      <div className="grid grid-cols-2 gap-y-4">
        <div>
          <p className="mb-1 text-sm text-para">Bid Number</p>
          <p className="text-lg font-semibold">
            {formatNumberByAddingDigitsToStart(data.bidNumber)}
          </p>
        </div>
        <div>
          <p className="mb-1 text-sm capitalize text-para">Submitted by</p>
          <p className="text-lg font-semibold capitalize">
            {formatFirstLetterOfWord(data.bidBy?.name) || ""}
          </p>
        </div>
        {data.bidType !== "LC Discounting" && (
          <div>
            <p className="mb-1 text-sm text-para">Confirmation Rate</p>
            <p className="text-lg font-semibold text-text">
              {data?.confirmationPrice}%{" "}
              <span className="text-black">per annum</span>
            </p>
          </div>
        )}
        {data?.discountMargin &&
          data.bidType === "LC Confirmation & Discounting" && (
            <div>
              <p className="mb-1 text-sm text-para">Discount Pricing</p>
              <p className="text-lg font-semibold">
                {`${data.discountBaseRate.toUpperCase()} + `}
                <span className="text-text">{`${data.discountMargin}%`}</span>
              </p>
            </div>
          )}
        {data?.discountMargin && data.bidType === "LC Discounting" && (
          <div>
            <p className="mb-1 text-sm text-para">Discount Rate</p>
            <p className="text-lg font-semibold">
              {data?.discountBaseRate.toUpperCase()} +{" "}
              <span className="text-text">{data.discountMargin}% </span>
            </p>
          </div>
        )}
        <div>
          <p className="mb-1 text-sm text-para ">Country</p>
          <p className="text-lg font-semibold capitalize">
            {data.bidBy.country}
          </p>
        </div>
        {user.type === "corporate" && (
          <div>
            <p className="mb-1 text-sm text-para">Bid Submitted</p>
            <p className="text-lg font-semibold">
              {convertDateAndTimeToStringGMT({
                date: data.createdAt,
                sameLine: false,
              })}
            </p>
          </div>
        )}
        <div>
          <p className="mb-1 text-sm text-para">Bid Expiry</p>
          <p className="text-lg font-semibold">
            {convertDateAndTimeToStringGMT({
              date: data.bidValidity,
              sameLine: false,
            })}
          </p>
        </div>
        {data.bidType === "LC Discounting" && (
          <div>
            <p className="mb-1 text-sm text-para">Term</p>
            <p className="text-lg font-semibold text-text">
              <span className="text-black">
                {data.perAnnum ? "Per Annum" : "Flat"}
              </span>
            </p>
          </div>
        )}

        {data.status === "Pending" && !isBank && (
          <>
            {isExpired ? (
              // Show Bid Expired div if the bid is expired
              <div className="col-span-2 mt-2 flex justify-center items-center bg-black text-white rounded-lg py-2">
                Bid Expired
              </div>
            ) : (
              // Show Accept and Reject buttons if the bid is not expired
              <div className="col-span-2 mt-2 flex gap-4">
                <Button
                  size="lg"
                  className="flex-1 bg-[#29C084] hover:bg-[#29C084]/90"
                  onClick={() => handleSubmit("Accepted", data._id)}
                  disabled={isPending}
                >
                  Accept
                </Button>
                <Button
                  size="lg"
                  className="flex-1 bg-[#f4f7fa] text-para"
                  variant="ghost"
                  onClick={() => handleSubmit("Rejected", data._id)}
                  disabled={isPending}
                >
                  Reject
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {(data.status !== "Pending" ||
        (data.status === "Pending" && data.createdBy === user?._id)) && (
        <Button
          className={`${
            data.status === "Accepted"
              ? "bg-[#29C08433] hover:bg-[#29C08433]"
              : data.status === "Rejected"
              ? "bg-[#FF02021A] hover:bg-[#FF02021A]"
              : "bg-[#F4D0131A] hover:bg-[#F4D0131A]"
          } mt-2 w-full cursor-default text-black`}
        >
          {data.status === "Accepted"
            ? "Bid Accepted"
            : data.status === "Rejected"
            ? "Bid Rejected"
            : data.status === "Pending"
            ? `Bid Submitted on ${convertDateAndTimeToStringGMTNoTsx(
                data.createdAt
              )}`
            : ""}
        </Button>
      )}
    </div>
  );
};

export const TableDialog = ({
  lcData,
  bids,
  isBank,
  isViewAll,
  buttonTitle,
  isRisk = false,
}: {
  lcData: any;
  bids: IBids[];
  isBank?: boolean;
  buttonTitle?: string;
  isViewAll?: boolean;
  isRisk?: boolean;
}) => {
  const { user } = useAuth();
  const userBids =
    isBank && user && bids?.filter((bid) => bid?.createdBy === user?._id);

  const otherBond = lcData?.otherBond?.cashMargin ?? 0;
  const bidBond = lcData?.bidBond?.cashMargin ?? 0;
  const advancePaymentBond = lcData?.advancePaymentBond?.cashMargin ?? 0;
  const performanceBond = lcData?.performanceBond?.cashMargin ?? 0;
  const retentionMoneyBond = lcData?.retentionMoneyBond?.cashMargin ?? 0;
  const total =
    otherBond +
    bidBond +
    advancePaymentBond +
    performanceBond +
    retentionMoneyBond;

  const sortedBids = (bidsArray: IBids[]) => {
    return bidsArray.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  return (
    <Dialog>
      <DialogTrigger
        className={`${
          isViewAll
            ? "font-roboto text-sm font-light text-primaryCol underline"
            : `center w-full rounded-md border px-1 py-2 ${
                buttonTitle === "Accept" || buttonTitle === "Reject"
                  ? "bg-[#2F3031] px-7 text-white"
                  : null
              } `
        }`}
      >
        {isViewAll ? (
          <p>View all</p>
        ) : buttonTitle ? (
          <p> {buttonTitle}</p>
        ) : (
          <Eye className="size-5" />
        )}
      </DialogTrigger>
      <DialogContent className="h-full !max-h-[95vh] w-full max-w-6xl !p-0 flex flex-col">
        <div className="flex max-h-20 items-center justify-between border-b border-b-borderCol !py-5 px-7">
          <div className="flex flex-col items-center w-1/2">
            <h2 className="text-2xl font-semibold text-center">
              {(lcData?.type === "LG Issuance"
                ? lcData?.lgIssuance
                : lcData?.type) || "Risk Participation Request"}
            </h2>
          </div>
          <DialogClose>
            <X className="size-7" />
          </DialogClose>
        </div>
        {lcData?.type === "LG Issuance" &&
        lcData?.lgIssuance === "LG 100% Cash Margin" ? (
          <LGIssuanceCashMarginDialog data={lcData} />
        ) : lcData?.type === "LG Issuance" &&
          lcData?.lgIssuance !== "LG 100% Cash Margin" ? (
          <LGIssuanceDialog data={lcData} />
        ) : (
          <div className="relative mt-0 flex h-full items-start justify-between overflow-y-hidden">
            <div className="h-full max-h-[90vh] min-h-[85vh] w-full overflow-y-scroll border-r-2 border-r-borderCol pb-5">
              <div className="bg-[#F5F7F9] px-4 pt-2">
                <h2 className="mb-1 text-2xl font-semibold">
                  <span className="font-normal text-para">LC Amount:</span> USD{" "}
                  {lcData && lcData.amount
                    ? formatAmount(lcData?.amount?.price)
                    : formatAmount(total)}
                </h2>
                <p className="font-roboto text-sm text-para">
                  Created at,{" "}
                  {lcData &&
                    convertDateAndTimeToStringGMT({
                      date: lcData.createdAt,
                    })}
                  , by{" "}
                  <span className="capitalize text-text">
                    {(lcData && lcData.exporterInfo?.beneficiaryName) ||
                      lcData?.createdBy?.name}
                  </span>
                </p>

                <div className="mt-3 h-[2px] w-full bg-neutral-800" />
              </div>
              {/* Main Info */}
              <div className="bg-[#F5F7F9] px-4">
                <h2 className="text-xl font-semibold mt-1">LC Details</h2>
                <LcLgInfo
                  label="LC Issuing Bank"
                  value={
                    (lcData &&
                      lcData?.issuingBanks?.length > 0 &&
                      formatFirstLetterOfWord(lcData?.issuingBanks[0]?.bank)) ||
                    ""
                  }
                />
                {lcData?.advisingBank?.bank && (
                  <LcLgInfo
                    label="Advising Bank"
                    value={
                      (lcData &&
                        formatFirstLetterOfWord(lcData.advisingBank?.bank)) ||
                      ""
                    }
                  />
                )}
                {lcData?.confirmingBank?.bank && (
                  <LcLgInfo
                    label="Preferred Confirming Bank"
                    value={
                      (lcData &&
                        formatFirstLetterOfWord(lcData.confirmingBank?.bank)) ||
                      ""
                    }
                  />
                )}
                <LcLgInfo
                  label="Payment Terms"
                  value={
                    lcData?.paymentTerms && lcData?.paymentTerms !== "Sight LC"
                      ? `${lcData.paymentTerms}: ${
                          lcData.extraInfo?.days + " days" || ""
                        } at ${lcData.extraInfo?.other || ""}`
                      : lcData?.paymentTerms || "-"
                  }
                />
                {lcData?.transhipment && (
                  <LcLgInfo
                    label="Transhipment"
                    value={lcData && lcData.transhipment ? "Yes" : "No"}
                  />
                )}
                {lcData?.shipmentPort?.port && lcData.shipmentPort?.country && (
                  <LcLgInfo
                    label="Port of Shipment"
                    noBorder
                    value={`${lcData.shipmentPort.port}, ${lcData.shipmentPort.country}`}
                  />
                )}
              </div>
              <div className="mt- 5 h-[2px] w-full bg-borderCol" />
              {/* LC Details */}
              <div className="mt-2 px-4">
                <LcLgInfo
                  label="LC Issuance (Expected)"
                  value={
                    lcData &&
                    convertDateToCommaString(lcData?.period?.startDate)
                  }
                />
                <LcLgInfo
                  label="LC Expiry Date"
                  value={
                    lcData &&
                    lcData.period &&
                    convertDateToCommaString(lcData.period?.endDate)
                  }
                />
                <LcLgInfo
                  label="Confirmation Date (Expected)"
                  value={
                    lcData?.expectedConfirmationDate
                      ? convertDateToCommaString(
                          lcData?.expectedConfirmationDate
                        )
                      : lcData?.expectedDiscountingDate
                      ? convertDateToCommaString(
                          lcData?.expectedDiscountingDate
                        )
                      : "-"
                  }
                />
                <LcLgInfo
                  label="Last date for receiving Bids"
                  value={
                    lcData &&
                    convertDateToCommaString(lcData.lastDateOfReceivingBids)
                  }
                />
                {lcData?.attachments &&
                  lcData.attachments.length > 0 &&
                  lcData.attachments.map((attachment, index) => (
                    <ViewFileAttachment key={index} attachment={attachment} />
                  ))}
                <h2 className="text-xl font-semibold mt-3">Importer Info</h2>
                <LcLgInfo
                  label="Applicant"
                  value={(lcData && lcData.importerInfo?.applicantName) || ""}
                />
                <LcLgInfo
                  label="Country of Import"
                  noBorder
                  value={(lcData && lcData.importerInfo?.countryOfImport) || ""}
                />

                <h2 className="text-xl font-semibold mt-3">Exporter Info</h2>
                <LcLgInfo
                  label="Beneficiary Name"
                  value={(lcData && lcData.exporterInfo?.beneficiaryName) || ""}
                />
                <LcLgInfo
                  label="Beneficiary Country"
                  value={
                    (lcData && lcData.exporterInfo?.beneficiaryCountry) || ""
                  }
                />
                <LcLgInfo
                  label="Country of Export"
                  value={(lcData && lcData.exporterInfo?.countryOfExport) || ""}
                />
                <LcLgInfo
                  label="Charges on account of"
                  value="Beneficiary"
                  noBorder
                />
                {lcData?.type === "LC Confirmation & Discounting" && (
                  <div>
                    <h2 className="text-xl font-semibold mt-3">
                      Confirmation Info
                    </h2>
                    <LcLgInfo
                      label="Charges on account Of"
                      value={lcData?.confirmationInfo.behalfOf || ""}
                    />
                  </div>
                )}
                {lcData?.type?.includes("Discount") && (
                  <div>
                    <h2 className="text-xl font-semibold mt-3">
                      Discounting Info
                    </h2>
                    <LcLgInfo
                      label="Charges on account Of"
                      value={lcData?.discountingInfo.behalfOf || ""}
                    />
                    <LcLgInfo
                      label="Discounted At"
                      value={lcData?.discountingInfo?.discountAtSight || ""}
                    />
                  </div>
                )}
              </div>
            </div>
            {/* Right Section */}
            <div className="flex h-full w-full flex-col justify-start px-5">
              {/* Filter Section */}
              <div className="flex w-full items-center justify-between pt-5">
                <div className="flex items-center gap-x-2">
                  <p className="rounded-xl bg-primaryCol px-3 py-1 text-lg font-semibold text-white">
                    {isBank ? userBids?.length : bids?.length}
                  </p>
                  <p className="text-xl font-semibold">
                    {isBank ? "View Bids" : "Bids received"}
                  </p>
                </div>
              </div>
              {/* Bids */}
              <div className="mt-5 flex max-h-[90vh] flex-col gap-y-4 overflow-y-auto overflow-x-hidden pb-5">
                {isBank
                  ? userBids &&
                    userBids.length > 0 &&
                    sortedBids(userBids)?.map((data: IBids) => (
                      <BidCard
                        isRisk={isRisk}
                        data={data}
                        key={data._id}
                        isBank
                      />
                    ))
                  : bids &&
                    bids.length > 0 &&
                    sortedBids(bids)?.map((data: IBids) => (
                      <BidCard data={data} key={data._id} isRisk={isRisk} />
                    ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
