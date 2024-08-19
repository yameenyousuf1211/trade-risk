import { LcDiscounting, UseDiscountingStore } from "@/types/lc";
import { create } from "zustand";

type StateValues = Omit<UseDiscountingStore, "setValues">;

const useConfirmationStore = create<UseDiscountingStore>((set, get) => ({
  _id: "",
  amount: "",
  currency: "",
  paymentTerms: "Sight LC",
  confirmingBank: {
    bank: "",
    country: "",
  },
  issuingBanks: [
    {
      bank: "",
      country: "",
    },
  ],
  lcPeriod: {
    startDate: undefined,
    endDate: undefined,
    expectedDate: false,
  },
  participantRole: "exporter",
  shipmentPort: {
    country: "",
    port: "",
  },
  transhipment: "no",
  importerInfo: {
    applicantName: "",
    countryOfImport: "",
  },
  productDescription: "",
  expectedDiscountingDate: undefined,
  exporterInfo: {
    beneficiaryName: "",
    countryOfExport: "",
    beneficiaryCountry: "",
  },
  advisingBank: {
    bank: "",
    country: "",
  },
  discountingInfo: {
    discountAtSight: "",
    behalfOf: "",
    pricePerAnnum: "",
  },
  extraInfo: "shipment",
  setValues: (values: Partial<LcDiscounting | null>) =>
    set((state) => ({ ...state, ...values })),
}));

export const getStateValues = (state: UseDiscountingStore): StateValues => {
  const { setValues, ...stateValues } = state;
  return stateValues;
};

export default useConfirmationStore;
