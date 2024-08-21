import { create } from "zustand";

interface TypeField {
  name: string;
  value: string;
}

interface LGCashMarginState {
  corporate: TypeField[];

  createdAt: string;
  createdBy: string;
  lgAmount: string;
  clientExpectedPrice: string;
  applicant: TypeField[];
  lgDetails: TypeField[];
  beneficiaryDetails: TypeField[];
  totalBids: number;
  bidValidity: string;
  pricePerAnum: string;
  submitToAuthorizer?: boolean;
  bidSubmitted?: boolean;
  bidSubmittedDate?: string;
  bidExpired?: boolean;
  bidAcceptedByAnotherBank?: boolean;
  role: string;
  account: string;

  corporateSideBidAccepted: boolean;
  corporateSideBidRejected: boolean;
  corporateSideBidExpired: boolean;

  getBidValidity: () => string;
  setBidValidity: (value: string) => void;
  getPricePerAnum: () => string;
  setPricePerAnum: (value: string) => void;
  setSubmitToAuthorizer: (value: boolean) => void;
  setBidSubmitted: (value: boolean) => void;
  setBidSubmittedDate: (value: string) => void;
  setRole: (value: string) => void;

  setCorporateSideBidAccepted: (value: boolean) => void;
  setCorporateSideBidRejected: (value: boolean) => void;
}

const useLGCashMarginStore = create<LGCashMarginState>((set, get) => ({
  corporate: [
    { name: "Bid Number", value: "100928" },
    { name: "Mezan Bank", value: "Pakistan" },
    { name: "Bid Pricing", value: "2.35% per annum" },
    { name: "Bid Expiry", value: "Jan 10 2023, 23:59" },
    { name: "Bid Received", value: "Jan 9 2023, 14:55" },
  ],

  createdAt: "February 28, 2023 16:43",
  createdBy: "Huawei",
  lgAmount: "GBP 90,000",
  clientExpectedPrice: "15% Per Anum",
  applicant: [
    { name: "CR Number", value: "JKF34123412" },
    { name: "Country", value: "United Kingdom" },
    { name: "Purpose", value: "Produce Silicons" },
    { name: "Physical Instrument Required In", value: "Chicago" },
  ],
  lgDetails: [
    { name: "Type", value: "Payment LG" },
    { name: "Standard Text", value: "SAMA" },
    { name: "Tenor", value: "100 Days" },
    { name: "Expected Date Of Issuance", value: "October 20, 2024" },
  ],
  beneficiaryDetails: [
    { name: "Country", value: "United States" },
    { name: "Name", value: "Samsung" },
    { name: "Address", value: "85 Challenger Road, NJ 07660" },
  ],
  bidNumber: "100928",
  bank: "Meezan Bank",
  country: "Pakistan",
  totalBids: 1,
  bidValidity: "",
  pricePerAnum: "",
  submitToAuthorizer: false,
  bidSubmitted: false,
  bidSubmittedDate: "",
  bidExpired: false,
  bidAcceptedByAnotherBank: false,
  role: "creator",
  account: "corporate",

  corporateBidPricing: "2.35",
  corporateBidExpiry: "Jan 10 2023, 23:59",
  corporateBidRecieved: "Jan 9 2023, 14:55",
  corporateSideBidAccepted: false,
  corporateSideBidRejected: false,
  corporateSideBidExpired: false,

  getBidValidity: () => get().bidValidity,
  setBidValidity: (value: string) => set({ bidValidity: value }),
  getPricePerAnum: () => get().pricePerAnum,
  setPricePerAnum: (value: string) => set({ pricePerAnum: value }),
  setSubmitToAuthorizer: (value: boolean) => set({ submitToAuthorizer: value }),
  setBidSubmitted: (value: boolean) => set({ bidSubmitted: value }),
  setBidSubmittedDate: (value: string) => set({ bidSubmittedDate: value }),
  setRole: (value: string) => set({ role: value }),

  setCorporateSideBidAccepted: (value: boolean) =>
    set({ corporateSideBidAccepted: value }),
  setCorporateSideBidRejected: (value: boolean) =>
    set({ corporateSideBidRejected: value }),
}));

export default useLGCashMarginStore;
