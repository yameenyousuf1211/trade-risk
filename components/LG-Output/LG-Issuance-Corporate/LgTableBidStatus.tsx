import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, FileSearch, ListFilter, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  BgRadioInputLG,
  getLgBondTotal,
  formatFirstLetterOfWord,
  LcLgInfo,
} from "../helper";
import { BidsSort } from "@/components/helpers";
import { BidCard } from "./BidCard";
import { convertDateToCommaString, formatAmount } from "@/utils";
import { DocDraftIcon } from "@/public/images/DocDraftIcon";
import { convertDateAndTimeToStringGMT } from "@/utils/helper/dateAndTimeGMT";

export const LGTableBidStatus = ({
  data,
}: {
  buttonTitle?: string;
  isViewAll?: boolean;
  data: any;
}) => {
  const [selectedValue, setSelectedValue] = useState<string | number>("");

  useEffect(() => {
    // Set initial selectedValue based on available bonds
    if (data.bidBond?.Contract) {
      setSelectedValue("bidBond");
    } else if (data.retentionMoneyBond?.Contract) {
      setSelectedValue("retentionMoneyBond");
    } else if (data.performanceBond?.Contract) {
      setSelectedValue("performanceBond");
    } else if (data.advancePaymentBond?.Contract) {
      setSelectedValue("advancePaymentBond");
    } else if (data.otherBond?.Contract) {
      setSelectedValue("otherBond");
    }
  }, [data]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  const beneficiaryDetails = [
    { label: "Name", value: data.beneficiaryDetails.name },
    { label: "City", value: data.beneficiaryDetails.city },
    { label: "Country", value: data.beneficiaryDetails.country },
    { label: "Phone Number", value: data.beneficiaryDetails.phoneNumber },
    { label: "Street Address", value: data.beneficiaryDetails.address },
  ].filter((detail) => detail.value);

  const lgDetails = [
    {
      label: "Amount",
      value:
        `${data[selectedValue]?.currencyType} ${formatAmount(
          data[selectedValue]?.cashMargin
        )}` || "-",
    },
    data[selectedValue]?.valueInPercentage !== undefined && {
      label: "% of the contract",
      value: `${data[selectedValue]?.valueInPercentage}%`,
    },
    {
      label: "Expected Date",
      value: convertDateToCommaString(data[selectedValue]?.expectedDate) || "-",
    },
    {
      label: "Expiry Date",
      value: convertDateToCommaString(data[selectedValue]?.lgExpiryDate) || "-",
    },
    {
      label: "LG Tenor",
      value: `${data[selectedValue]?.lgTenor?.lgTenorValue || "-"} ${
        data[selectedValue]?.lgTenor?.lgTenorType || ""
      }`,
    },
    {
      label: "Expected Price",
      value:
        data[selectedValue]?.expectedPricing &&
        `${data[selectedValue]?.expectedPricing}%`,
    },
  ].filter((detail) => detail.value);

  const otherDetails = [
    {
      label: "Total Contract Value",
      value: `${data.totalContractCurrency} ${formatAmount(
        data.totalContractValue
      )}`,
    },
    {
      label: "Last Date for Receiving Bids",
      value: convertDateToCommaString(data.lastDateOfReceivingBids),
    },
    { label: "Purpose of LG", value: data.purpose },
    data.remarks && { label: "Remarks", value: data.remarks },
    { label: "Preference", value: data.priceQuotes },
  ].filter((detail) => detail.value); // Filter out any `false` or `undefined` items

  if (data.expectedPrice?.expectedPrice) {
    otherDetails.push({
      label: "Expected",
      value: `${data.expectedPrice.pricePerAnnum}% per annum`,
    });
  }
  const memoizedIssuingBanks = useMemo(
    () => data.issuingBanks,
    [data.issuingBanks]
  );
  const sortedBids = data.bids.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <Dialog>
      <DialogTrigger className={`center border rounded-md w-full px-1 py-2`}>
        <Eye className="size-5" color="black" />
      </DialogTrigger>
      <DialogContent className="w-full max-w-6xl !p-0 !max-h-[95vh] h-full grid grid-cols-2 gap-0 justify-start">
        <div className="col-span-2 flex items-center justify-between border-b border-b-borderCol px-7 !py-5 max-h-20">
          <h2 className="text-lg font-semibold">LG Re-Issuance Request</h2>
          <DialogClose>
            <X className="size-7" />
          </DialogClose>
        </div>

        {/* Left Section */}
        <div className="overflow-auto m-0 p-0 pb-8">
          <div className="border-r-2 border-b-2  bg-[#F5F7F9] p-4 flex flex-col gap-3 border-[#F5F7F9]">
            <h1 className="text-[#92929D] text-2xl">
              LG Amount:{" "}
              <span className="font-semibold text-black">
                {data.totalContractCurrency || "USD"}{" "}
                {formatAmount(getLgBondTotal(data))}
              </span>
            </h1>
            <h5 className="text-sm text-[#696974] font-light">
              Created at,{" "}
              {data.createdAt &&
                convertDateAndTimeToStringGMT({ date: data.createdAt })}
              , by{" "}
              <span className="text-[#50B5FF]">
                {formatFirstLetterOfWord(data.applicantDetails.company)}
              </span>
            </h5>
          </div>

          <div className="p-4">
            <h2 className="text-2xl font-semibold my-2 text-[#1A1A26]">
              Beneficiary Details
            </h2>

            {beneficiaryDetails.map(
              (
                detail: { label: string; value: string },
                index: Key | null | undefined
              ) => (
                <LcLgInfo
                  key={index}
                  label={detail.label}
                  value={detail.value}
                />
              )
            )}

            <h2 className="text-2xl font-semibold my-2 text-[#1A1A26]">
              LG Details
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {data.bidBond?.Contract && (
                <BgRadioInputLG
                  id="1"
                  label="Bid Bond"
                  name="lgdetails"
                  value="bidBond"
                  checked={selectedValue === "bidBond"}
                  bgchecked={selectedValue === "bidBond"}
                  onChange={handleChange}
                />
              )}

              {data.advancePaymentBond?.Contract && (
                <BgRadioInputLG
                  id="4"
                  label="Advance Payment Bond"
                  name="lgdetails"
                  value="advancePaymentBond"
                  checked={selectedValue === "advancePaymentBond"}
                  bgchecked={selectedValue === "advancePaymentBond"}
                  onChange={handleChange}
                />
              )}
              {data.performanceBond?.Contract && (
                <BgRadioInputLG
                  id="3"
                  label="Performance Bond"
                  name="lgdetails"
                  value="performanceBond"
                  checked={selectedValue === "performanceBond"}
                  bgchecked={selectedValue === "performanceBond"}
                  onChange={handleChange}
                />
              )}
              {data.retentionMoneyBond?.Contract && (
                <BgRadioInputLG
                  id="2"
                  label="Retention Money Bond"
                  name="lgdetails"
                  value="retentionMoneyBond"
                  checked={selectedValue === "retentionMoneyBond"}
                  bgchecked={selectedValue === "retentionMoneyBond"}
                  onChange={handleChange}
                />
              )}
              {data.otherBond?.Contract && (
                <BgRadioInputLG
                  id="5"
                  label={data.otherBond.name}
                  name="lgdetails"
                  value="otherBond"
                  checked={selectedValue === "otherBond"}
                  bgchecked={selectedValue === "otherBond"}
                  onChange={handleChange}
                />
              )}
            </div>

            {lgDetails.map(
              (
                detail: { label: string; value: string },
                index: Key | null | undefined
              ) => (
                <LcLgInfo
                  key={index}
                  label={detail.label}
                  value={detail.value}
                />
              )
            )}

            {data[selectedValue]?.attachments?.length > 0 && (
              <LcLgInfo
                label="LG Text Draft"
                value={
                  data[selectedValue]?.attachments[0].userFileName.length > 20
                    ? `${data[selectedValue]?.attachments[0].userFileName.slice(
                        0,
                        10
                      )}...${data[
                        selectedValue
                      ]?.attachments[0].userFileName.slice(-7)}`
                    : data[selectedValue]?.attachments[0].userFileName
                }
                link={data[selectedValue]?.attachments[0].url}
              />
            )}

            <h2 className="text-2xl font-semibold my-2 text-[#1A1A26]">
              Other Details
            </h2>
            {otherDetails.map(
              (
                detail: { label: string; value: string },
                index: Key | null | undefined
              ) => (
                <LcLgInfo
                  key={index}
                  label={detail.label}
                  value={detail.value}
                />
              )
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="px-3 overflow-auto flex flex-col pb-8">
          {/* Filter Section */}
          <div className="flex items-center justify-between w-full pt-5">
            <div className="flex items-center gap-x-2">
              <p className="bg-primaryCol text-white font-semibold text-lg rounded-xl py-1 px-3">
                {data.bids.length}
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
            <BidCard
              key={bidDetail._id}
              bidDetail={bidDetail}
              overallStatus={data.status}
              issuingBanks={memoizedIssuingBanks}
              otherBond={data.otherBond}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
