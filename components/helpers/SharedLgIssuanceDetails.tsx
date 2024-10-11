import { convertDateToCommaString, formatAmount } from "@/utils";
import { convertDateAndTimeToStringGMT } from "@/utils/helper/dateAndTimeGMT";
import {
  BgRadioInputLG,
  formatFirstLetterOfWord,
  getLgBondTotal,
  LcLgInfo,
} from "../LG-Output/helper";
import { useEffect, useState } from "react";

export const SharedLgIssuanceDetails = ({ data }) => {
  const [selectedValue, setSelectedValue] = useState<string>("");
  useEffect(() => {
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

  const applicantDetails = [
    { label: "Applicant Name", value: data?.createdBy?.accountHolderName },
    { label: "Applicant CR number", value: data.applicantDetails?.crNumber },
    { label: "Applicant Account Number", value: data.createdBy?.accountNumber },
    { label: "Applicant City", value: data.createdBy?.accountCity },
    { label: "Applicant Country", value: data.applicantDetails?.country },
    {
      label: "Last date for receiving bids",
      value: convertDateToCommaString(data.lastDateOfReceivingBids),
    },
  ].filter((detail) => detail.value);

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

  return (
    <div className="overflow-auto m-0 p-0 pb-8 flex-1">
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
        <div>
          {applicantDetails.map((detail, index) => (
            <LcLgInfo
              key={index}
              label={detail.label}
              value={detail.value || "-"}
            />
          ))}
        </div>
      </div>

      <div className="p-4">
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

        {lgDetails.map((detail, index) => (
          <LcLgInfo key={index} label={detail.label} value={detail.value} />
        ))}

        {data[selectedValue]?.attachments?.length > 0 && (
          <LcLgInfo
            label="LG Text Draft"
            value={
              data[selectedValue]?.attachments[0].userFileName.length > 20
                ? `${data[selectedValue]?.attachments[0].userFileName.slice(
                    0,
                    10
                  )}...${data[selectedValue]?.attachments[0].userFileName.slice(
                    -7
                  )}`
                : data[selectedValue]?.attachments[0].userFileName
            }
            link={data[selectedValue]?.attachments[0].url}
          />
        )}

        <div className="my-6">
          <h2 className="text-2xl font-semibold my-2 text-[#1A1A26]">
            Beneficiary Details
          </h2>

          {beneficiaryDetails.map((detail, index) => (
            <LcLgInfo key={index} label={detail.label} value={detail.value} />
          ))}
        </div>
      </div>
    </div>
  );
};
