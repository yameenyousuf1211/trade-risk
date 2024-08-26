import { LcConfirmation, UseConfirmationStore } from "@/types/lc";
import { create } from "zustand";

type StateValues = Omit<UseConfirmationStore, "setValues">;

const useConfirmationStore = create<UseConfirmationStore>((set, get) => ({
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
  advisingBank: {
    bank: "",
    country: "",
  },
  lcPeriod: {
    startDate: undefined,
    endDate: undefined,
    expectedDate: undefined,
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
  _id: "",
  expectedConfirmationDate: undefined,
  exporterInfo: {
    beneficiaryName: "",
    countryOfExport: "",
    beneficiaryCountry: "",
  },
  confirmationInfo: {
    behalfOf: "",
    pricePerAnnum: "",
    advisingBank: "",
  },
  extraInfo: {days: "",other:""},
  lastDateOfReceivingBids:undefined,
  setValues: (values: Partial<LcConfirmation | null>) =>
    set((state) => ({ ...state, ...values })),
}));

export const getStateValues = (state: UseConfirmationStore): StateValues => {
  const { setValues, ...stateValues } = state;
  return stateValues;
};

export default useConfirmationStore;
