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
  convertDateAndTimeToString,
  convertDateToCommaString,
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
import { LGCashMarginDialog } from "../LG-Output/Bank/LG-Cash-Margin/LGCashMargin";

const LCInfo = ({
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
      <p className="text-para text-sm">{label}</p>
      <p className="capitalize font-semibold text-right text-sm max-w-[60%]">
        {value}
      </p>
    </div>
  );
};

export const AddBid = ({
  isNotification = false,
  isDiscount,
  isInfo,
  status,
  triggerTitle,
  border,
  id,
  setIsAddNewBid,
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
  const [userBids,setUserBids] = useState<IBids[]>([]);
  const [confirmationPriceType, setConfirmationPriceType] = useState("");
  const { user } = useAuth();

  const buttonRef = useRef<HTMLButtonElement>(null); // console.log(id, "_______-id");
  
  console.log("🚀 ~ file: AddBid.tsx ~ line 116 ~ bidData ~ bidData", bidData);
  



  const { data: lcData, isLoading } = useQuery({
    queryKey: [`single-lc`, id],
    queryFn: () => fetchSingleLc(id),
    enabled: !isRisk,
  });


  const { data: riskData } = useQuery<IRisk>({
    queryKey: [`single-risk`, id],
    queryFn: () => fetchSingleRisk(id),
    enabled: isRisk,
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
    },
  });

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
          perAnnum: confirmationPriceType === "perAnnum",
        }
      : baseData;

    const riskReqData = {
      confirmationPrice: data.confirmationPrice,
      risk: riskData?._id,
      type: "Risk",
      validity: data.validity,
    };

    const { success, response } = await mutateAsync(
      isRisk ? riskReqData : reqData
    );

    if (!success) return toast.error(response);
    buttonRef?.current?.click();
 
    toast.success("Bid added");
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

  const userBidStatus = lcData?.bids?.find(
    (bid) => bid?.createdBy === user?._id
  )?.status;
  const computedStatus = userBidStatus || triggerTitle || lcData?.status;



  return (
    <Dialog>
      {isRisk ? (
        <DialogTrigger
          className={`${
            status === "Pending"
              ? "bg-[#F2994A33] hover:bg-[#F2994A33] text-[#F2994A] hover:text-[#F2994A]  rounded-md w-full p-2 capitalize hover:opacity-85 border border-[#F2994A]"
              : riskData &&
                (riskData?.status === "Expired" ||
                  riskData?.status === "Accepted") &&
                (status === "Add bid" || status === "Rejected")
              ? "bg-[#1A1A26] text-white text-sm"
              : status === "Rejected"
              ? `bg-[#FF020229] hover:bg-[#FF020229] text-[#D20000] hover:text-[#D20000] ${
                  border && "border border-[#D20000]"
                }`
              : status === "Accepted"
              ? `bg-[#29C08433] hover:bg-[#29C08433] text-[#29C084] hover:text-[#29C084] ${
                  border && "border border-[#29C084]"
                }`
              : status === "Expired"
              ? `bg-[#97979752] hover:bg-[#97979752] text-[#7E7E7E] hover:text-[#7E7E7E] ${
                  border &&
                  "border border-[#7E7E7E] bg-[#9797971A] text-[#7E7E7E]"
                }`
              : status === "Add bid"
              ? "bg-primaryCol hover:bg-primaryCol text-white hover:text-white"
              : status === "Add bid"
              ? "bg-[#1A1A26] text-white text-sm"
              : "px-3 mt-2 bg-[#1A1A26] hover:bg-[#1A1A26]/90 text-white"
          } rounded-md w-full p-2 capitalize hover:opacity-85 font-roboto`}
          disabled={
            (riskData?.status === "Expired" ||
              riskData?.status === "Accepted") &&
            (status === "Add bid" || status === "Rejected")
          }
        >
          {riskData &&
          (riskData?.status === "Expired" || riskData?.status === "Accepted") &&
          (status === "Add bid" || status === "Rejected")
            ? "Not Applicable"
            : triggerTitle || "Pending"}
        </DialogTrigger>
      ) : (
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
                border && "border border-[#7E7E7E] bg-[#9797971A] text-[#7E7E7E]"
              }`
            : status === "Add bid" && !isBank
            ? "bg-primaryCol hover:bg-primaryCol text-white hover:text-white"
            : status === "Add Bid" && isBank
            ? "bg-[#1A1A26] text-white text-sm"
            : "px-3 mt-2 bg-[#F2994A] hover:bg-[#F2994A]/90 text-white opacity-80"
        } rounded-md w-full p-2 capitalize hover:opacity-85 font-roboto`}
        disabled={
          (lcData?.status === "Accepted" || lcData?.status === "Expired") &&
          status !== "Accepted" || computedStatus === "Pending"
        }
      >
        {status === "Accepted"
          ? "Accepted"
          : (lcData?.status === "Accepted" || lcData?.status === "Expired")
          ? "Not Applicable"
          : computedStatus || "Pending"}
      </DialogTrigger>
      

      )}

      <DialogContent className="w-full max-w-4xl p-0 !max-h-[85vh] h-full">
            <div className="flex items-center justify-between border-b border-b-borderCol px-7 !py-5 max-h-20">
              <h2 className="text-lg font-semibold">
                {(lcData?.type && lcData?.type + " Request") ||
                  "Risk Participation Request"}
              </h2>
              <DialogClose
                onClick={() => setIsAddNewBid && setIsAddNewBid(false)}
                >
                <X className="size-7" />
              </DialogClose>
            </div>
                {lcData && lcData?.type === "LG Issuance" ? (
                  <LGIssuanceDialog data={lcData}/>
                ) : (

            <div className="overflow-y-hidden relative -mt-4 flex items-start justify-between h-full">
              {/* Left Section */}
              <div className="w-full border-r-2 border-r-borderCol h-full overflow-y-auto max-h-[75vh]">
                {isLoading ? (
                  <div className="w-full h-full center">
                    <Loader />
                  </div>
                ) : (
                  <>
                    {isRisk ? (
                      <>
                        <div className="px-4 bg-bg pb-5">
                          <div className=" bg-white border border-borderCol p-2 flex items-center justify-between w-full gap-x-2 rounded-lg">
                            <div className="flex items-center gap-x-2">
                              <Button
                                type="button"
                                className="block bg-red-200 p-1 hover:bg-red-300"
                              >
                                <Image
                                  src="/images/pdf.png"
                                  alt="pdf"
                                  width={500}
                                  height={500}
                                  className="size-8"
                                />
                              </Button>
                              <div>
                                <p className="text-sm">BAFT Agreement</p>
                                <p className="text-para text-[12px]">
                                  PDF, 1.4 MB
                                </p>
                              </div>
                            </div>
                            <p className="text-sm font-medium cursor-pointer underline">
                              View attachments
                            </p>
                          </div>
                          <LCInfo
                            label="Transaction Type"
                            value={riskData?.transaction || ""}
                          />
                          <LCInfo
                            label="Risk Participation"
                            value={riskData?.riskParticipation || ""}
                          />
                          <LCInfo
                            label="Transaction Offered"
                            value={
                          riskData?.riskParticipationTransaction?.type || ""
                            }
                          />
                          <LCInfo
                            label="Value of Transaction"
                            value={
                              formatNumberWithCommas(
                            riskData?.riskParticipationTransaction?.amount ?? 0
                              ) || "-"
                            }
                          />
                          <LCInfo
                            label="Pricing offered"
                            value={
                          riskData?.riskParticipationTransaction?.returnOffer ||
                          "-"
                            }
                          />
                          <LCInfo
                            label="Participation Offered"
                            value={
                          riskData?.riskParticipationTransaction?.perAnnum ||
                          "-"
                            }
                            noBorder
                          />
                        </div>
                        {/* Separator */}
                        <div className="h-[2px] w-full bg-borderCol" />
                        {/* LC Details */}
                        <div className="px-4 mt-4">
                          <h2 className="text-xl font-semibold">LC Details</h2>
                          <LCInfo
                            label="LC Issuing Bank"
                            value={riskData?.issuingBanks[0]?.bank || "-"}
                          />
                          <LCInfo
                            label="LC Advising Bank"
                            value={riskData?.advisingBank?.bank || "-"}
                          />
                      {/* <LCInfo
                        label="Confirming Bank"
                        value={riskData?.confirmingBank?.bank || "-"}
                      /> */}
                      {/* <LCInfo
                        label="LC Discounted"
                        value={
                          riskData?.transhipment === true
                            ? "Allowed"
                            : "Not allowed"
                        }
                      /> */}
                      {/* <LCInfo
                        label="Expected Discounting Date"
                        value={convertDateToCommaString(
                          riskData?.expectedDateDiscounting || ""
                        )}
                      /> */}
                          <LCInfo
                            label="Issuance/Expected Issuance Date"
                            value={convertDateToCommaString(
                              (riskData?.startDate
                                ? riskData?.startDate
                                : riskData?.period?.startDate) || ""
                            )}
                            noBorder
                          />
                          <LCInfo
                            label="Date of Expiry"
                            value={convertDateToCommaString(
                              riskData?.expiryDate || ""
                            )}
                            noBorder
                          />
                          <LCInfo
                            label="Payment Terms"
                            value={riskData?.paymentTerms || ""}
                            noBorder
                          />
                          <LCInfo
                            label="Port of Shipment"
                            value={riskData?.shipmentPort?.port || ""}
                            noBorder
                          />
                          <LCInfo
                            label="Transhipment"
                            value={
                              riskData?.transhipment === true
                                ? "Allowed"
                                : "Not-Allowed" || ""
                            }
                            noBorder
                          />
                          <LCInfo
                            label="Expected Confirmation Date"
                            value={convertDateToCommaString(
                              riskData?.expectedDateConfimation || ""
                            )}
                            noBorder
                          />

                          <h2 className="text-xl font-semibold mt-3">
                            Importer Info
                          </h2>
                          <LCInfo
                            label="Applicant"
                            value={riskData?.importerInfo?.applicantName || ""}
                          />
                          <LCInfo
                            label="Country of Import"
                        value={riskData?.importerInfo?.countryOfImport || ""}
                            noBorder
                          />

                          <h2 className="text-xl font-semibold mt-3">
                            Exporter Info
                          </h2>
                          <LCInfo
                            label="Beneficiary"
                        value={riskData?.exporterInfo?.beneficiaryName || ""}
                          />
                          <LCInfo
                            label="Country of Export"
                        value={riskData?.exporterInfo?.countryOfExport || ""}
                          />
                          <LCInfo
                            label="Beneficiary Country"
                        value={riskData?.exporterInfo?.beneficiaryCountry || ""}
                            noBorder
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="pt-5 px-4 bg-bg">
                          <h2 className="text-2xl font-semibold mb-1">
                            <span className="text-para font-medium">
                              LC Amount:
                            </span>{" "}
                            {lcData?.currency || "USD"}{" "}
                            {lcData?.amount?.price
                              ? lcData?.amount?.price?.toLocaleString() + ".00"
                              : total?.toLocaleString() + ".00" ?? ""}
                          </h2>
                          <div className="h-[2px] w-full bg-neutral-800 mt-5" />
                        </div>

                        {/* Main Info */}
                        <div className="px-4 bg-bg pb-5">
                          <LCInfo
                            label="LC Issuing Bank"
                            value={lcData?.issuingBanks?.[0]?.bank || "-"}
                          />
                          <LCInfo
                            label="Country of LC Issuing Bank"
                            value={lcData?.issuingBanks?.[0]?.country || "-"}
                          />
                          <LCInfo
                            label="LC Applicant"
                            value={
                              (lcData?.importerInfo?.applicantName
                                ? lcData?.importerInfo?.applicantName
                                : lcData?.applicantDetails?.company) || "-"
                            }
                          />
                          {lcData?.advisingBank?.bank && (
                            <LCInfo
                              label="LC Advising Bank"
                              value={lcData?.advisingBank?.bank}
                            />
                          )}
                          {lcData?.confirmingBank?.bank && (
                            <LCInfo
                              label="Confirming Bank"
                              value={lcData?.confirmingBank?.bank}
                            />
                          )}
                          <LCInfo
                            label="Payments Terms"
                            value={
                          lcData?.paymentTerms && lcData?.paymentTerms !== "Sight LC"
                            ? `${lcData.paymentTerms} ${lcData.extraInfo?.days + " days" || ""} ${lcData.extraInfo?.other || ""}`
                                : lcData?.paymentTerms || "-"
                            }
                            noBorder
                          />
                          <div className=" bg-white border border-borderCol p-2 flex items-center justify-between w-full gap-x-2 rounded-lg">
                            <div className="flex items-center gap-x-2">
                              <Button
                                type="button"
                                className="block bg-red-200 p-1 hover:bg-red-300"
                              >
                                <Image
                                  src="/images/pdf.png"
                                  alt="pdf"
                                  width={500}
                                  height={500}
                                  className="size-8"
                                />
                              </Button>
                              <div>
                                <p className="text-sm">LC-12390</p>
                            <p className="text-para text-[12px]">PDF, 1.4 MB</p>
                              </div>
                            </div>
                            <p className="text-sm font-medium cursor-pointer underline">
                              View attachments
                            </p>
                          </div>
                        </div>

                        <p className="text-sm font-medium cursor-pointer underline">
                          View attachments
                        </p>
                      </div>
                    </div>
                    {/* Separator */}
                    <div className="h-[2px] w-full bg-borderCol" />
                    {/* LC Details */}
                    <div className="px-4 mt-4">
                      <h2 className="text-xl font-semibold">LC Details</h2>
                      <LCInfo
                        label="LC Issuance (Expected)"
                        value={
                          // riskData?.startDate || riskData?.period?.startDate
                          //   ? convertDateToCommaString(
                          //       riskData?.startDate
                          //         ? riskData?.startDate
                          //         : riskData?.period?.startDate
                          //     )
                          //   : lcData?.createdAt
                          //   ? convertDateToCommaString(lcData?.createdAt)
                          //   : "-"
                          convertDateToCommaString(lcData.period?.startDate)
                        }
                      />
                      <LCInfo
                        label="LC Expiry Date"
                        value={
                          lcData?.period?.endDate
                            ? convertDateToCommaString(lcData?.period?.endDate)
                            :  "-"
                        }
                      />
                      <LCInfo
                        label="Confirmation Date (Expected)"
                        value={
                          lcData?.expectedConfirmationDate
                            ? convertDateToCommaString(lcData?.expectedConfirmationDate)
                            : "-"
                        }
                      />
                      <LCInfo
                        label="Transhipment"
                        value={lcData?.transhipment === true ? "Yes" : "No"}
                          />
                          <LCInfo
                            label="Port of Shipment"
                            value={lcData?.shipmentPort?.port || ""}
                          />
                          <LCInfo
                            label="Product Description"
                            value={lcData?.productDescription || ""}
                            noBorder
                          />

                          <h2 className="text-xl font-semibold mt-3">
                            Importer Info
                          </h2>
                          <LCInfo
                            label="Applicant"
                            value={lcData?.importerInfo?.applicantName || ""}
                            noBorder
                          />
                          <LCInfo
                            label="Country of Import"
                        value={lcData?.importerInfo?.countryOfImport || ""}
                          />
                          <h2 className="text-xl font-semibold mt-3">
                            Exporter Info
                          </h2>
                          <LCInfo
                            label="Country"
                            value={lcData?.exporterInfo?.countryOfExport || ""}
                          />
                          <LCInfo
                            label="Charges on account of"
                            value="Beneficiary"
                            noBorder
                          />
                        </div>
                      </>
                    )}
                  </>
                )}

              </>
            )}
          </div>

          {/* Right Section */}
          <div className="w-full h-full flex flex-col justify-start px-5 overflow-y-auto max-h-[75vh]">
            <p className="text-xl font-semibold pt-5">{computedStatus == "Add bid" ? "Submit Your Bid" : "View Bids"}</p>
            {isInfo ? (
    // This is where we filter the bids for the logged-in user
    (() => {
      // console.log("🚀 ~ file: AddBid.tsx ~ line 116 ~ user ~ user", user);
      let userBids;
      if(isCorporate){
        userBids = lcData?.bids
      }
      else{
        userBids = lcData?.bids?.filter(bid => bid?.bidBy?._id === user?.business?._id);
      }
      return (
        <>
          {userBids && userBids.length > 0 ? (
            userBids.map((bid:IBids, index:number) => (
              <div className="border-borderCol px-4 mt-3   py-4  border  rounded-lg" key={bid._id}>
              <div
              key={bid._id || index}
              className="grid grid-cols-2 gap-y-3"
            >
              {/* Conditionally apply opacity to div based on status */}
            
              {/* Bid Number */}
              <div className={bid.status === "Expired" ? "opacity-50" : ""}>
                <p className="mb-1 text-sm text-para font-roboto">Bid Number</p>
                <p className="text-lg font-semibold">
                  {bid._id?.substring(0, 6) || "100928"}
                </p>
              </div>
            
              {/* Submitted by */}
              <div className={bid.status === "Expired" ? "opacity-50" : ""}>
                <p className="mb-1 text-sm text-para font-roboto">Submitted by</p>
                <p className="text-lg font-semibold capitalize">
                  {bid ? bid.bidBy.name : "Habib Bank Limited"}
                </p>
              </div>
            
              {/* Confirmation Rate */}
              <div className={bid.status === "Expired" ? "opacity-50" : ""}>
                <p className="mb-1 text-sm text-para font-roboto">Confirmation Rate</p>
                <p className="text-lg font-semibold text-text">
                  {bid ? bid.confirmationPrice : "1.75"}% {bid?.perAnnum ? "per annum" : "flat"}
                </p>
              </div>
            
              {/* Discounting Base Rate */}
              <div className={bid.status === "Expired" ? "opacity-50" : ""}>
                <p className="mb-1 text-sm text-para font-roboto">Discount Spread</p>
                <p className="text-lg font-semibold">
                  {bid ? (bid.discountBaseRate ? bid.discountBaseRate + "% per annum" : "Not Applicable") : "KIBOR + "}
                </p>
              </div>
            
              {/* Country */}
              <div className={bid.status === "Expired" ? "opacity-50" : ""}>
                <p className="mb-1 text-sm text-para font-roboto">Country</p>
                <p className="text-lg font-semibold capitalize">
                  {bid ? bid.bidBy.country : "Pakistan"}
                </p>
              </div>

                <div className={bid.status === "Expired" ? "opacity-50" : ""}>
                  <p className="text-sm text-para font-roboto">Confirmation Rate</p>
                  <p className="text-lg font-semibold text-text">
                    {bid ? bid.confirmationPrice : "1.75"}% {bid?.perAnnum ? 'per annum' : "flat"}
                  </p>
                </div>

                <div className={bid.status === "Expired" ? "opacity-50" : ""}>
                  <p className="text-sm text-para font-roboto">Discounting Base Rate</p>
                  <p className="font-semibold text-lg">
                    {bid ? (!bid.discountBaseRate && "Not Applicable") : "KIBOR + "}
                    <span className="text-text">
                      {bid ? (bid.discountBaseRate ? bid.discountBaseRate + "% per annum" : "") : ""}
                      {!bid && "2.22 % per annum"}
                    </span>
                  </p>
                </div>
                <div className={bid.status === "Expired" ? "opacity-50" : ""}></div>
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
              // Add Bids
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
                      maxDate={null}
                      // maxDate={lcData?.period?.endDate}
                      // isPast={false}
                    />
                  </div>
                  {errors.validity && (
                    <span className="text-red-500 text-[12px]">
                      {errors.validity.message}
                    </span>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmation"
                    className="block font-semibold mb-2"
                  >
                    {isDiscount ? "Confirmation Pricing" : "Your Pricing"}
                  </label>
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
                      if (Number(event.target.value.replace("%", "")) > 100) {
                        event.target.value = "100.0%";
                      }
                    }}
                  />
                  {errors.confirmationPrice && (
                    <span className="text-red-500 text-[12px]">
                      {errors.confirmationPrice.message}
                    </span>
                  )}
                </div>
                {isDiscount && (
                  <div className="flex gap-3">
                    {/* <BgRadioInput
                      id="perAnnum"
                      label="Per Annum"
                      name="confirmationPriceType"
                      value={"perAnnum"}
                      register={register}
                      onChange={(value) => setConfirmationPriceType(value)}
                      checked={confirmationPriceType === "perAnnum"}
                    /> */}
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
                        }}
                        className="accent-primaryCol size-4"
                      />
                      Flat
                    </label>
                  </div>
                )}

                    <div>
                      <label
                        htmlFor="confirmation"
                        className="block font-semibold mb-2"
                      >
                        {isDiscount ? "Confirmation Pricing" : "Your Pricing"}
                      </label>
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
                          if (Number(event.target.value.replace("%", "")) > 100) {
                            event.target.value = "100.0%";
                          }
                        }}
                      />
                      {errors.confirmationPrice && (
                        <span className="text-red-500 text-[12px]">
                          {errors.confirmationPrice.message}
                        </span>
                      )}
                    </div>
                    {isDiscount && (
                      <div className="flex gap-3">
                    {/* <BgRadioInput
                      id="perAnnum"
                      label="Per Annum"
                      name="confirmationPriceType"
                      value={"perAnnum"}
                      register={register}
                      onChange={(value) => setConfirmationPriceType(value)}
                      checked={confirmationPriceType === "perAnnum"}
                    /> */}
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
                          console.log(e.target.value);
                              setConfirmationPriceType(e.target.value);
                            }}
                            className="accent-primaryCol size-4"
                          />
                          Flat
                        </label>
                      </div>
                    )}

                    {isDiscount && (
                      <div className="">
                        <label
                          htmlFor="discount"
                          className="block font-semibold mb-2"
                        >
                          Discount Pricing
                        </label>
                        <div className="flex flex-col gap-y-3 items-center w-full">
                          <label
                            id="base-rate"
                            className="border border-borderCol py-2 px-3 rounded-md w-full flex items-center justify-between"
                          >
                            <p className="text-sm w-full text-black">
                              Select Base Rate
                            </p>
                        {/* <input
                          type="number"
                          id="base-rate"
                          value={discountBaseRate}
                          onChange={(e) => setDiscountBaseRate(e.target.value)}
                          className="max-w-[120px] text-sm block bg-none border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-[180px]"
                          placeholder="0"
                        /> */}
                            <div className="text-end">
                              <DDInput
                                id="baseRate"
                                label="Base Rate"
                                type="baseRate"
                                value={discountBaseRate}
                                placeholder="Select Value"
                                setValue={setValue}
                                onSelectValue={(value) =>
                                  setDiscountBaseRate(value)
                                }
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
                                Number(event.target.value.replace("%", "")) > 100
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
            </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
