import { z } from "zod";

const loginSchema = z.object({
  email: z
    .string({
      message: "*Email is required",
      required_error: "Please enter a valid email address.",
    })
    .min(1, "*Email is required")
    .email({ message: "Invalid email" }),
  password: z
    .string({ message: "*Password is required" })
    .min(1, "*Password is required."),
});

const registerSchema = z.object({
  email: z
    .string({ message: "*Email is required" })
    .email({ message: "*Invalid email" }),
  password: z.string({ message: "*Password is required" }).min(6),
});

const companyInfoSchema = z.object({
  name: z
    .string({ message: "*Company name is required" })
    .min(1, "*Company name is required"),
  email: z
    .string({ message: "*Email is required" })
    .min(1, "*Email is required")
    .email("*Must be a valid email.")
    .trim(),
  address: z
    .string({ message: "*Address is required" })
    .min(1, "*Address is required"),
  phone: z
    .string({ message: "*Phone number is required" })
    .min(9, "*Provide a valid phone number")
    .max(15)
    .refine((value) => /^\d+(\.\d+)?$/.test(value), {
      message: "*Enter a valid number",
    }),
  bank: z
    .string({ message: "*Bank field cannot be empty." })
    .min(1, "*Bank field cannot be empty."),
  swiftCode: z
    .string({ message: "*Swift code is required" })
    .min(8, "*Swift code must be at least 8 characters long.")
    .max(11, "*Swift code must be less than 11 characters."),
  accountNumber: z
    .string({ message: "*Account number is required" })
    .min(16, "*Account number must contain 16 digits")
    .max(16, "*Account number must contain 16 digits")
    .refine((value) => /^\d+(\.\d+)?$/.test(value), {
      message: "*Enter a valid number",
    }),
  accountHolderName: z
    .string({ message: "*Account holder name is required" })
    .min(1, "*Account holder name field cannot be empty."),
  businessNature: z
    .string({ message: "*Business nature field cannot be empty." })
    .min(1, "*Business nature field cannot be empty."),
  constitution: z
    .string({ message: "*Constitution field cannot be empty." })
    .min(3, "*Constitution field cannot be empty."),
  accountCountry: z
    .string({ message: "*Account country is required" })
    .nonempty("*Account country is required")
    .min(1, "Account country field cannot be empty."),
  accountCity: z
    .string({ message: "*Account city field cannot be empty." })
    .min(1, "*Account city field cannot be empty."),
  businessType: z
    .string({ message: "*Business type field cannot be empty." })
    .min(1, "*Business type field cannot be empty."),
});

const pointOfContractSchema = z.object({
  pocEmail: z
    .string({ message: "*POC Email is required" })
    .min(1, "*POC Email is required")
    .email("*Must be a valid email."),
  pocPhone: z
    .string({ message: "*POC phone is required" })
    .min(4, "*POC Phone is required.")
    .refine((value) => /^\d+(\.\d+)?$/.test(value), {
      message: "*Enter a valid number",
    }),
  pocName: z
    .string({ message: "*POC name is required" })
    .min(1, "*Poc name field cannot be empty."),
  poc: z
    .string({ message: "*Poc field cannot be empty." })
    .min(1, "*Poc field cannot be empty."),
  pocDesignation: z
    .string({ message: "*POC designation field cannot be empty." })
    .min(1, "*Poc designation field cannot be empty."),
});

const productsInfoSchema = z.object({
  product: z
    .string({ message: "*Add atleast 1 product." })
    .min(1, "*Add atleast 1 product."),
  annualSalary: z
    .string({ message: "*Annual salary is required." })
    .min(1, "*Annual salary is required.")
    .refine((value) => /^\d+(\.\d+)?$/.test(value), {
      message: "*Enter a valid number",
    }),
  annualValueExports: z
    .string({ message: "*Annual value is required" })
    .min(1, "*Annual value is required")
    .refine((value) => /^\d+(\.\d+)?$/.test(value), {
      message: "*Enter a valid number",
    }),
  annualValueImports: z
    .string({ message: "*Annual value is required" })
    .min(1, "*Annual value is required")
    .refine((value) => /^\d+(\.\d+)?$/.test(value), {
      message: "*Enter a valid number",
    }),
});

const bankSchema = z.object({
  role: z.string().default("bank"),
  name: z
    .string({ message: "*Bank name is required" })
    .nonempty("*Bank name is required"),
  email: z
    .string({ message: "*Email is required" })
    .min(1, "*Email is required")
    .email("*Must be a valid email.")
    .trim()
    .nonempty("*Email is required"),
  accountCountry: z
    .string({ message: "*Select a country" })
    .nonempty("*Select a country"),
  // accountCity: z.string({ message: "*Select city" }).nonempty("*Select city"),
  pocPhone: z
    .string({ message: "*POC Phone number is required" })
    .min(9, "*Provide a valid phone number")
    .refine((value) => /^\d+(\.\d+)?$/.test(value), {
      message: "*Enter a valid number",
    }),
  address: z.string().nonempty("*Bank address is required"),
  swiftCode: z
    .string()
    .min(8, "at least 8 characters long.")
    .max(11, "must be less than 11 characters."),
  pocEmail: z
    .string({ message: "*POC email is required" })
    .min(1, "*POC Email is required")
    .email("Must be a valid email.")
    .trim()
    .nonempty("*Email is required"),
  confirmationLcs: z.boolean().default(false),
  discountingLcs: z.boolean().default(false),
  guaranteesCounterGuarantees: z.boolean().default(false),
  discountingAvalizedBills: z.boolean().default(false),
  avalizationExportBills: z.boolean().default(false),
  riskParticipation: z.boolean().default(false),
});
const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export {
  bankSchema,
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  companyInfoSchema,
  productsInfoSchema,
  pointOfContractSchema,
};
