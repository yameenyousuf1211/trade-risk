import { LcConfirmation, UseConfirmationStore } from "@/types/type";
import { create } from "zustand";

type StateValues = Omit<UseConfirmationStore, "setValues">;

const useConfirmationStore = create<UseConfirmationStore>((set, get) => ({
  amount: "",
  currency: "",
  paymentTerms: "sight-lc",
  confirmingBank: {
    bank: "",
    country: "",
  },
  issuingBank: {
    bank: "",
    country: "",
  },
  lcPeriod: {
    startDate: undefined,
    endDate: undefined,
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
  setValues: (values: Partial<LcConfirmation>) =>
    set((state) => ({ ...state, ...values })),
}));
export const getStateValues = (state: UseConfirmationStore): StateValues => {
  const { setValues, ...stateValues } = state;
  return stateValues;
};
export default useConfirmationStore;
