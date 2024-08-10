import { z } from "zod";

export const generalRiskSchema = z
  .object({
    country: z.string({ message: "Issuing bank country is required" }),
    swiftCode: z.string()?.optional(),
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
    outrightSales: z
      .enum(["Pre Sales", "Asset On Books"], {
        message: "Outright sales cannot be empty",
      })
      .optional(),
    riskParticipation: z.enum(["Non-Funded", "Funded"], {
      message: "Select risk participation",
    }),
    currency: z.string({ message: "Currency is required" }).default("USD"),
    riskParticipationTransaction: z.object({
      type: z.enum(
        [
          "LC Confirmation",
          "LG (letter Of Guarantee)",
          "SBLC",
          "Avalization",
          "Supply Chain Finance",
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

      returnOffer: z.enum(["fixed", "perAnnum"], {
        message: "Return offer",
      }),

      baseRate: z.string({ message: '"Enter base rate"' }).optional(),
      // .nonempty("Enter base rate"),
      // // .refine((value) => /^\d+$/.test(value),
      //  {
      //   message: "Enter a valid number",
      // }),
      perAnnum: z.string({ message: '"Enter per annum rate"' }).optional(),
      // perAnnum: z
      //   .string()
      //   .nonempty("Enter per annum rate")
      //   .refine((value) => /^\d+$/.test(value), {
      //     message: "Enter a valid number",
      //   })
      //   .optional(),
      participationRate: z.string({
        message: "Enter participation rate",
      }),
    }),
    period: z.object(
      {
        expectedDate: z.enum(["yes", "no"], {
          message: "Select LC Period Type",
        }),
        startDate: z.date({ message: "Select issuance date" }),
      },
      { message: "Risk Participation Period is required" }
    ),
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
    isLcDiscounting: z.string({ message: "Choose if LC is dicounted" }),
    expectedDiscounting: z.string({
      message: "Choose if LC is expected to be  dicounted",
    }),
    expectedDateDiscounting: z.date({
      message: "Expected date for discounting cannot be empty",
    }),
    expiryDate: z.date({ message: "Expiry date cannot be empty" }),
    // startDate: z.date({ message: "Start date cannot be empty" }),
    paymentTerms: z
      .string()
      .nonempty({ message: "Payment terms cannot be empty" }),
    shipmentPort: z.object({
      port: z.string().nonempty({ message: "Shipment port cannot be empty" }),
      country: z
        .string()
        .nonempty({ message: "Shipment country cannot be empty" }),
    }),
    transhipment: z.string({ message: "Select transhipment" }),
    expectedDateConfirmation: z.date({
      message: "Expected date for confirmation cannot be empty",
    }),
    description: z
      .string()
      .nonempty({ message: "Description cannot be empty" }),
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
    paymentReceviedType: z
      .string()
      .nonempty({ message: "Payment Recevied type cannot be empty" }),
    attachment: z.any().optional(),
    note: z.string().nonempty({ message: "Note cannot be empty" }),
    // draft: z.boolean(),
    // days: z.string({ message: 'Enter days' }).optional())
    days: z.string({ message: "Enter days" }).optional(),
  })
  .refine(
    (data) => {
      if (data.paymentTerms === "tenor" && !data.days) {
        return false;
      }
      return true;
    },
    {
      message: "Days cannot be empty when payment terms is 'Tenor LC'",
      path: ["days"], // Indicate which field is causing the error
    }
  )
  .refine(
    (data) => {
      if (
        data.riskParticipation === "Funded" &&
        !data.riskParticipationTransaction.perAnnum
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "Base rate cannot be empty when risk participation is 'Funded'",
      path: ["baseRate"],
    }
  )
  .refine(
    (data) => {
      if (
        data.riskParticipation === "Funded" &&
        !data.riskParticipationTransaction.perAnnum
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "Per annum rate cannot be empty when risk participation is 'Funded'",
      path: ["perAnnum"],
    }
  );
