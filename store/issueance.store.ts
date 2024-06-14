import {
  LCIssueance,
  LcDiscounting,
  UseDiscountingStore,
  UseIssueanceStore,
} from "@/types/lc";
import { create } from "zustand";

type StateValues = Omit<UseIssueanceStore, "setValues">;

const useLcIssuance = create<UseIssueanceStore>((set, get) => ({
  _id: "",
  lgIssueAgainst: "",
  standardSAMA: "",
  issuingBank: {
    bank: "",
    country: "",
  },
  amount: {
    price: "",
    margin: "",
    amountPercentage: "",
  },
  period: {
    startDate: "",
    endDate: "",
  },
  instrument: "",
  lgType: "",
  productDescription: "",
  chargesBehalfOf: "",
  remarks: "",
  priceType: "",
  setValues: (values: Partial<LCIssueance | null>) =>
    set((state) => ({ ...state, ...values })),
}));

export const getStateValues = (state: UseIssueanceStore): StateValues => {
  const { setValues, ...stateValues } = state;
  return stateValues;
};

export default useLcIssuance;
