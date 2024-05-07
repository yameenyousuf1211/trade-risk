import { z } from "zod";


const fileSchema = z.object({
  name: z.string(),
  type: z.string(),
  size: z.number(),
  // Add more properties if needed
});

export const confirmationSchema = z.object({
  participantRole: z.enum(["exporter", "imorter"], {
    message: "Select transaction role",
  }),
  amount: z.string({ message: "Enter amount" }),
  paymentTerms: z.enum(["sight-lc", "usance-lc", "deferred-lc", "upas-lc"], {
    message: "Select a payment term",
  }),
  currency: z.string({ message: "Currency is required" }),
  issuingBank: z.object({
    bank: z.string({ message: "Issuing bank name is required" }),
    country: z.string({ message: "Issuing bank country is required" }),
  }),
  confirmingBank: z.object({
    bank: z.string({ message: "Confirming bank name is required" }),
    country: z.string({ message: "Confirming bank country is required" }),
  }),
  lcPeriod: z.object({
    startDate: z.date({ message: "Select date" }),
    endDate: z.date({ message: "Select date" }),
  }),
  shipmentPort: z.object({
    country: z.string({ message: "Select a country" }),
    port: z.string({ message: "Select port" }),
  }),
  transhipment: z.enum(["yes", "no"], { message: "Specify transhipment" }),
  expectedConfirmationDate: z.date({ message: "select date" }),
  productDescription: z
    .string({ message: "Add product description" })
    .min(10, { message: "Description must be greater than 10 characters" })
    .max(300, { message: "Description cannot be more than 300 characters" }),
  importerInfo: z.object({
    applicantName: z.string({ message: "Enter applicant name" }),
    countryOfImport: z.string({ message: "Select country of import" }),
  }),
  exporterInfo: z.object({
    beneficiaryName: z.string({ message: "Enter beneficiary name" }),
    countryOfExport: z.string({ message: "Select country of export" }),
    beneficiaryCountry: z.string({
      message: "Select beneficiary country",
    }),
  }),
  confirmationCharges: z.object({
    behalfOf: z.enum(["Exporter", "Importer"], {
      message: "Select one of above",
    }),
  }),
  pricePerAnnum: z.string({ message: "Enter expected price" }),
  // attachments: z.union([z.array(fileSchema), z.undefined()]),
});


export const discountingSchema = z.lazy(() =>
  confirmationSchema.merge(
    z.object({
      advisingBank: z.object({
        bank: z.string({ message: "Advising bank name is required" }),
        country: z.string({ message: "Advising bank country is required" }),
      }),
      discountAtSight: z.enum(["yes", "no"], {
        message: "Specify discount at sight",
      }),
    })
  )
);
