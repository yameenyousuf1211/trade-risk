"use client";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatePicker, Loader } from "../helpers";
import Image from "next/image";
import {
  convertDate,
  convertDateAndTimeToString,
  convertDateToCommaString,
  formatNumberByAddingDigitsToStart,
} from "@/utils";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { addBidTypes } from "@/validation/bids.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addBid } from "@/services/apis/bids.api";
import { toast } from "sonner";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { fetchSingleLc } from "@/services/apis/lcs.api";
import { cn } from "@/lib/utils";
import { fetchSingleRisk } from "@/services/apis/risk.api";
import { IBids, IRisk } from "@/types/type";
import { BgRadioInput, DDInput } from "../LCSteps/helpers";
import { sendNotification } from "@/services/apis/notifications.api";
import { useAuth } from "@/context/AuthProvider";
import { yupResolver } from "@hookform/resolvers/yup";
import LGIssuanceDialog from "../LG-Output/LG-Issuance-Bank/LGIssuance";
import ViewFileAttachment from "./ViewFileAttachment";
import { convertDateAndTimeToStringGMT } from "@/utils/helper/dateAndTimeGMT";
import { formatFirstLetterOfWord, LcLgInfo } from "../LG-Output/helper";
import LGIssuanceCashMarginDialog from "../LG-Output/LG-Issuance-Bank/LGIssuanceCashMargin";

export const AddBid = ({
  isNotification = false,
  isDiscount,
  isInfo,
  status,
  triggerTitle,
  border,
  id,
  setIsAddNewBid,
  isAddNewBid = false,
  isCorporate,
  isBank,
  bidData,
  isRisk = false,
}: {
  isDiscount?: boolean;
  isNotification?: boolean;
  isInfo?: boolean;
  status?: string;
  triggerTitle: string;
  border?: boolean;
  id: string;
  setIsAddNewBid?: any;
  isCorporate?: boolean;
  bidData?: any;
  isBank?: boolean;
  isRisk?: boolean;
}) => {
  const queryClient = useQueryClient();
  const [discountBaseRate, setDiscountBaseRate] = useState("");
  const [discountMargin, setDiscountMargin] = useState("");
  const [confirmationPriceType, setConfirmationPriceType] = useState("");
  const { user } = useAuth();
  const buttonRef = useRef<HTMLButtonElement>(null); // console.log(id, "_______-id");

  const { data: lcData, isLoading } = useQuery({
    queryKey: [`single-lc`, id],
    queryFn: () => fetchSingleLc(id),
    enabled: !isRisk,
  });

  const { mutateAsync } = useMutation({
    mutationFn: addBid,
    onSuccess: () => {
      console.log("onsuccess.... invalidating queries");
      queryClient.invalidateQueries({
        queryKey: ["bid-status"],
      });
      queryClient.invalidateQueries({
        queryKey: ["fetch-lcs"],
      });
      queryClient.invalidateQueries({
        queryKey: ["single-lc"],
      });
    },
  });

  console.log(lcData, "lcDataaaaaasdasdasd");

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(addBidTypes),
  });
  const onSubmit: SubmitHandler<typeof addBidTypes> = async (data) => {
    if (isDiscount && !discountBaseRate)
      return toast.error("Please provide discount base rate");
    if (isDiscount && !discountMargin)
      return toast.error("Please provide discount margin");

    const baseData = {
      confirmationPrice: data.confirmationPrice,
      lc: lcData?._id,
      type: lcData?.type!,
      validity: data.validity,
    };

    const reqData = isDiscount
      ? {
          ...baseData,
          discountMargin,
          discountBaseRate,
          perAnnum: confirmationPriceType === "perAnnum" ? true : false,
        }
      : baseData;
    // @ts-ignore
    const { success, response } = await mutateAsync(reqData);

    if (!success) return toast.error(response);
    else {
      console.log(response?.data, "response?.data");
      buttonRef?.current?.click();

      toast.success("Bid added");
    }
  };

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

  const formatNumberWithCommas = (value: string | number) => {
    if (value === undefined || value === null) {
      return "";
    }

    value = value.toString();
    const numberString = value.replace(/,/g, "");
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const userBids = lcData?.bids?.filter((bid) => bid?.createdBy === user?._id);

  let userBidStatus = null;
  if (userBids?.length > 0) {
    if (userBids.some((bid) => bid.status === "Pending")) {
      userBidStatus = "Pending";
    } else {
      userBidStatus = userBids[0].status;
    }
  }
  const currentDate = new Date();
  const bidDeadline = new Date(lcData?.lastDateOfReceivingBids);
  const isBidClosed = currentDate > bidDeadline;

  const computedStatus =
    userBidStatus || status || lcData?.status || triggerTitle;

  return (
    <Dialog>
      <DialogTrigger
        className={`${
          status === "Accepted"
            ? `bg-[#29C08433] hover:bg-[#29C08433] text-[#29C084] hover:text-[#29C084] ${
                border && "border border-[#29C084]"
              }`
            : lcData?.status === "Accepted" || lcData?.status === "Expired"
            ? "bg-[#1A1A26] text-white text-sm cursor-not-allowed"
            : status === "Rejected"
            ? `bg-[#FF020229] hover:bg-[#FF020229] text-[#D20000] hover:text-[#D20000] ${
                border && "border border-[#D20000]"
              }`
            : status === "Expired"
            ? `bg-[#97979752] hover:bg-[#97979752] text-[#7E7E7E] hover:text-[#7E7E7E] ${
                border &&
                "border border-[#7E7E7E] bg-[#9797971A] text-[#7E7E7E]"
              }`
            : status === "Add bid" && !isBank
            ? "bg-primaryCol hover:bg-primaryCol text-white hover:text-white"
            : status === "Add Bid" && computedStatus === "Add Bid" && isBank
            ? "bg-primaryCol hover:bg-primaryCol text-white text-sm"
            : status === "Add Bid" && computedStatus === "Rejected" && isBank
            ? "bg-[#FF020229] hover:bg-[#FF020229] text-[#D20000] hover:text-[#D20000]"
            : status === "Add Bid" && computedStatus === "Accepted" && isBank
            ? "bg-[#29C08433] hover:bg-[#29C08433] text-[#29C084] hover:text-[#29C084]"
            : `px-3 mt-2 bg-[#F2994A] hover:bg-[#F2994A]/90 text-white opacity-80 ${
                isNotification && "bg-[#0e1829] hover:bg-black/90 "
              }`
        } rounded-md w-full h-10 capitalize hover:opacity-85 font-roboto`}
        disabled={
          (((lcData?.status === "Accepted" && !isNotification) ||
            (lcData?.status === "Expired" && !isNotification)) &&
            status !== "Accepted" &&
            !isNotification) ||
          (computedStatus === "Pending" && !isNotification)
        }
      >
        {status === "Accepted"
          ? "Accepted"
          : lcData?.status === "Accepted" || lcData?.status === "Expired"
          ? "Not Applicable"
          : computedStatus || "Pending"}
      </DialogTrigger>
      <DialogContent className="h-full !max-h-[95vh] w-full max-w-6xl !p-0 flex flex-col">
        <div className="flex items-center justify-between border-b border-b-borderCol px-7 !py-5 max-h-20">
          <div className="flex flex-col items-center w-1/2">
            <h2 className="text-2xl font-semibold text-center">
              {(lcData?.type === "LG Issuance" &&
              lcData.lgIssuance === "LG 100% Cash Margin"
                ? lcData.lgIssuance
                : lcData?.type === "LG Issuance" &&
                  lcData.lgIssuance !== "LG 100% Cash Margin"
                ? "LG Re-Issuance"
                : lcData?.type || "Risk Participation") + " Request"}
            </h2>
          </div>
          <DialogClose onClick={() => setIsAddNewBid && setIsAddNewBid(false)}>
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
          <div className="overflow-y-hidden relative mt-0 flex items-start justify-between h-full">
            {/* Left Section */}
            <div className="w-full border-r-2 border-r-borderCol h-full overflow-y-auto max-h-[95vh]">
              {isLoading ? (
                <div className="w-full h-full center">
                  <Loader />
                </div>
              ) : (
                <>
                  <div className="pt-5 px-4 bg-bg">
                    <h2 className="text-2xl font-semibold mb-1">
                      <span className="text-para font-medium">LC Amount:</span>{" "}
                      {lcData?.currency || "USD"}{" "}
                      {lcData?.amount?.price
                        ? lcData?.amount?.price?.toLocaleString() + ".00"
                        : total?.toLocaleString() + ".00" ?? ""}
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
                    <div className="h-[2px] w-full bg-neutral-800 mt-5" />
                  </div>

                  {/* Main Info */}
                  <div className="px-4 bg-bg pb-5">
                    <h2 className="text-xl font-semibold mt-1">LC Details</h2>
                    <LcLgInfo
                      label="LC Issuing Bank"
                      value={
                        formatFirstLetterOfWord(
                          lcData?.issuingBanks?.[0]?.bank
                        ) || "-"
                      }
                    />
                    <LcLgInfo
                      label="Country of LC Issuing Bank"
                      value={
                        formatFirstLetterOfWord(
                          lcData?.issuingBanks?.[0]?.country
                        ) || "-"
                      }
                    />
                    {lcData?.advisingBank?.bank && (
                      <LcLgInfo
                        label="LC Advising Bank"
                        value={formatFirstLetterOfWord(
                          lcData?.advisingBank?.bank
                        )}
                      />
                    )}
                    {lcData?.confirmingBank?.bank && (
                      <LcLgInfo
                        label="Preferred Confirming Bank"
                        value={formatFirstLetterOfWord(
                          lcData?.confirmingBank?.bank
                        )}
                      />
                    )}
                    <LcLgInfo
                      label="Payment Terms"
                      value={
                        lcData?.paymentTerms &&
                        lcData?.paymentTerms !== "Sight LC"
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
                    {lcData?.shipmentPort?.port &&
                      lcData.shipmentPort?.country && (
                        <LcLgInfo
                          label="Port of Shipment"
                          noBorder
                          value={`${lcData.shipmentPort.port}, ${lcData.shipmentPort.country}`}
                        />
                      )}
                  </div>
                  {/* Separator */}
                  <div className="h-[2px] w-full bg-borderCol" />
                  {/* LC Details */}
                  <div className="px-4 mt-4">
                    <LcLgInfo
                      label="LC Issuance (Expected)"
                      value={convertDateToCommaString(lcData.period?.startDate)}
                    />
                    <LcLgInfo
                      label="LC Expiry Date"
                      value={
                        lcData?.period?.endDate
                          ? convertDateToCommaString(lcData?.period?.endDate)
                          : "-"
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
                        lcData?.lastDateOfReceivingBids
                          ? convertDateToCommaString(
                              lcData?.lastDateOfReceivingBids
                            )
                          : "-"
                      }
                    />
                    <LcLgInfo
                      label="Product Description"
                      value={lcData?.productDescription || ""}
                      noBorder
                    />

                    {lcData?.attachments &&
                      lcData.attachments.length > 0 &&
                      lcData.attachments.map((attachment, index) => (
                        <ViewFileAttachment
                          key={index}
                          attachment={attachment}
                        />
                      ))}
                    <h2 className="text-xl font-semibold mt-3">
                      Importer Info
                    </h2>
                    <LcLgInfo
                      label="Applicant"
                      value={lcData?.importerInfo?.applicantName || ""}
                    />
                    <LcLgInfo
                      label="Country of Import"
                      noBorder
                      value={lcData?.importerInfo?.countryOfImport || ""}
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
                    {isDiscount && (
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
                </>
              )}
            </div>

            {/* Right Section */}
            {isBidClosed ? (
              <div className="w-full h-full flex justify-center items-center px-5 overflow-y-auto max-h-[95vh]">
                <p className="text-xl font-medium">
                  This LC is not accepting bids at the moment
                </p>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col justify-start px-5 overflow-y-auto max-h-[95vh]">
                <p className="text-xl font-semibold pt-5">
                  {computedStatus == "Add bid" || !isInfo
                    ? "Submit Your Bid"
                    : "View Bids"}
                </p>
                {isInfo ? (
                  // This is where we filter the bids for the logged-in user
                  (() => {
                    // console.log("🚀 ~ file: AddBid.tsx ~ line 116 ~ user ~ user", user);
                    let userBids;
                    if (isCorporate) {
                      userBids = lcData?.bids;
                    } else {
                      userBids = lcData?.bids?.filter(
                        (bid) => bid?.bidBy?._id === user?.business?._id
                      );
                    }
                    const sortedBids = userBids?.sort(
                      (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    );

                    return (
                      <>
                        {sortedBids && sortedBids.length > 0 ? (
                          sortedBids.map((bid: IBids, index: number) => (
                            <div
                              className="border-borderCol px-4 mt-3   py-4  border  rounded-lg"
                              key={bid._id}
                            >
                              <div
                                key={bid._id || index}
                                className="grid grid-cols-2 gap-y-3"
                              >
                                {/* Conditionally apply opacity to div based on status */}

                                {/* Bid Number */}
                                <div
                                  className={
                                    bid.status === "Expired" ? "opacity-50" : ""
                                  }
                                >
                                  <p className="mb-1 text-sm text-para font-roboto">
                                    Bid Number
                                  </p>
                                  <p className="text-lg font-semibold">
                                    {formatNumberByAddingDigitsToStart(
                                      bid?.bidNumber
                                    )}
                                  </p>
                                </div>

                                {/* Submitted by */}
                                <div
                                  className={
                                    bid.status === "Expired" ? "opacity-50" : ""
                                  }
                                >
                                  <p className="mb-1 text-sm text-para font-roboto">
                                    Submitted by
                                  </p>
                                  <p className="text-lg font-semibold capitalize">
                                    {bid
                                      ? formatFirstLetterOfWord(
                                          bid?.bidBy?.name
                                        )
                                      : "Habib Bank Limited"}
                                  </p>
                                </div>

                                {lcData?.type !== "LC Discounting" && (
                                  <div
                                    className={
                                      bid.status === "Expired"
                                        ? "opacity-50"
                                        : ""
                                    }
                                  >
                                    <p className="mb-1 text-sm text-para font-roboto">
                                      Confirmation Rate
                                    </p>
                                    <p className="text-lg font-semibold text-text">
                                      {bid ? bid.confirmationPrice : "1.75"}%{" "}
                                      <span className="text-black">
                                        per annum
                                      </span>
                                    </p>
                                  </div>
                                )}

                                {lcData?.type === "LC Discounting" && (
                                  <div
                                    className={
                                      bid.status === "Expired"
                                        ? "opacity-50"
                                        : ""
                                    }
                                  >
                                    <p className="mb-1 text-sm text-para font-roboto">
                                      Discount Rate
                                    </p>
                                    <p className="text-lg font-semibold capitalize">
                                      {bid ? (
                                        <>
                                          {bid?.discountBaseRate.toUpperCase()}{" "}
                                          +{" "}
                                          <span className="text-text">
                                            {bid?.discountMargin}%
                                          </span>{" "}
                                        </>
                                      ) : (
                                        "-"
                                      )}
                                    </p>
                                  </div>
                                )}
                                {lcData?.type ===
                                  "LC Confirmation & Discounting" && (
                                  <div
                                    className={
                                      bid.status === "Expired"
                                        ? "opacity-50"
                                        : ""
                                    }
                                  >
                                    <p className="mb-1 text-sm text-para font-roboto">
                                      Discount Pricing
                                    </p>
                                    <p className="text-lg font-semibold">
                                      {bid &&
                                        `${bid.discountBaseRate.toUpperCase()} + `}
                                      <span className="text-text">{`${bid.discountMargin}%`}</span>
                                    </p>
                                  </div>
                                )}
                                {/* Country */}
                                <div
                                  className={
                                    bid.status === "Expired" ? "opacity-50" : ""
                                  }
                                >
                                  <p className="mb-1 text-sm text-para font-roboto">
                                    Country
                                  </p>
                                  <p className="text-lg font-semibold capitalize">
                                    {bid ? bid.bidBy.country : "Pakistan"}
                                  </p>
                                </div>
                                {lcData?.type === "LC Discounting" && (
                                  <div
                                    className={
                                      bidData.status === "Expired"
                                        ? "opacity-50"
                                        : ""
                                    }
                                  >
                                    <p className="mb-1 text-sm text-para">
                                      Term
                                    </p>
                                    <p className="text-lg font-semibold text-text">
                                      <span className="text-black">
                                        {bid?.perAnnum ? "Per Annum" : "Flat"}
                                      </span>
                                    </p>
                                  </div>
                                )}
                                <div
                                  className={
                                    bid.status === "Expired" ? "opacity-50" : ""
                                  }
                                >
                                  <p className="mb-1 text-sm text-para font-roboto">
                                    Bid Received
                                  </p>
                                  <p className="text-lg font-semibold">
                                    {convertDateAndTimeToStringGMT({
                                      date: bid.createdAt,
                                      sameLine: false,
                                    })}
                                  </p>
                                </div>
                                <div
                                  className={
                                    bid.status === "Expired" ? "opacity-50" : ""
                                  }
                                >
                                  <p className="mb-1 text-sm text-para font-roboto">
                                    Bid Expiry
                                  </p>
                                  <p className="font-semibold text-lg">
                                    {convertDateAndTimeToStringGMT({
                                      date: bid.bidValidity,
                                      sameLine: false,
                                    })}
                                  </p>
                                </div>
                                <div
                                  className={
                                    bid.status === "Expired" ? "opacity-50" : ""
                                  }
                                ></div>
                              </div>
                              <Button
                                className={`w-full ${
                                  bid.status === "Accepted"
                                    ? "bg-[#29C08433] hover:bg-[#29C08433]"
                                    : bid.status === "Rejected"
                                    ? "bg-[#FF02021A] hover:bg-[#FF02021A]"
                                    : bid.status === "Expired"
                                    ? "bg-[#97979733] hover:bg-[#97979733]"
                                    : bid.status === "Pending"
                                    ? "bg-[#F4D0131A] hover:bg-[#F4D0131A]"
                                    : ""
                                } mt-2 text-black`}
                              >
                                {bid.status === "Accepted"
                                  ? "Bid Accepted"
                                  : bid.status === "Rejected"
                                  ? "Bid Rejected"
                                  : bid.status === "Expired"
                                  ? "Request Expired"
                                  : bid.status === "Pending"
                                  ? "Bid Submitted"
                                  : bid.status}
                              </Button>
                            </div>
                          ))
                        ) : (
                          <p>No bids found for the logged-in user.</p>
                        )}

                        {/* Button for submitting a new bid if status is Rejected */}
                        {status === "Rejected" && !isCorporate && (
                          <Button
                            onClick={() => setIsAddNewBid(true)}
                            className="bg-[#5625F2] text-white hover:bg-[#5625F2] mt-5"
                          >
                            Submit A New Bid
                          </Button>
                        )}
                      </>
                    );
                  })()
                ) : (
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-y-4 py-4 px-4 mt-5 border border-borderCol rounded-lg"
                  >
                    <div>
                      <div>
                        <label
                          htmlFor="validity"
                          className="block font-semibold mb-2"
                        >
                          Bid Validity
                        </label>
                        <DatePicker
                          setValue={setValue}
                          key={lcData?._id}
                          disabled={{
                            before:
                              lcData?.period?.startDate &&
                              new Date(lcData.period.startDate) > new Date()
                                ? new Date(lcData.period.startDate)
                                : new Date(), // If the start date is in the future, use it, otherwise use the current date
                            after: new Date(lcData?.period?.endDate),
                          }}
                          // maxDate={null}
                          isPast={false}
                        />
                      </div>
                      {errors.validity && (
                        <span className="text-red-500 text-[12px]">
                          {errors.validity.message}
                        </span>
                      )}
                    </div>
                    {lcData?.type !== "LC Discounting" && (
                      <>
                        <div>
                          <div className="flex items-center justify-between">
                            <label
                              htmlFor="confirmation"
                              className="block font-semibold mb-2"
                            >
                              {lcData?.type === "LC Discounting"
                                ? "Discount Rate"
                                : isDiscount
                                ? "Confirmation Pricing"
                                : "Your Pricing"}
                            </label>
                            <p className="text-xs text-[#29C084]">
                              Client&apos;s Expected Price:{" "}
                              {lcData?.confirmationInfo?.pricePerAnnum} P.A
                            </p>
                          </div>
                          <input
                            placeholder="Enter your pricing per annum (%)"
                            type="text"
                            inputMode="numeric"
                            className={cn(
                              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            )}
                            max={100}
                            {...register("confirmationPrice")}
                            onChange={(event) => {
                              const newValue: any = event.target.value.replace(
                                /[^0-9.]/g,
                                ""
                              );
                              event.target.value = newValue;
                              setValue("confirmationPrice", newValue);
                            }}
                            onBlur={(event: ChangeEvent<HTMLInputElement>) => {
                              if (
                                event.target.value.includes("%") ||
                                event.target.value.length === 0
                              )
                                return;
                              event.target.value += "%";
                            }}
                            onKeyUp={(event: any) => {
                              if (
                                Number(event.target.value.replace("%", "")) >
                                100
                              ) {
                                event.target.value = "100.0%";
                              }
                            }}
                          />
                        </div>
                        {errors.confirmationPrice && (
                          <span className="text-red-500 text-[12px]">
                            {errors.confirmationPrice.message}
                          </span>
                        )}
                      </>
                    )}
                    {isDiscount && (
                      <div className="flex gap-3">
                        <label
                          className={`px-3 py-4 w-full transition-colors duration-100 ${
                            confirmationPriceType === "perAnnum"
                              ? "bg-[#EEE9FE]"
                              : "border border-borderCol bg-white"
                          } rounded-md flex items-center gap-x-3 mb-2 text-lightGray text-sm `}
                        >
                          <input
                            type="radio"
                            name="confirmationPriceType"
                            value={"perAnnum"}
                            onChange={(e) => {
                              console.log(e.target.value);
                              setConfirmationPriceType(e.target.value);
                              if (lcData?.type === "LC Discounting") {
                                setValue("confirmationPrice", "1");
                              }
                            }}
                            className="accent-primaryCol size-4"
                          />
                          Per Annum
                        </label>
                        <label
                          className={`px-3 py-4 w-full transition-colors duration-100 ${
                            confirmationPriceType === "flat"
                              ? "bg-[#EEE9FE]"
                              : "border border-borderCol bg-white"
                          } rounded-md flex items-center gap-x-3 mb-2 text-lightGray text-sm `}
                        >
                          <input
                            type="radio"
                            name="confirmationPriceType"
                            value={"flat"}
                            onChange={(e) => {
                              setConfirmationPriceType(e.target.value);
                              if (lcData?.type === "LC Discounting") {
                                setValue("confirmationPrice", "1");
                              }
                            }}
                            className="accent-primaryCol size-4"
                          />
                          Flat
                        </label>
                      </div>
                    )}

                    {isDiscount && (
                      <div className="">
                        <div className="flex items-center justify-between">
                          <label
                            htmlFor="discount"
                            className="block font-semibold mb-2"
                          >
                            {lcData?.type === "LC Discounting"
                              ? "Discount Spread"
                              : "Discount Pricing"}
                          </label>
                          <p className="text-xs text-[#29C084]">
                            Client&apos;s Expected Price:{" "}
                            {lcData?.type === "LC Discounting"
                              ? lcData?.baseRate?.toUpperCase()
                              : lcData?.discountingInfo?.basePerRate?.toUpperCase()}
                            +{lcData?.discountingInfo?.pricePerAnnum} P.A
                          </p>
                        </div>
                        <div className="flex flex-col gap-y-3 items-center w-full">
                          <label
                            id="base-rate"
                            className="border border-borderCol py -2 .5 px-3 rounded-md w-full flex items-center justify-between"
                          >
                            <p className="text-sm w-full text-black text-m uted-foreground">
                              Select Base Rate
                            </p>
                            <div className="text-end">
                              <DDInput
                                id="baseRate"
                                label="Base Rate"
                                type="baseRate"
                                value={discountBaseRate}
                                placeholder="Select Value"
                                setValue={setValue}
                                onSelectValue={(value) => {
                                  setDiscountBaseRate(value);
                                  if (lcData?.type === "LC Discounting") {
                                    setValue("confirmationPrice", "1");
                                  }
                                }}
                                data={["KIBOR", "LIBOR", "SOFR"]}
                              />
                            </div>
                          </label>
                          <Plus strokeWidth={4.5} className="size-4" />
                          <input
                            type="text"
                            placeholder="Margin (%)"
                            inputMode="numeric"
                            id="margin"
                            value={discountMargin}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                              const newValue = e.target.value.replace(
                                /[^0-9.]/g,
                                ""
                              );
                              e.target.value = newValue;
                              if (lcData?.type === "LC Discounting") {
                                setValue("confirmationPrice", "1");
                              }
                              setDiscountMargin(newValue);
                            }}
                            onBlur={(event: ChangeEvent<HTMLInputElement>) => {
                              if (
                                event.target.value.includes("%") ||
                                event.target.value.length === 0
                              )
                                return;
                              event.target.value += "%";
                            }}
                            onKeyUp={(event: any) => {
                              if (
                                Number(event.target.value.replace("%", "")) >
                                100
                              ) {
                                event.target.value = "100.0%";
                              }
                            }}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-2">
                      <DialogClose
                        ref={buttonRef}
                        // id="submit-button-close"
                        className="hidden"
                      ></DialogClose>
                      <Button
                        className="bg-[#29C084] hover:bg-[#29C084]/90 text-white hover:text-white w-full"
                        size="lg"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        Submit
                      </Button>
                      <DialogClose
                        className="w-full"
                        onClick={() => setIsAddNewBid(false)}
                      >
                        <Button
                          type="button"
                          variant="ghost"
                          size="lg"
                          className="bg-borderCol hover:bg-borderCol/90 text-para hover:text-para w-full"
                        >
                          Cancel
                        </Button>
                      </DialogClose>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
