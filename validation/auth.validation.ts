import * as Yup from "yup";

const loginSchema = Yup.object().shape({
  email: Yup.string().required("*Email is required").email("Invalid email"),
  password: Yup.string()
    .required("*Password is required")
    .min(1, "*Password is required."),
});

const registerSchema = Yup.object().shape({
  email: Yup.string().required("*Email is required").email("*Invalid email"),
  password: Yup.string()
    .required("*Password is required")
    .min(6, "*Password must be at least 6 characters"),
});

const companyInfoSchema = Yup.object().shape({
  name: Yup.string()
    .required("*Company name is required")
    .min(1, "*Company name is required"),
  email: Yup.string()
    .required("*Email is required")
    .email("*Must be a valid email.")
    .trim(),
  country: Yup.string().required("*Select a country"),
  crNumber: Yup.string().required("*CR Number is required"),
  address: Yup.string()
    .required("*Address is required")
    .min(1, "*Address is required"),
  phone: Yup.string()
    .required("*Phone number is required")
    .min(4, "*Phone number is required")
    .max(15)
    .matches(/^\d+(\.\d+)?$/, "*Enter a valid number"),
  bank: Yup.string()
    .required("*Bank field cannot be empty.")
    .min(1, "*Bank field cannot be empty."),
  swiftCode: Yup.string()
    .required("*Swift code is required")
    .min(8, "*Swift code must be at least 8 characters long.")
    .max(11, "*Swift code must be less than 11 characters."),
  accountNumber: Yup.string()
    .required("*Account number is required")
    .min(16, "*Account number must contain 16 digits")
    .max(16, "*Account number must contain 16 digits")
    .matches(/^\d+(\.\d+)?$/, "*Enter a valid number"),
  accountHolderName: Yup.string()
    .required("*Account holder name is required")
    .min(1, "*Account holder name field cannot be empty."),
  businessNature: Yup.string()
    .required("*Business nature field cannot be empty.")
    .min(1, "*Business nature field cannot be empty."),
  constitution: Yup.string()
    .required("*Constitution field cannot be empty.")
    .min(3, "*Constitution field cannot be empty."),
  accountCountry: Yup.string()
    .required("*Account country is required")
    .min(1, "*Account country field cannot be empty."),
  accountCity: Yup.string()
    .required("*Account city field cannot be empty.")
    .min(1, "*Account city field cannot be empty."),
  businessType: Yup.string()
    .required("*Business type field cannot be empty.")
    .min(1, "*Business type field cannot be empty."),
});

const pointOfContractSchema = Yup.object().shape({
  pocEmail: Yup.string()
    .required("*POC Email is required")
    .email("*Must be a valid email."),
  pocPhone: Yup.string()
    .required("*POC phone is required")
    .min(4, "*POC Phone number is required")
    .matches(/^\d+(\.\d+)?$/, "*Enter a valid number"),
  pocName: Yup.string()
    .required("*POC name is required")
    .min(1, "*Poc name field cannot be empty."),
  poc: Yup.string()
    .required("*Poc field cannot be empty.")
    .min(1, "*Poc field cannot be empty."),
  pocDesignation: Yup.string()
    .required("*POC designation field cannot be empty.")
    .min(1, "*Poc designation field cannot be empty."),
});

const productsInfoSchema = Yup.object().shape({
  product: Yup.string()
    .required("*Add at least 1 product.")
    .min(1, "*Add at least 1 product."),
  annualSalary: Yup.string()
    .required("*Annual salary is required.")
    .matches(/^\d+(\.\d+)?$/, "*Enter a valid number"),
  annualValueExports: Yup.string()
    .required("*Annual value is required")
    .matches(/^\d+(\.\d+)?$/, "*Enter a valid number"),
  annualValueImports: Yup.string()
    .required("*Annual value is required")
    .matches(/^\d+(\.\d+)?$/, "*Enter a valid number"),
});

const bankSchema = Yup.object().shape({
  role: Yup.string().default("bank"),
  name: Yup.string()
    .required("*Bank name is required")
    .min(1, "*Bank name is required"),
  pocName: Yup.string()
    .required("*Authorized Point of Contact Name is required")
    .min(1, "*Authorized Point of Contact Name is required"),
  email: Yup.string()
    .required("*Email is required")
    .email("*Must be a valid email.")
    .trim(),
  accountCountry: Yup.string().required("*Select a country"),
  pocPhone: Yup.string()
    .required("*POC Phone number is required")
    .min(4, "*POC Phone number is required")
    .matches(/^\d+(\.\d+)?$/, "*Enter a valid number"),
  address: Yup.string().required("*Bank address is required"),
  swiftCode: Yup.string()
    .min(8, "at least 8 characters long.")
    .max(11, "must be less than 11 characters."),
  pocEmail: Yup.string()
    .required("*POC email is required")
    .email("*Must be a valid email.")
    .trim(),
  confirmationLcs: Yup.boolean().default(false),
  discountingLcs: Yup.boolean().default(false),
  guaranteesCounterGuarantees: Yup.boolean().default(false),
  discountingAvalizedBills: Yup.boolean().default(false),
  avalizationExportBills: Yup.boolean().default(false),
  riskParticipation: Yup.boolean().default(false),
});

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
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
