import * as Yup from "yup";

export const generalRiskSchema = Yup.object()
  .shape({
    country: Yup.string().required("Issuing bank country is required"),
    swiftCode: Yup.string().nullable(),
    banks: Yup.array()
      .of(Yup.string().required("Bank name cannot be empty"))
      .required("Please select a bank"),
    baftAgreement: Yup.object({
      agreement: Yup.mixed().nullable(),
      signCopy: Yup.mixed().nullable(),
    }).nullable(),
    transaction: Yup.mixed()
      .oneOf(["Risk Participation", "Outright Sales"])
      .required("Select transaction type"),
    outrightSales: Yup.mixed()
      .oneOf(["Pre Sales", "Asset On Books"])
      .nullable(),
    riskParticipation: Yup.mixed()
      .oneOf(["Non-Funded", "Funded"])
      .required("Select risk participation"),
    currency: Yup.string().required("Currency is required").default("USD"),
    riskParticipationTransaction: Yup.object().shape({
      type: Yup.mixed()
        .oneOf([
          "LC Confirmation",
          "LG (letter Of Guarantee)",
          "SBLC",
          "Avalization",
          "Supply Chain Finance",
          "LC Discounting",
          "Trade Loan",
        ])
        .required("Select risk participation type"),
      amount: Yup.string()
        .matches(/^\d+$/, "Enter a valid number")
        .required("Enter amount"),
      returnOffer: Yup.mixed()
        .oneOf(["fixed", "perAnnum"])
        .required("Return offer"),
      baseRate: Yup.string().nullable(),
      perAnnum: Yup.string().nullable(),
      participationRate: Yup.string().required("Enter participation rate"),
    }),
    period: Yup.object().shape({
      expectedDate: Yup.mixed()
        .oneOf(["yes", "no"])
        .required("Select LC Period Type"),
      startDate: Yup.date().required("Select issuance date"),
    }),
    issuingBank: Yup.object().shape({
      bank: Yup.string().required("Issuing bank name is required"),
      country: Yup.string().required("Issuing bank country is required"),
    }),
    advisingBank: Yup.object().shape({
      bank: Yup.string().required("Advising bank name is required"),
      country: Yup.string().required("Advising bank country is required"),
    }),
    confirmingBank: Yup.object().shape({
      bank: Yup.string().required("Confirming bank name is required"),
      country: Yup.string().required("Confirming bank country is required"),
    }),
    isLcDiscounting: Yup.string().nullable(),
    expectedDiscounting: Yup.string().nullable(),
    expectedDateDiscounting: Yup.date().nullable(),
    expiryDate: Yup.date().required("Expiry date cannot be empty"),
    paymentTerms: Yup.string().required("Payment terms cannot be empty"),
    shipmentPort: Yup.object().shape({
      port: Yup.string().required("Shipment port cannot be empty"),
      country: Yup.string().required("Shipment country cannot be empty"),
    }),
    transhipment: Yup.string().required("Select transhipment"),
    expectedDateConfirmation: Yup.date().required(
      "Expected date for confirmation cannot be empty"
    ),
    description: Yup.string().required("Description cannot be empty"),
    importerInfo: Yup.object().shape({
      applicantName: Yup.string().required("Applicant name cannot be empty"),
      countryOfImport: Yup.string().required(
        "Country of import cannot be empty"
      ),
    }),
    exporterInfo: Yup.object().shape({
      beneficiaryName: Yup.string().required(
        "Beneficiary name cannot be empty"
      ),
      countryOfExport: Yup.string().required(
        "Country of export cannot be empty"
      ),
      beneficiaryCountry: Yup.string().required(
        "Beneficiary country cannot be empty"
      ),
    }),
    paymentReceviedType: Yup.string().nullable(),
    attachment: Yup.mixed().nullable(),
    note: Yup.string().required("Note cannot be empty"),
    days: Yup.string().nullable(),
  })
  .test(
    "days-required",
    "Days cannot be empty when payment terms is 'Tenor LC'",
    function (value) {
      return value.paymentTerms !== "tenor" || !!value.days;
    }
  )
  .test(
    "baseRate-required",
    "Base rate cannot be empty when risk participation is 'Funded'",
    function (value) {
      return (
        value.riskParticipation !== "Funded" ||
        !!value.riskParticipationTransaction.baseRate
      );
    }
  )
  .test(
    "perAnnum-required",
    "Per annum rate cannot be empty when risk participation is 'Funded'",
    function (value) {
      return (
        value.riskParticipation !== "Funded" ||
        !!value.riskParticipationTransaction.perAnnum
      );
    }
  );
