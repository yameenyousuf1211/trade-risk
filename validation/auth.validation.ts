import { z } from "zod";

const loginSchema = z.object({
  email: z
    .string({
      required_error: "Please enter a valid email address.",
    })
    .email(),
  password: z.string().min(6,"Password must be at least 6 characters long."),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const companyInfoSchema = z.object({
  name: z.string().min(5, "Company name must be at least 5 characters long."),
  email: z.string().email("Must be a valid email.").trim(),
  address: z.string().min(6, "Address must be at least 6 characters long."),
  phone: z.string().max(15).min(6, "Phone number must be at least 6 characters long."),
  bank: z.string().min(1, "Bank field cannot be empty."),
  swiftCode: z.string().min(5, "Swift code must be at least 5 characters long."),
  accountNumber: z.string().min(3, "Account number field cannot be empty."),
  accountHolderName: z.string().min(3, "Account holder name field cannot be empty."),
  businessNature: z.string().min(3, "Business nature field cannot be empty."),
  constitution: z.string().min(3, "Constitution field cannot be empty."),
  accountCountry: z.string().min(3, "Account country field cannot be empty."),
  accountCity: z.string().min(3, "Account city field cannot be empty."),
  businessType: z.string().min(3, "Business type field cannot be empty."),
});

const pointOfContractSchema = z.object({
  pocEmail: z.string().email("Must be a valid email."),
  pocPhone: z.string().min(6, "Poc phone number must be at least 6 characters long."),
  pocName: z.string().min(1, "Poc name field cannot be empty."),
  poc: z.string().min(1, "Poc field cannot be empty."),
  pocDesignation: z.string().min(1, "Poc designation field cannot be empty."),
});

const productsInfoSchema = z.object({
  product: z.string().min(1, "Product field cannot be empty."),
  annualSalary: z.string().min(1, "Annual salary is required."),
  annualValueExports: z.string().min(1, "Annual value is required"),
  annualValueImports: z.string().min(1, "Annual value is required"),
})

const bankSchema = z.object({
  role: z.string().default("bank"),
  email: z.string().email("Must be a valid email.").trim(),
  name: z.string(),
  pocPhone:z.string(),
  address: z.string(),
  swiftCode: z.string(),
  pocEmail: z.string(),
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

export { bankSchema,registerSchema, loginSchema, forgotPasswordSchema,companyInfoSchema,productsInfoSchema,pointOfContractSchema };
