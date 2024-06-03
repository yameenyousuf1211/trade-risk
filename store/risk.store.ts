import { IRisk } from "@/types/type";
import {create} from "zustand";

interface RiskStore {
  formData: IRisk;
  setFormData: (data: Partial<IRisk>) => void;
}

const useFormStore = create<RiskStore>((set) => ({
  formData: {
    advisingBank: {
      country: "",
      bank: "",
    },
    attachment: [],
    banks: [],
    confirmingBank: {
      country: "",
      bank: "",
    },
    createdBy: "",
    description: "",
    draft: false,
    expectedDateConfimation: "",
    expectedDateDiscounting: "",
    expectedDiscounting: false,
    expiryDate: "",
    exporterInfo: {
      beneficiaryCountry: "",
      beneficiaryName: "",
      countryOfExport: "",
    },
    importerInfo: { applicantName: "", countryOfImport: "" },
    isDeleted: false,
    isLcDiscounting: false,
    issuingBank: {
      country: "",
      bank: "",
    },
    note: "",
    outrightSales: "",
    paymentTerms: "",
    riskParticipation: "",
    riskParticipationTransaction: {
      type: "",
      amount: 0,
      perAnnum: "",
      returnOffer: "",
      baseRate: "",
    },
    shipmentPort: {
      country: "",
      port: "",
    },
    startDate: "",
    transaction: "",
    transhipment: false,
    __v: 0,
    _id: "",
    createdAt: new Date(),
  },
  setFormData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),
}));

export default useFormStore;
