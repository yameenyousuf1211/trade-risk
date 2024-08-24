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
  convertDate,
  convertDateAndTimeToString,
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

  const { mutateAsync, isPending } = useMutation({
    mutationFn: acceptOrRejectBid,
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["bid-status"] });
      // queryClient.invalidateQueries({
      //   queryKey: ["bid-status"],
      // });
    },
  });

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
    <div className="rounded-lg border border-borderCol px-3 py-5">
      <div className="grid grid-cols-2 gap-y-4">
        <div className={data.status === "Expired" ? "opacity-50" : ""}>
          <p className="mb-1 text-sm text-para">Bid Number</p>
          <p className="text-lg font-semibold">
            {data._id?.slice(0, 6) || "12365"}
          </p>
        </div>
        <div className={data.status === "Expired" ? "opacity-50" : ""}>
          <p className="mb-1 text-sm capitalize text-para">Submitted by</p>
          <p className="text-lg font-semibold capitalize">
            {data.bidBy?.name || ""}
          </p>
        </div>
        <div className={data.status === "Expired" ? "opacity-50" : ""}>
          <p className="mb-1 text-sm text-para">Confirmation Rate</p>
          <p className="text-lg font-semibold text-text">
            {data.confirmationPrice}% {data?.perAnnum && "per annum"}
          </p>
        </div>
        {data?.discountMargin && (
          <div className={data.status === "Expired" ? "opacity-50" : ""}>
            <p className="mb-1 text-sm text-para">Discount Spread</p>
            <p className="text-lg font-semibold">
              {data.discountMargin
                ? data.discountMargin + "%"
                : "Not Applicable"}
            </p>
          </div>
        )}
        <div className={data.status === "Expired" ? "opacity-50" : ""}>
          <p className="mb-1 text-sm text-para">Country</p>
          <p className="text-lg font-semibold">{data.bidBy.country}</p>
        </div>
        <div className={data.status === "Expired" ? "opacity-50" : ""}>
          <p className="mb-1 text-sm text-para">Bid Recieved</p>
          <p className="text-lg font-semibold">{convertDate(data.createdAt)}</p>
        </div>

        <div className={data.status === "Expired" ? "opacity-50" : ""}>
          <p className="mb-1 text-sm text-para">Bid Expiry</p>
          <p className="text-lg font-semibold">
            {convertDate(data.bidValidity)}
          </p>
        </div>
        <div className={data.status === "Expired" ? "opacity-50" : ""}>
          {/* <p className="text-sm text-para mb-1">Minimum Charges</p>
    <p className="text-lg font-semibold text-text">AED 30,000.00</p> */}
        </div>
        {data.status === "Pending" && !isBank && (
          <>
            <DialogClose id="close-button" className="hidden"></DialogClose>
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
          </>
        )}
      </div>

      {data.status !== "Pending" && (
        <Button
          className={`${
            data.status === "Accepted"
              ? "bg-[#29C08433] hover:bg-[#29C08433]"
              : data.status === "Rejected"
                ? "bg-[#FF02021A] hover:bg-[#FF02021A]"
                : data.status === "Expired"
                  ? "bg-[#97979733] hover:bg-[#97979733]"
                  : data.status === "Submitted"
                    ? "bg-[#F4D0131A] hover:bg-[#F4D0131A]"
                    : ""
          } mt-2 w-full cursor-default text-black`}
        >
          {data.status === "Accepted"
            ? "Bid Accepted"
            : data.status === "Rejected"
              ? "Bid Rejected"
              : data.status === "Expired"
                ? "Request Expired"
                : data.status === "Submitted"
                  ? "Bid Submitted"
                  : ""}
        </Button>
      )}
    </div>
  );
};

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
      <p className="font-roboto text-sm font-normal text-para">{label}</p>
      <p className="max-w-[60%] text-right text-sm font-semibold capitalize">
        {value}
      </p>
    </div>
  );
};

export const TableDialog = ({
  lcId,
  bids,
  isBank,
  isViewAll,
  buttonTitle,
  isRisk = false,
}: {
  lcId: string;
  bids: IBids[];
  isBank?: boolean;
  buttonTitle?: string;
  isViewAll?: boolean;
  isRisk?: boolean;
}) => {
  // console.log("🚀 ~ isRisk:", isRisk);
  // Get LC
  const { data: lcData } = useQuery({
    queryKey: [`single-lc`, lcId],
    queryFn: () => fetchSingleLc(lcId),
    enabled: !isRisk,
  });

  // console.log("🚀 ~ lcData1:", lcData);
  const { data: riskData } = useQuery({
    queryKey: [`single-risk`, lcId],
    queryFn: () => fetchSingleRisk(lcId),
    enabled: isRisk,
  });

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

  const formatNumberWithCommas = (value: string | number) => {
    if (value === undefined || value === null) {
      return "";
    }

    value = value.toString();
    const numberString = value.replace(/,/g, "");
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
      <DialogContent className="h-full !max-h-[95vh] w-full max-w-4xl !p-0 flex flex-col">
        <div className="flex max-h-20 items-center justify-between border-b border-b-borderCol !py-5 px-7">
          <h2 className="text-lg font-semibold">
            {(lcData && lcData?.type) || "Risk Participation Request"}
          </h2>
          <DialogClose>
            <X className="size-7" />
          </DialogClose>
        </div>
        {
          lcData?.type==='LG Issuance' ? (
            <LGIssuanceDialog data={lcData}/>
          ) : (
          <div className="relative mt-0 flex h-full items-start justify-between overflow-y-hidden">
            {/* Left Section */}
            {isRisk ? (
              <>
                <div className="flex max-h-[90vh] w-full flex-col overflow-y-scroll">
                  <div className="bg-bg px-4 pb-5">
                    <div className="flex w-full items-center justify-between gap-x-2 rounded-lg border border-borderCol bg-white p-2">
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
                          <p className="text-[12px] text-para">PDF, 1.4 MB</p>
                        </div>
                      </div>
                    </div>
                    <p className="cursor-pointer text-sm font-medium underline">
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
                    value={riskData?.riskParticipationTransaction?.type || ""}
                  />
                  <LCInfo
                    label="Value of Transaction"
                    value={
                      formatNumberWithCommas(
                        riskData?.riskParticipationTransaction?.amount,
                      ) + ".00" || ""
                    }
                  />
                  <LCInfo
                    label="Return"
                    value={
                      riskData?.riskParticipationTransaction?.returnOffer || ""
                    }
                  />
                  <LCInfo
                    label="Participation Offered"
                    value={
                      riskData?.riskParticipationTransaction?.perAnnum || ""
                    }
                    noBorder
                  />
                </div>

                {/* Separator */}
                <div className="h-[2px] w-full bg-borderCol">
                  {/* LC Details */}
                  <div className="mt-4 px-4">
                    <h2 className="text-xl font-semibold">LC Details</h2>
                    <LCInfo
                      label="LC Issuing Bank"
                      value={riskData?.issuingBank?.bank || ""}
                    />
                    <LCInfo
                      label="LC Advising Bank"
                      value={riskData?.advisingBank?.bank || ""}
                    />
                    <LCInfo
                      label="Confirming Bank"
                      value={riskData?.confirmingBank?.bank || ""}
                    />
                    <LCInfo
                      label="LC Discounted"
                      value={
                        riskData?.transhipment === true
                          ? "Allowed"
                          : "Not allowed"
                      }
                    />
                    <LCInfo
                      label="Expected Discounting Date"
                      value={convertDateToCommaString(
                        riskData?.expectedDateDiscounting || "",
                      )}
                    />
                    <LCInfo
                      label="Issuance/Expected Issuance Date"
                      value={convertDateToCommaString(
                        (riskData?.startDate
                          ? riskData?.startDate
                          : riskData?.period?.startDate) || "",
                      )}
                      noBorder
                    />
                    <LCInfo
                      label="Date of Expiry"
                      value={convertDateToCommaString(
                        riskData?.expiryDate || "",
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
                      value={riskData?.transhipment === true ? "Yes" : "No"}
                      noBorder
                    />
                    {/* <LCInfo
                  label="Expected Confirmation Date"
                  value={convertDateToCommaString(
                    riskData?.expectedDateConfimation || ""
                  )}
                  noBorder
                /> */}

                    <h2 className="mt-3 text-xl font-semibold">
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

                    <h2 className="mt-3 text-xl font-semibold">
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
                    <h2 className="mt-3 text-xl font-semibold">
                      Importer Info
                    </h2>
                    <LCInfo
                      label="Beneficiary"
                      value={riskData?.importerInfo?.applicantName || ""}
                    />
                    <LCInfo
                      label="Country of Export"
                      value={riskData?.importerInfo?.countryOfImport || ""}
                    />
                    <LCInfo
                      label="Beneficiary Country"
                      value={riskData?.importerInfo?.beneficiaryCountry || ""}
                      noBorder
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="h-full max-h-[90vh] min-h-[85vh] w-full overflow-y-scroll border-r-2 border-r-borderCol pb-5">
                  <div className="bg-[#F5F7F9] px-4 pt-2">
                    <h2 className="mb-1 text-2xl font-semibold">
                      <span className="font-normal text-para">LC Amount:</span>{" "}
                      USD{" "}
                      {Number(
                        lcData && lcData.amount ? lcData?.amount?.price : total,
                      ).toLocaleString() + ".00"}
                    </h2>
                    <p className="font-roboto text-sm text-para">
                      Created at,{" "}
                      {lcData && convertDateAndTimeToString(lcData.createdAt)},
                      by{" "}
                      <span className="capitalize text-text">
                        {(lcData && lcData.exporterInfo?.beneficiaryName) ||
                          lcData?.createdBy?.name}
                      </span>
                    </p>

                    <div className="mt-3 h-[2px] w-full bg-neutral-800" />
                  </div>
                  {/* Main Info */}
                  <div className="bg-[#F5F7F9] px-4">
                    <LCInfo
                      label="LC Issuing Bank"
                      value={(lcData && lcData.issuingBanks[0]?.bank) || ""}
                    />
                    <LCInfo
                      label="LC Applicant"
                      value={
                        (lcData && lcData.importerInfo
                          ? lcData.importerInfo?.applicantName
                          : lcData?.applicantDetails?.company) || ""
                      }
                    />
                    {lcData?.advisingBank?.bank && (
                      <LCInfo
                        label="Advising Bank"
                        value={(lcData && lcData.advisingBank?.bank) || ""}
                      />
                    )}
                    {lcData?.confirmingBank?.bank && (
                      <LCInfo
                        label="Confirming Bank"
                        value={(lcData && lcData.confirmingBank?.bank) || ""}
                      />
                    )}
                    <LCInfo
                      label="Payments Terms"
                      value={
                        lcData?.paymentTerms &&
                        lcData?.paymentTerms !== "Sight LC"
                          ? `${lcData.paymentTerms} ${lcData.extraInfo?.days + " days" || ""} ${lcData.extraInfo?.other || ""}`
                          : lcData?.paymentTerms || "-"
                      }
                      noBorder
                    />
                  </div>
                  {/* Separator */}
                  <div className="mt- 5 h-[2px] w-full bg-borderCol" />
                  {/* LC Details */}
                  <div className="mt-2 px-4">
                    <h2 className="text-xl font-semibold">LC Details</h2>
                    <LCInfo
                      label="LC Issuance (Expected)"
                      value={
                        lcData &&
                        convertDateToCommaString(lcData?.period?.startDate)
                      }
                    />
                    <LCInfo
                      label="LC Expiry Date"
                      value={
                        lcData &&
                        lcData.period &&
                        convertDateToCommaString(lcData.period?.endDate)
                      }
                    />
                    <LCInfo
                      label="Confirmation Date (Expected)"
                      value={
                        lcData?.expectedConfirmationDate
                          ? convertDateToCommaString(
                              lcData?.expectedConfirmationDate,
                            )
                          : "-"
                      }
                    />
                    <LCInfo
                      label="Transhipment"
                      value={
                        lcData && lcData.transhipment === true ? "Yes" : "No"
                      }
                    />
                    <LCInfo
                      label="Port of Shipment"
                      value={(lcData && lcData.shipmentPort?.port) || ""}
                      noBorder
                    />

                    <h2 className="text-xl font-semibold">Exporter Info</h2>
                    <LCInfo
                      label="Beneficiary"
                      value={
                        (lcData && lcData.exporterInfo?.beneficiaryName) || ""
                      }
                    />
                    <LCInfo
                      label="Country"
                      value={
                        (lcData && lcData.exporterInfo?.countryOfExport) || ""
                      }
                    />
                    <LCInfo
                      label="Charges on account of"
                      value="Beneficiary"
                      noBorder
                    />
                    <h2 className="text-xl font-semibold">Importer Info</h2>
                    <LCInfo
                      label="Applicant"
                      value={
                        (lcData && lcData.importerInfo?.applicantName) || ""
                      }
                    />
                    <LCInfo
                      label="Country"
                      value={
                        (lcData && lcData.importerInfo?.countryOfImport) || ""
                      }
                    />
                  </div>
                </div>
              </>
            )}
            {/* Right Section */}
            <div className="flex h-full w-full flex-col justify-start px-5">
              {/* Filter Section */}
              <div className="flex w-full items-center justify-between pt-5">
                <div className="flex items-center gap-x-2">
                  <p className="rounded-xl bg-primaryCol px-3 py-1 text-lg font-semibold text-white">
                    {isBank ? userBids?.length : bids?.length}
                  </p>
                  <p className="text-xl font-semibold">{isBank ? 'View Bids' : "Bids received"}</p>
                </div>

                {/* <div className="flex items-center gap-x-4">
                  <BidsSort />
                  <div className="flex items-center gap-x-1 text-sm">
                    <ListFilter className="size-5" />
                    <p>Filter</p>
                  </div>
                </div> */}
              </div>
              {/* Bids */}
              <div className="mt-5 flex max-h-[65vh] flex-col gap-y-4 overflow-y-auto overflow-x-hidden">
                {isBank
                  ? userBids &&
                    userBids?.length > 0 &&
                    userBids?.map((data: any) => (
                      <BidCard
                        isRisk={isRisk}
                        data={data}
                        key={data._id}
                        isBank
                      />
                    ))
                  : bids &&
                    bids.length > 0 &&
                    bids
                      .reverse()
                      .map((data: any) => (
                        <BidCard data={data} key={data._id} isRisk={isRisk} />
                      ))}
              </div>
            </div>
          </div>

          )
        }
      </DialogContent>
    </Dialog>
  );
};
