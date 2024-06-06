import { z } from "zod";

export interface ILoginFields {
  email: string;
  password: string;
}

export interface IRegisterFields {
  email: string;
  password: string;
  fullName: string;
}

// export type SigninFields = z.infer<typeof SignInSchema>

export interface IForgetFields {
  email: string;
}

// export type ForgetFields = z.infer<typeof ForgetSchema>

export interface IResetFields {
  password: string;
  confirmPassword: string;
}

// export type ResetPassword = z.infer<typeof ResetPasswordSchema>

export interface IApiResponse<T> {
  message: string;
  data: T;
  paginationData?: IPaginationData;
}

export interface PaginationTypes {
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: null | number;
  perPage: number;
  prevPage: null | number;
  totalItems: number;
  totalPages: number;
}

type RegisterStore = {
  role: string;
  name: string;
  email: string;
  address: string;
  constitution?: string;
  businessType?: string;
  businessNature?: string;
  phone: string;
  bank: string;
  swiftCode: string;
  accountNumber?: number;
  accountHolderName?: string;
  accountCountry?: string;
  accountCity?: string;
  productInfo?: {
    product: string;
    annualSalary: number;
    annualValueExports: number;
    annualValueImports: number;
  };
  pocEmail: string;
  pocPhone: string;
  pocName?: string;
  poc?: string;
  pocDesignation?: string;
  currentBanks?: {
    name: string;
    country: string;
    city: string;
  }[];
  confirmationLcs?: boolean;
  discountingLcs?: boolean;
  guaranteesCounterGuarantees?: boolean;
  discountingAvalizedBills?: boolean;
  avalizationExportBills?: boolean;
  riskParticipation?: boolean;
};

export type UseRegisterStore = RegisterStore & {
  setValues: (values: Partial<RegisterStore>) => void;
};

export interface IPagination {
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  perPage: number;
  prevPage: number | null;
  totalItems: number;
  totalPages: number;
}
export interface ApiResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface IUser {
  _id?: string;
  name?: string;
  email: string;
  role: string;
  country?: string;
  phone?: string;
  address?: string;
  constitution?: string;
  password?: string;
  bank?: string;
  accountNumber?: number;
  swiftCode?: string;
  accountHolderName?: string;
  accountCountry?: string;
  accountCity?: string;
  businessType?: string;
  productInfo?: {
    product: string;
    annualSalary: number;
    annualValueExports: number;
    annualValueImports: number;
  };
  pocName?: string;
  pocEmail?: string;
  pocPhone?: string;
  poc?: string;
  pocDesignation?: string;
  currentBanks?: string[];
  authorizationPocLetter?: string;
  confirmationLcs?: boolean;
  discountingLcs?: boolean;
  guaranteesCounterGuarantees?: boolean;
  discountingAvalizedBills?: boolean;
  avalizationExportBills?: boolean;
  riskParticipation: boolean;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILcs {
  _id: string;
  participantRole?: string;
  type: string;
  currency: string;
  amount: {
    price: number;
  };
  paymentTerms: string;
  createdBy?: {
    name: string;
    accountCountry: string;
  }[];
  issuingBank: {
    bank: string;
    country: string;
  };
  extraInfo: {
    days: Date;
    other: string;
  };
  advisingBank: {
    bank: string;
    country: string;
  };
  confirmingBank: {
    bank: string;
    country: string;
  };
  shipmentPort: {
    country: string;
    port: string;
  };
  bidsCount: number;
  transhipment: boolean;
  expectedConfirmationDate: Date;
  expectedDiscountingDate: Date;
  productDescription: string;
  period: {
    startDate: Date;
    endDate: Date;
  };
  importerInfo: {
    applicantName: string;
    countryOfImport: string;
  };
  exporterInfo: {
    beneficiaryName?: string;
    countryOfExport?: string;
    beneficiaryCountry?: string;
  };
  confirmationCharges: {
    behalfOf?: string;
  };
  discountAtSight?: string;
  pricePerAnnum?: number;
  refId?: number;
  attachments?: string[];
  draft?: boolean;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  bids: IBids[];
}

export interface IBids {
  _id: string;
  status: string;
  bidType: string;
  discountMargin?: number;
  discountBaseRate?: number;
  amount: number;
  validity?: Date;
  bidBy: {
    _id?: string;
    name?: string;
    country?: string;
    createdAt?: Date;
    updatedAt?: Date;
  };
  userInfo: {
    name: string;
    _id: string;
    country: string;
  };
  lcInfo: ILcInfo | any;
  confirmationPrice: string | number;
  lc?: string[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

ILcInfo: {
  country: string;
  bank: string;
}

export interface IMyBids {
  _id: string;
  bidBy: {
    _id: string;
    name: string;
    email: string;
  };
  address: string;
  avalizationExportBills: boolean;
  confirmationLcs: boolean;
  createdAt: string;
  currentBanks: string[];
  discountingAvalizedBills: boolean;
  discountingLcs: boolean;
  email: string;
  guaranteesCounterGuarantees: boolean;
  isDeleted: boolean;
  name: string;
  pocEmail: string;
  pocPhone: string;
  riskParticipation: boolean;
  role: string;
  swiftCode: string;
  updatedAt: string;
  bidType: string;
  bidValidity: string;
  confirmationPrice: number;
  id: string;
  lc: string;
  status: string;
}

export interface Country {
  name: string;
  flag: string;
  isoCode: string;
}

// risk participation
interface Bank {
  bank: string;
  country: string;
}

interface ExporterInfo {
  beneficiaryName: string;
  countryOfExport: string;
  beneficiaryCountry: string;
}

interface ImporterInfo {
  applicantName: string;
  countryOfImport: string;
}

interface RiskParticipationTransaction {
  type: string;
  amount: number;
  returnOffer: string;
  baseRate: string;
  perAnnum: string;
}

interface ShipmentPort {
  country: string;
  port: string;
}

export interface IRisk {
  advisingBank: Bank;
  attachment: any[]; // Adjust the type as needed for attachments
  banks: string[];
  confirmingBank: Bank;
  createdBy: string;
  description: string;
  draft: boolean;
  expectedDateConfimation: string; // ISO date string
  expectedDateDiscounting: string; // ISO date string
  expectedDiscounting: boolean;
  expiryDate: string; // ISO date string
  exporterInfo: ExporterInfo;
  importerInfo: ImporterInfo;
  isDeleted: boolean;
  isLcDiscounting: boolean;
  issuingBank: Bank;
  note: string;
  outrightSales: string;
  paymentTerms: string;
  riskParticipation: string;
  riskParticipationTransaction: RiskParticipationTransaction;
  shipmentPort: ShipmentPort;
  startDate: string; // ISO date string
  transaction: string;
  transhipment: boolean;
  currency: string;
  bids: IBidsInfo[];
  bidsCount: number;
  __v: number;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBidsInfo {
  _id: string;
  validity: Date;
  bidBy: string;
  amount: number;
  status: string;
  userInfo: {
    name: string;
    email: string;
    _id: string;
    country: string;
  };
}
