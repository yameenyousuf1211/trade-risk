import { convertDateToCommaString } from "@/utils";
import { LcLgInfo } from "../LG-Output/helper";
import ViewFileAttachment from "./ViewFileAttachment";

const SharedLcDetails = ({ lcData }: { lcData: any }) => {
  const lcDetails = [
    { label: "LC Issuing Bank", value: lcData?.issuingBanks?.[0]?.bank },
    {
      label: "Country of LC Issuing Bank",
      value: lcData?.issuingBanks?.[0]?.country,
    },
    {
      label: "Payment Terms",
      value:
        lcData?.paymentTerms !== "Sight LC"
          ? `${lcData.paymentTerms}: ${lcData.extraInfo?.days} days at ${lcData.extraInfo?.other}`
          : lcData?.paymentTerms,
    },
    { label: "Transhipment", value: lcData?.transhipment ? "Yes" : "No" },
    {
      label: "Port of Shipment",
      value: `${lcData?.shipmentPort?.port}, ${lcData?.shipmentPort?.country}`,
    },
  ];

  const lcDetails2 = [
    {
      label: "LC Issuance (Expected)",
      value: convertDateToCommaString(lcData?.period?.startDate),
    },
    {
      label: "LC Expiry Date",
      value: lcData?.period?.endDate
        ? convertDateToCommaString(lcData?.period?.endDate)
        : "-",
    },
    {
      label: "Confirmation Date (Expected)",
      value: lcData?.expectedConfirmationDate
        ? convertDateToCommaString(lcData?.expectedConfirmationDate)
        : lcData?.expectedDiscountingDate
        ? convertDateToCommaString(lcData?.expectedDiscountingDate)
        : "-",
    },
    {
      label: "Last date for receiving Bids",
      value: lcData?.lastDateOfReceivingBids
        ? convertDateToCommaString(lcData?.lastDateOfReceivingBids)
        : "-",
    },
  ];

  const importerInfo = [
    { label: "Applicant", value: lcData?.importerInfo?.applicantName || "-" },
    {
      label: "Country of Import",
      value: lcData?.importerInfo?.countryOfImport || "-",
    },
  ];

  const exporterInfo = [
    {
      label: "Beneficiary Name",
      value: lcData?.exporterInfo?.beneficiaryName || "-",
    },
    {
      label: "Beneficiary Country",
      value: lcData?.exporterInfo?.beneficiaryCountry || "-",
    },
    {
      label: "Country of Export",
      value: lcData?.exporterInfo?.countryOfExport || "-",
    },
  ];

  const discountingInfo = lcData?.type.includes("Discount")
    ? [
        {
          label: "Charges on account Of",
          value: lcData?.discountingInfo?.behalfOf || "-",
        },
        {
          label: "Discounted At",
          value: lcData?.discountingInfo?.discountAtSight || "-",
        },
      ]
    : [];

  const confirmationInfo =
    lcData?.type === "LC Confirmation & Discounting"
      ? [
          {
            label: "Charges on account Of",
            value: lcData?.confirmationInfo?.behalfOf || "-",
          },
        ]
      : [];

  return (
    <div>
      <div className="bg-bg px-4 border-b-2 border-b-borderCol">
        <h2 className="text-xl font-semibold pt-2">LC Details</h2>
        {lcDetails.map((field, index) => (
          <LcLgInfo
            key={index}
            label={field.label}
            value={field.value || "-"}
            noBorder={index === lcDetails.length - 1}
          />
        ))}
        {lcData?.attachments?.length > 0 &&
          lcData.attachments.map((attachment: any, index: number) => (
            <ViewFileAttachment key={index} attachment={attachment} />
          ))}
      </div>
      <div className="px-4">
        {lcDetails2.map((field, index) => (
          <LcLgInfo
            key={index}
            label={field.label}
            value={field.value || "-"}
            noBorder={index === lcDetails2.length - 1}
          />
        ))}

        <h2 className="text-xl font-semibold mt-3">Importer Info</h2>
        {importerInfo.map((field, index) => (
          <LcLgInfo
            key={index}
            label={field.label}
            value={field.value || "-"}
            noBorder={index === importerInfo.length - 1}
          />
        ))}

        <h2 className="text-xl font-semibold mt-3">Exporter Info</h2>
        {exporterInfo.map((field, index) => (
          <LcLgInfo
            key={index}
            label={field.label}
            value={field.value || "-"}
            noBorder={index === importerInfo.length}
          />
        ))}

        {confirmationInfo.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mt-3">Confirmation Info</h2>
            {confirmationInfo.map((field, index) => (
              <LcLgInfo
                key={index}
                label={field.label}
                value={field.value || "-"}
                noBorder={index === confirmationInfo.length - 1}
              />
            ))}
          </>
        )}

        {discountingInfo.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mt-3">Discounting Info</h2>
            {discountingInfo.map((field, index) => (
              <LcLgInfo
                key={index}
                label={field.label}
                value={field.value || "-"}
                noBorder={index === discountingInfo.length - 1}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default SharedLcDetails;
