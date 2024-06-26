import {
  LcConfrimationDiscounting,
  UseConfrimationDiscountingStore,
} from "@/types/lc";
import { create } from "zustand";

type StateValues = Omit<UseConfrimationDiscountingStore, "setValues">;

const useConfirmationStore = create<UseConfrimationDiscountingStore>(
  (set, get) => ({
    _id: "",
    amount: "",
    currency: "",
    paymentTerms: "Sight LC",
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
    expectedConfirmationDate: undefined,
    exporterInfo: {
      beneficiaryName: "",
      countryOfExport: "",
      beneficiaryCountry: "",
      bank: "",
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
    confirmationInfo: {
      behalfOf: "",
      pricePerAnnum: "",
    },
    extraInfo: "shipment",
    setValues: (values: Partial<LcConfrimationDiscounting | null>) =>
      set((state) => ({ ...state, ...values })),
  })
);

export const getStateValues = (
  state: UseConfrimationDiscountingStore
): StateValues => {
  const { setValues, ...stateValues } = state;
  return stateValues;
};

export default useConfirmationStore;
