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
  bidBond: undefined,
  advancePaymentBond: undefined,
  performanceBond: undefined,
  retentionMoneyBond: undefined,
  otherBond: undefined,
  issuingBank: undefined,
  beneficiaryBanksDetails: undefined,
  purpose: "",
  remarks: "",
  priceQuotes: "",
  expectedPrice: undefined,
  typeOfLg: "Custom",
  issueLgWithStandardText: false,
  lgStandardText: "",
  physicalLg: false,
  physicalLgCountry: "",
  physicalLgBank: "",
  physicalLgSwiftCode: null,
  type: "",
  createdAt: "",
  updatedAt: "",
  __v: 0,
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
