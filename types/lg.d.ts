import { UseFormRegister, UseFormWatch } from 'react-hook-form';

export interface LgStepsProps1 {
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  setStepCompleted: (index: number, status: boolean) => void;
  step?: number;
}

export interface LgStepsProps2 {
    register: UseFormRegister<any>;
    data: string[];
    flags: string[];
    setValue: UseFormSetValue<any>;
    setStepCompleted: (index: number, status: boolean) => void;
    watch: UseFormWatch<any>;
    name?:string
    step?:number
}

export interface LgStepsProps3 {
    register: UseFormRegister<any>;
    data?: string[];
    flags?: string[];
    setValue: UseFormSetValue<any>;
    setStepCompleted: (index: number, status: boolean) => void;
    watch: UseFormWatch<any>;
}
export interface LgStepsProps5 {
    register: UseFormRegister<any>;
    watch: UseFormWatch<any>;
    setStepCompleted: (index: number, status: boolean) => void;
    setValue: UseFormSetValue<any>;
    name?: string;
    listValue?:string
    currency?:string[]
}

export interface LgStepsProps10 {
    register: UseFormRegister<any>;
    watch: UseFormWatch<any>;
    setStepCompleted: (index: number, status: boolean) => void;
    setValue: UseFormSetValue<any>;
    step?:number
}


export interface ApplicantDetails {
    country: string;
    company: string;
    crNumber: string;
}

export interface BeneficiaryDetails {
    country: string;
    name: string;
    address: string | null;
    phoneNumber?: string | null;
}

export interface LgDetails {
    data:{
        _id?: string;
        lgIssuance?: string;
        applicantDetails?: ApplicantDetails;
        beneficiaryDetails?: BeneficiaryDetails;
        lgDetailsType?: 'Contract Related LGs (Bid Bond, Advance Payment Bond, Performance Bond etc)' | 'Choose any other type of LGs';
        bidBond?: Bond;
        advancePaymentBond?: Bond;
        performanceBond?: Bond;
        retentionMoneyBond?: Bond;
        otherBond?: Bond;
        issuingBank?: IssuingBank;
        beneficiaryBanksDetails?: BeneficiaryBanksDetails;
        purpose?: string;
        remarks?: string;
        priceQuotes?: string;
        expectedPrice?: ExpectedPrice;
        typeOfLg?: 'Bid Bond' | 'Advance Payment Bond' | 'Performance Bond' | 'Retention Money Bond' | 'Payment LG' | 'Zakat' | 'Custom' | 'SBLC' | 'Other';
        issueLgWithStandardText?: boolean;
        lgStandardText?: string;
        physicalLg?: boolean;
        physicalLgCountry?: string;
        physicalLgBank?: string;
        physicalLgSwiftCode?: string | null;
        type: string;
        draft: boolean;
    }
    }

export interface Bond {
    Contract?: boolean;
    currencyType?: string;
    cashMargin?: number;
    valueInPercentage?: number;
    expectedDate?: Date;
    lgExpiryDate?: Date;
    lgTenor?: LgTenor;
    draft?: string;
}

export interface LgTenor {
    lgTenorType?: string;
    lgTenorValue?: number;
}

export interface IssuingBank {
    bank: string;
    country: string;
    swiftCode: string;
}

export interface BeneficiaryBanksDetails {
    bank: string;
    swiftCode: string;
}

export interface ExpectedPrice {
    expectedPrice: boolean;
    pricePerAnnum: string;
}