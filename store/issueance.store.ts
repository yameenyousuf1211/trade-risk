import { create } from "zustand";
import { LgDetails } from "@/types/lg";

type UseIssueanceStore = {
  _id: UseIssueanceStore;
  data: LgDetails["data"] | { data: {} };
  setValues: (values: Partial<LgDetails["data"]> | null) => void;
  removeValues: () => void;
};

const defaultValue = {
  draft: false,
  lgIssuance: "",
  _id: "",
  applicantDetails: undefined,
  beneficiaryDetails: undefined,
  lgDetailsType: "Choose any other type of LGs",
  bidBond: {
    Contract: false,
    currencyType: "",
    cashMargin: "0",
    expectedDate: undefined,
    valueInPercentage: undefined,
    lgTenor: {
      lgTenorType: "Months",
      lgTenorValue: "",
    },
  },
  advancePaymentBond: {
    Contract: false,
    currencyType: "",
    cashMargin: "0",
    expectedDate: undefined,
    lgExpiryDate: undefined,

    valueInPercentage: "",
    lgTenor: {
      lgTenorType: "Months",
      lgTenorValue: "",
    },
  },
  performanceBond: {
    Contract: false,
    currencyType: "",
    cashMargin: "0",
    expectedDate: undefined,
    lgExpiryDate: undefined,

    valueInPercentage: "",
    lgTenor: {
      lgTenorType: "Months",
      lgTenorValue: "",
    },
  },
  retentionMoneyBond: {
    Contract: false,
    currencyType: "",
    cashMargin: "0",
    expectedDate: undefined,
    lgExpiryDate: undefined,

    valueInPercentage: "",
    lgTenor: {
      lgTenorType: "Months",
      lgTenorValue: "",
    },
  },
  otherBond: {
    Contract: false,
    currencyType: "",
    cashMargin: "0",
    expectedDate: undefined,
    lgExpiryDate: undefined,
    valueInPercentage: "",
    lgTenor: {
      lgTenorType: "Months",
      lgTenorValue: "",
    },
  },
  issuingBanks: undefined,
  beneficiaryBanksDetails: undefined,
  purpose: "",
  remarks: "",
  priceQuotes: "",
  expectedPrice: "",
  typeOfLg: "Custom",
  issueLgWithStandardText: false,
  lgStandardText: "",
  physicalLg: false,
  physicalLgCountry: "",
  physicalLgBank: "",
  physicalLgSwiftCode: null,
  type: "",
  lastDateOfReceivingBids: "",
  totalLgAmount: "",
  totalContractValue: "",
  totalContractCurrency: "",
};

const useLcIssuance = create<UseIssueanceStore>((set, get) => ({
  data: defaultValue,
  setValues: (values: Partial<LgDetails["data"]> | null) =>
    set((state) => ({
      data: {
        ...state.data,
        ...(values ?? {}),
      },
    })),
  removeValues: () => set((state) => ({ data: defaultValue })),
}));

export const getStateValues = (
  state: UseIssueanceStore
): Omit<UseIssueanceStore, "setValues"> => {
  const { setValues, ...stateValues } = state;
  return stateValues;
};

export default useLcIssuance;
