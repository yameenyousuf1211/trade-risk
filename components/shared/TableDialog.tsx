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
  convertDateAndTimeToString,
  convertDateToCommaString,
  convertDateToYYYYMMDD,
} from "@/utils";
import { toast } from "sonner";
import { fetchSingleLc } from "@/services/apis/lcs.api";
import { useAuth } from "@/context/AuthProvider";
import { BidsSort } from "../helpers";
import { fetchSingleRisk } from "@/services/apis/risk.api";
import Image from "next/image";

export const BidCard = ({
  data,
  isBank,
  isRisk,
}: {
  data: IBids;
  isBank?: boolean;
  isRisk?: boolean;
}) => {
  console.log(data, "hhhhhhh");
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
    <div className="border border-borderCol py-5 px-3 rounded-lg">
      <div className="grid grid-cols-2 gap-y-4">
        <div className={data.status === "Expired" ? "opacity-50" : ""}>
          <p className="text-sm text-para mb-1">Bid Number</p>
          <p className="font-semibold text-lg">
            {data._id?.slice(0, 6) || "12365"}
          </p>
        </div>

        <div className={data.status === "Expired" ? "opacity-50" : ""}>
          <p className="capitalize text-lg font-semibold mb-1">
            {data.userInfo?.name || ""}
          </p>
          <p className="capitalize text-sm text-para">
            {data.userInfo?.country || ""}
          </p>
        </div>

        <div className={data.status === "Expired" ? "opacity-50" : ""}>
          <p className="text-sm text-para mb-1">Confirmation Rate</p>
          <p className="text-lg font-semibold text-text">
            {data.amount}% {data?.perAnnum && "per annum"}
          </p>
        </div>

        {data?.discountMargin && (
          <div className={data.status === "Expired" ? "opacity-50" : ""}>
            <p className="text-sm text-para mb-1">Discount Spread</p>
            <p className="text-lg font-semibold ">
              {data.discountMargin
                ? data.discountMargin + "%"
                : "Not Applicable"}
            </p>
          </div>
        )}

        <div className={data.status === "Expired" ? "opacity-50" : ""}>
          <p className="text-sm text-para mb-1">Bid Recieved</p>
          <p className="font-semibold text-lg">
            {convertDateToYYYYMMDD(data.createdAt)}
          </p>
        </div>

        <div className={data.status === "Expired" ? "opacity-50" : ""}>
          <p className="text-sm text-para mb-1">Bid Expiry</p>
          <p className="font-semibold text-lg">
            {convertDateToYYYYMMDD(data.bidValidity)}
          </p>
        </div>

        <div className={data.status === "Expired" ? "opacity-50" : ""}>
          {/* <p className="text-sm text-para mb-1">Minimum Charges</p>
    <p className="text-lg font-semibold text-text">AED 30,000.00</p> */}
        </div>

        {data.status === "Pending" && !isBank && (
          <>
            <DialogClose id="close-button" className="hidden"></DialogClose>
            <div className="col-span-2 flex gap-4 mt-2">
              <Button
                size="lg"
                className="bg-[#29C084] hover:bg-[#29C084]/90 flex-1"
                onClick={() => handleSubmit("Accepted", data._id)}
                disabled={isPending}
              >
                Accept
              </Button>
              <Button
                size="lg"
                className="text-para flex-1 bg-[#f4f7fa]"
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
          } mt-2 text-black w-full cursor-default`}
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
      <p className="font-roboto text-para font-normal text-sm">{label}</p>
      <p className="capitalize font-semibold text-right text-sm max-w-[60%]">
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
  console.log("🚀 ~ isRisk:", isRisk);
  // Get LC
  const { data: lcData } = useQuery({
    queryKey: [`single-lc`, lcId],
    queryFn: () => fetchSingleLc(lcId),
  });

  console.log("🚀 ~ lcData:", lcData);
  const { data: riskData } = useQuery({
    queryKey: [`single-risk`, lcId],
    queryFn: () => fetchSingleRisk(lcId),
  });
  console.log(lcId, "LC++");

  const { user } = useAuth();
  const userBids =
    isBank && user && bids?.filter((bid) => bid.bidBy === user._id);

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
            ? "font-roboto text-sm text-primaryCol font-light underline"
            : `center border  rounded-md w-full px-1 py-2 ${
                buttonTitle === "Accept" || buttonTitle === "Reject"
                  ? "bg-[#2F3031] text-white px-7"
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
      <DialogContent className="w-full max-w-4xl !p-0 !max-h-[95vh] h-full">
        <div className="flex items-center justify-between border-b border-b-borderCol px-7 !py-5 max-h-20">
          <h2 className="text-lg font-semibold">
            {(lcData && lcData?.type) || "Risk Participation Request"}
          </h2>
          <DialogClose>
            <X className="size-7" />
          </DialogClose>
        </div>

        <div className="overflow-y-hidden relative flex items-start justify-between h-full mt-0">
          {/* Left Section */}
          {isRisk ? (
            <div className="w-full flex flex-col overflow-y-scroll max-h-[90vh]">
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
                      <p className="text-para text-[12px]">PDF, 1.4 MB</p>
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
                  value={riskData?.riskParticipationTransaction?.type || ""}
                />
                <LCInfo
                  label="Value of Transaction"
                  value={
                    formatNumberWithCommas(
                      riskData?.riskParticipationTransaction?.amount
                    ) || ""
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
                  value={riskData?.riskParticipationTransaction?.perAnnum || ""}
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
                  value={riskData?.issuingBank?.bank || ""}
                />
                <LCInfo
                  label="LC Advising Bank"
                  value={riskData?.advisingBank?.bank || ""}
                />
                {lcData?.type ? (
                  <LCInfo
                    label="Confirming Bank"
                    value={riskData?.confirmingBank?.bank || ""}
                  />
                ) : null}
                {lcData?.type ? (
                  <LCInfo
                    label="LC Discounted"
                    value={
                      riskData?.transhipment === true
                        ? "Allowed"
                        : "Not allowed"
                    }
                  />
                ) : null}
                {lcData?.type ? (
                  <LCInfo
                    label="Expected Discounting Date"
                    value={convertDateToCommaString(
                      riskData?.expectedDateDiscounting || ""
                    )}
                  />
                ) : null}
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
                  value={convertDateToCommaString(riskData?.expiryDate || "")}
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

                <h2 className="text-xl font-semibold mt-3">Importer Info</h2>
                <LCInfo
                  label="Applicant"
                  value={riskData?.importerInfo?.applicantName || ""}
                />
                <LCInfo
                  label="Country of Import"
                  value={riskData?.importerInfo?.countryOfImport || ""}
                  noBorder
                />

                <h2 className="text-xl font-semibold mt-3">Exporter Info</h2>
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
                <h2 className="text-xl font-semibold mt-3">Importer Info</h2>
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
          ) : (
            <>
              <div className="w-full pb-5 border-r-2 border-r-borderCol h-full overflow-y-scroll max-h-[90vh] min-h-[85vh]">
                <div className="px-4 pt-2 bg-[#F5F7F9]">
                  <h2 className="text-2xl font-semibold mb-1">
                    <span className="text-para font-normal">LC Amount:</span>{" "}
                    USD{" "}
                    {Number(
                      lcData && lcData.amount ? lcData?.amount?.price : total
                    ).toLocaleString() + ".00"}
                  </h2>
                  <p className="font-roboto text-sm text-para">
                    Created at,{" "}
                    {lcData && convertDateAndTimeToString(lcData.createdAt)}, by{" "}
                    <span className="text-text capitalize">
                      {(lcData && lcData.exporterInfo?.beneficiaryName) ||
                        lcData?.createdBy?.name}
                    </span>
                  </p>

                  <div className="h-[2px] w-full bg-neutral-800 mt-3" />
                </div>
                {/* Main Info */}
                <div className="px-4  bg-[#F5F7F9]">
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
                  <LCInfo
                    label="Advising Bank"
                    value={(lcData && lcData.advisingBank?.bank) || "-"}
                  />
                  <LCInfo
                    label="Confirming Bank"
                    value={(lcData && lcData.confirmingBank?.bank) || "-"}
                  />
                  <LCInfo
                    label="Payments Terms"
                    value={(lcData && lcData.paymentTerms) || ""}
                    noBorder
                  />
                </div>
                {/* Separator */}
                <div className="h-[2px] w-full bg-borderCol mt- 5" />
                {/* LC Details */}
                <div className="px-4 mt-2">
                  <h2 className="text-xl font-semibold">LC Details</h2>
                  <LCInfo
                    label="LC Issuance (Expected)"
                    value={
                      lcData &&
                      convertDateToCommaString(lcData?.expectedConfirmationDate)
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
                    value={(lcData && lcData.importerInfo?.applicantName) || ""}
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
          <div className="w-full h-full flex flex-col justify-start px-5">
            {/* Filter Section */}
            <div className="flex items-center justify-between w-full pt-5">
              <div className="flex items-center gap-x-2">
                <p className="bg-primaryCol text-white font-semibold text-lg rounded-xl py-1 px-3">
                  {isBank ? userBids?.length : bids?.length}
                </p>
                <p className="text-xl font-semibold">Your Bids</p>
              </div>

              <div className="flex items-center gap-x-4">
                <BidsSort />
                <div className="flex items-center gap-x-1 text-sm">
                  <ListFilter className="size-5" />
                  <p>Filter</p>
                </div>
              </div>
            </div>
            {/* Bids */}
            <div className="flex flex-col gap-y-4 max-h-[65vh] overflow-y-auto overflow-x-hidden mt-5">
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
      </DialogContent>
    </Dialog>
  );
};
