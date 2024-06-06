// import { IRisk } from "@/types/type";
// import { create } from "zustand";

// interface RiskStore {
//   formData: IRisk;
//   setFormData: (data: Partial<IRisk> | null) => void;
// }

// const useRiskStore = create<RiskStore>((set) => ({
//   formData: {
//     advisingBank: {
//       country: "",
//       bank: "",
//     },
//     attachment: [],
//     banks: [],
//     confirmingBank: {
//       country: "",
//       bank: "",
//     },
//     createdBy: "",
//     description: "",
//     draft: false,
//     expectedDateConfimation: "",
//     expectedDateDiscounting: "",
//     expectedDiscounting: false,
//     expiryDate: "",
//     exporterInfo: {
//       beneficiaryCountry: "",
//       beneficiaryName: "",
//       countryOfExport: "",
//     },
//     importerInfo: { applicantName: "", countryOfImport: "" },
//     isDeleted: false,
//     isLcDiscounting: false,
//     issuingBank: {
//       country: "",
//       bank: "",
//     },
//     note: "",
//     outrightSales: "",
//     paymentTerms: "",
//     riskParticipation: "",
//     riskParticipationTransaction: {
//       type: "",
//       amount: 0,
//       perAnnum: "",
//       returnOffer: "",
//       baseRate: "",
//     },
//     shipmentPort: {
//       country: "",
//       port: "",
//     },
//     startDate: "",
//     transaction: "",
//     transhipment: false,
//     __v: 0,
//     _id: "",
//     createdAt: new Date(),
//   },
//   setFormData: (data) =>
//     set((state) => ({ formData: { ...state.formData, ...data } })),
// }));

// export default useRiskStore;


import { IRisk } from "@/types/type";
import { create } from "zustand";

// Define a type that includes all IRisk properties and the setValues method
type RiskState = IRisk & {
  setValues: (values: Partial<IRisk> | null) => void;
};

// Create the store with the combined type
const useRiskStore = create<RiskState>((set) => ({
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

  setValues: (values: Partial<IRisk> | null) =>
    set((state) => ({
      ...state,
      ...values,
    })),
}));

// Function to get state values excluding setValues
export const getStateValues = (state: RiskState): Omit<RiskState, 'setValues'> => {
  const { setValues, ...stateValues } = state;
  return stateValues;
};

export default useRiskStore;
