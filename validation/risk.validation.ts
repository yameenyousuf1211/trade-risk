import { z } from "zod";

export const generalRiskSchema = z.object({
  banks: z.array(
    z.string().nonempty({ message: "Bank name cannot be empty" }),
    { message: "Please select a bank" }
  ),
  baftAgreement: z
    .object({
      agreement: z.any().optional(),
      signCopy: z.any().optional(),
    })
    .optional(),
  transaction: z.enum(["Risk Participation", "Outright Sales"], {
    message: "Select transaction type",
  }),
  riskParticipation: z.enum(["Non-Funded", "Funded"], {
    message: "Select risk participation",
  }),
  outrightSales: z
    .string()
    .nonempty({ message: "Outright sales cannot be empty" }),
  riskParticipationTransaction: z.object({
    type: z.enum(
      [
        "LC confirmation",
        "Avalization",
        "Supply chain Finance",
        "LC Discounting",
        "Trade Loan",
      ],
      {
        message: "Select risk participation type",
      }
    ),
    amount: z
      .string()
      .nonempty("Enter amount")
      .refine((value) => /^\d+$/.test(value), {
        message: "Enter a valid number",
      }),
    returnOffer: z
      .string()
      .nonempty({ message: "Return offer cannot be empty" }),
    baseRate: z
      .string()
      .nonempty("Enter base rate")
      .refine((value) => /^\d+$/.test(value), {
        message: "Enter a valid number",
      }),
    perAnnum: z
      .string()
      .nonempty("Enter per annum rate")
      .refine((value) => /^\d+$/.test(value), {
        message: "Enter a valid number",
      }),
    participationRate: z
      .string()
      .nonempty("Enter participation rate")
      .refine((value) => /^\d+$/.test(value), {
        message: "Enter a valid number",
      }),
  }),
  issuingBank: z.object(
    {
      bank: z.string({ message: "Issuing bank name is required" }),
      country: z.string({ message: "Issuing bank country is required" }),
    },
    { message: "Issuing bank details are required" }
  ),
  advisingBank: z.object(
    {
      bank: z.string({ message: "Advising bank name is required" }),
      country: z.string({ message: "Advising bank country is required" }),
    },
    { message: "Advising bank details are required" }
  ),
  confirmingBank: z.object(
    {
      bank: z.string({ message: "Confirming bank name is required" }),
      country: z.string({ message: "Confirming bank country is required" }),
    },
    { message: "Confirming bank details are required" }
  ),
  isLcDiscounting: z.boolean({ message: "Choose if LC is dicounted" }),
  expectedDiscounting: z.boolean({
    message: "Choose if LC is expected to be  dicounted",
  }),
  expectedDateDiscounting: z
    .string({ message: "Expected date for discounting cannot be empty" })
    .nonempty({ message: "Expected date for discounting cannot be empty" }),
  expiryDate: z.string().nonempty({ message: "Expiry date cannot be empty" }),
  startDate: z.string().nonempty({ message: "Start date cannot be empty" }),
  paymentTerms: z
    .string()
    .nonempty({ message: "Payment terms cannot be empty" }),
  shipmentPort: z.object({
    port: z.string().nonempty({ message: "Shipment port cannot be empty" }),
    country: z
      .string()
      .nonempty({ message: "Shipment country cannot be empty" }),
  }),
  transhipment: z.boolean(),
  expectedDateConfirmation: z
    .string()
    .nonempty({ message: "Expected date for confirmation cannot be empty" }),
  description: z.string().nonempty({ message: "Description cannot be empty" }),
  importerInfo: z.object({
    applicantName: z
      .string()
      .nonempty({ message: "Applicant name cannot be empty" }),
    countryOfImport: z
      .string()
      .nonempty({ message: "Country of import cannot be empty" }),
  }),
  exporterInfo: z.object({
    beneficiaryName: z
      .string()
      .nonempty({ message: "Beneficiary name cannot be empty" }),
    countryOfExport: z
      .string()
      .nonempty({ message: "Country of export cannot be empty" }),
    beneficiaryCountry: z
      .string()
      .nonempty({ message: "Beneficiary country cannot be empty" }),
  }),
  paymentType: z.string().nonempty({ message: "Payment type cannot be empty" }),
  attachment: z.any().optional(),
  note: z.string().nonempty({ message: "Note cannot be empty" }),
  draft: z.boolean(),
  days: z
    .string()
    .nonempty("Enter days")
    .refine((value) => /^\d+$/.test(value), {
      message: "Enter a valid number",
    }),
});

export const fundedSchema = z.lazy(() =>
  generalRiskSchema.merge(
    z.object({
      expectedConfirmationDate: z.date({
        message: "select expected confirmation date",
      }),
      exporterInfo: z.object({
        beneficiaryName: z
          .string({ message: "Enter exporter beneficiary name" })
          .nonempty("Enter beneficiary name"),
        countryOfExport: z.string({ message: "Select country of export" }),
        beneficiaryCountry: z.string({
          message: "Select exporter beneficiary country",
        }),
      }),
      confirmationInfo: z.object({
        behalfOf: z.enum(["Exporter", "Importer"], {
          message: "Select confirmation info",
        }),
        pricePerAnnum: z
          .string({ message: "Enter expected price per annum" })
          .nonempty("Enter expected price")
          .refine((value) => /^\d+(\.\d+)?$/.test(value), {
            message: "Enter a valid number",
          })
          .refine((value) => parseFloat(value) <= 100, {
            message: "Price per annum must be less than 100",
          }),
      }),
      advisingBank: z.optional(
        z.object({
          bank: z.string().optional(),
          country: z.string().optional(),
        })
      ),
    })
  )
);

export const nonfundedSchema = z.lazy(() =>
  generalRiskSchema.merge(
    z.object({
      advisingBank: z.object({
        bank: z.string({ message: "Advising bank name is required" }),
        country: z.string({ message: "Advising bank country is required" }),
      }),

      expectedDiscountingDate: z.date({ message: "select date" }),
      exporterInfo: z.object({
        beneficiaryName: z
          .string({ message: "Enter beneficiary name" })
          .nonempty("Enter beneficiary name"),
        countryOfExport: z.string({ message: "Select country of export" }),
        beneficiaryCountry: z.string({
          message: "Select beneficiary country",
        }),
      }),
      discountingInfo: z.object({
        discountAtSight: z.enum(["yes", "no"], {
          message: "Specify discount at sight",
        }),
        behalfOf: z.enum(["Exporter", "Importer"], {
          message: "Select charges on account of",
        }),
        pricePerAnnum: z
          .string({ message: "Enter expected price" })
          .nonempty("Enter expected price")
          .refine((value) => /^\d+(\.\d+)?$/.test(value), {
            message: "Enter a valid number",
          })
          .refine((value) => parseFloat(value) <= 100, {
            message: "Price per annum must be less than 100",
          }),
      }),
      extraInfo: z.enum(
        [
          "shipment",
          "upas",
          "acceptance",
          "negotiation",
          "invoice",
          "sight",
          "others",
        ],
        { message: "Extra info is required" }
      ),
    })
  )
);
