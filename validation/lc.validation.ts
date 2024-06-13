import { z } from "zod";

const fileSchema = z.object({
  name: z.string(),
  type: z.string(),
  size: z.number(),
});

export const generalLcSchema = z.object({
  participantRole: z.enum(["exporter", "importer"], {
    message: "Select transaction role",
  }),
  amount: z
    .string({ message: "Enter amount" })
    .nonempty("Enter amount")
    .refine((value) => /^\d+$/.test(value), {
      message: "Enter a valid number",
    }),
  paymentTerms: z.enum(["Sight LC", "Usance LC", "Deferred LC", "UPAS LC"], {
    message: "Select a payment term",
  }),
  currency: z.string({ message: "Currency is required" }).default("USD"),
  issuingBank: z.object(
    {
      bank: z.string({ message: "Issuing bank name is required" }),
      country: z.string({ message: "Issuing bank country is required" }),
    },
    { message: "Issuing bank details is required" }
  ),
  advisingBank: z.optional(
    z.object({
      bank: z.string({ message: "Advising bank name is required" }),
      country: z.string({ message: "Advising bank country is required" }),
    })
  ),
  confirmingBank: z.optional(
    z.object({
      bank: z.string({ message: "Confirming bank name is required" }),
      country: z.string({ message: "Confirming bank country is required" }),
    })
  ),
  confirmingBank2: z.optional(
    z.object({
      bank: z.string({ message: "Confirming bank name is required" }),
      country: z.string({ message: "Confirming bank country is required" }),
    })
  ),
  period: z.object(
    {
      expectedDate: z.enum(["yes", "no"], {
        message: "Select LC Period Type",
      }),
      startDate: z.date({ message: "Select issuance date" }),
      endDate: z.date({ message: "Select expiry date" }),
    },
    { message: "LC Period is required" }
  ),
  shipmentPort: z.object(
    {
      country: z.string({ message: "Select shipment country" }),
      port: z.string({ message: "Select shipment port" }),
    },
    { message: "Shipment details is required" }
  ),
  transhipment: z.enum(["yes", "no"], { message: "Specify transhipment" }),
  importerInfo: z.object(
    {
      applicantName: z
        .string({ message: "Enter importer applicant name" })
        .nonempty("Enter applicant name"),
      countryOfImport: z
        .string({ message: "Select country of import" })
        .nonempty("Select country of import"),
    },
    { message: "Importer Info is required" }
  ),
  productDescription: z
    .string({ message: "Add product description" })
    .min(1, { message: "Product Description is required" })
    .max(300, { message: "Description cannot be more than 300 characters" }),
  extraInfo: z
    .enum(
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
    )
    .optional(),
  // baseRate: z.string({ message: "Base Rate is required" }),
});

export const confirmationSchema = z.lazy(() =>
  generalLcSchema.merge(
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
          .refine((value) => parseFloat(value) <= 100, {
            message: "Price per annum must be less than 100",
          }),
      }),
    })
  )
);

export const discountingSchema = z.lazy(() =>
  generalLcSchema.merge(
    z.object({
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
          // .refine((value) => /^\d+(\.\d+)?$/.test(value), {
          //   message: "Enter a valid number",
          // })
          .refine((value) => parseFloat(value) <= 100, {
            message: "Price per annum must be less than 100",
          }),
      }),
    })
  )
);

export const confirmationDiscountSchema = z.lazy(() =>
  generalLcSchema.merge(
    z.object({
      expectedConfirmationDate: z.date({ message: "select date" }),
      // expectedDiscountingDate: z.date({ message: "select date" }),
      exporterInfo: z.object({
        beneficiaryName: z
          .string({ message: "Enter beneficiary name" })
          .nonempty("Enter beneficiary name"),
        countryOfExport: z.string({ message: "Select country of export" }),
        beneficiaryCountry: z.string({
          message: "Select beneficiary country",
        }),
        bank: z.string({ message: "Select export bank" }),
      }),
      confirmationInfo: z.object({
        behalfOf: z.enum(["Exporter", "Importer"], {
          message: "Select one of above",
        }),
        pricePerAnnum: z
          .string({ message: "Enter expected price" })
          .nonempty("Enter expected price"),
        // .refine((value) => /^\d+(\.\d+)?$/.test(value), {
        //   message: "Enter a valid number",
        // }),
      }),
      discountingInfo: z.object({
        discountAtSight: z.enum(["yes", "no"], {
          message: "Specify discount at sight",
        }),
        behalfOf: z.enum(["Exporter", "Importer"], {
          message: "Select one of above",
        }),
        pricePerAnnum: z
          .string({ message: "Enter expected price" })
          .nonempty("Enter expected price")
          // .refine((value) => /^\d+(\.\d+)?$/.test(value), {
          //   message: "Enter a valid number",
          // })
          .refine((value) => parseFloat(value) <= 100, {
            message: "Price per annum must be less than 100",
          }),
          basePerRate: z.string({ message: "Base Rate is required" }),
      }),
    })
  )
);
