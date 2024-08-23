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
    Contract:false,
    cashMargin:"0",
    expectedDate: new Date(),
    valueInPercentage: "",
    lgTenor:{
      lgTenorType: "Months",
      lgTenorValue: ""
    }
  },
  advancePaymentBond: {
    Contract:false,
    cashMargin:"0",
    expectedDate: new Date(),
    lgExpiryDate: new Date(),

    valueInPercentage: "",
    lgTenor:{
      lgTenorType: "Months",
      lgTenorValue: ""
    }

  },
  performanceBond: {
    Contract:false,
    cashMargin:"0",
    expectedDate: new Date(),
    lgExpiryDate: new Date(),

    valueInPercentage: "",
    lgTenor:{
      lgTenorType: "Months",
      lgTenorValue: ""
    }

  },
  retentionMoneyBond: {
    Contract:false,
    cashMargin:"0",
    expectedDate: new Date(),
    lgExpiryDate: new Date(),

    valueInPercentage: "",
    lgTenor:{
      lgTenorType: "Months",
      lgTenorValue: ""
    }
  },
  otherBond: {
    Contract:false,
    cashMargin:"0",
    expectedDate: new Date(),
    lgExpiryDate: new Date(),
    valueInPercentage: "",
    lgTenor:{
      lgTenorType: "Months",
      lgTenorValue: ""
    }
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
  lastDateOfReceivingBids: ""
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
