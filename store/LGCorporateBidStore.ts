import { create } from "zustand";
import {
  BondStatus,
  BidSatatus,
  LGState,
  IssuingBank,
} from "../types/LGCorporateTypes";

const useLGStore = create<LGState>((set, get) => ({
  beneficiaryDetails: [
    { label: "Country", value: "Pakistan" },
    { label: "Name", value: "Nishat Group" },
    { label: "Phone Number", value: "+92 21 8726368" },
  ],

  lgDetails: [
    { label: "Amount", value: "20,000" },
    { label: "% of the contract", value: "10%" },
    { label: "Expected Date", value: "October 11, 2024" },
    { label: "Expiry Date", value: "November 20, 2024" },
    { label: "LG Tenor", value: "12 months" },
    { label: "LG Text Draft", value: "Text.jpeg" },
  ],

  otherDetails: [
    { label: "Purpose of LG", value: "Best Electric Components" },
    { label: "Remarks", value: "As soon as Possible" },
    { label: "Preference", value: "All prices quoted" },
    { label: "Expected", value: "10% per annum" },
  ],

  bidDetails: [
    {
      id: "1",
      bidNumber: "100928",
      bidValidity: "10 Oct, 2024",
      submittedDate: "10 July, 2024",
      submittedBy: "Soneri Bank",
      country: "Pakistan",
      banks: [
        {
          name: "Meezan Bank",
          country: "Pakistan",
          bidBond: { pricing: "10%", status: "None" },
          retentionBond: { pricing: "12%", status: "None" },
        },
        {
          name: "Barclays",
          country: "UK",
          bidBond: { pricing: "9.5%", status: "None" },
          retentionBond: { pricing: "11.5%", status: "None" },
        },
        {
          name: "BMO",
          country: "USA",
          bidBond: { pricing: "9.8%", status: "None" },
          retentionBond: { pricing: "11.8%", status: "None" },
        },
      ],
      selectedBank: "Meezan Bank",
      bidStatus: "None",
    },
    {
      id: "2",
      bidNumber: "100928",
      bidValidity: "10 Oct, 2024",
      submittedDate: "10 July, 2024",
      submittedBy: "Soneri Bank",
      country: "Pakistan",
      banks: [
        {
          name: "Meezan Bank",
          country: "Pakistan",
          bidBond: { pricing: "10%", status: "None" },
          retentionBond: { pricing: "12%", status: "None" },
        },
        {
          name: "Barclays",
          country: "UK",
          bidBond: { pricing: "9.5%", status: "None" },
          retentionBond: { pricing: "11.5%", status: "None" },
        },
        {
          name: "BMO",
          country: "USA",
          bidBond: { pricing: "9.8%", status: "None" },
          retentionBond: { pricing: "11.8%", status: "None" },
        },
      ],
      selectedBank: "Meezan Bank",
      bidStatus: "Expired",
    },
    {
      id: "3",
      bidNumber: "100928",
      bidValidity: "10 Oct, 2024",
      submittedDate: "10 July, 2024",
      submittedBy: "Soneri Bank",
      country: "Pakistan",
      banks: [
        {
          name: "Meezan Bank",
          country: "Pakistan",
          bidBond: { pricing: "10%", status: "None" },
          retentionBond: { pricing: "12%", status: "None" },
        },
        {
          name: "Barclays",
          country: "UK",
          bidBond: { pricing: "9.5%", status: "None" },
          retentionBond: { pricing: "11.5%", status: "None" },
        },
        {
          name: "BMO",
          country: "USA",
          bidBond: { pricing: "9.8%", status: "None" },
          retentionBond: { pricing: "11.8%", status: "None" },
        },
      ],
      selectedBank: "Meezan Bank",
      bidStatus: "Submitted",
    },
  ],

  updateLGDetail: (index, newValue) =>
    set((state) => {
      const updatedLGDetails = [...state.lgDetails];
      updatedLGDetails[index] = { ...updatedLGDetails[index], value: newValue };
      return { lgDetails: updatedLGDetails };
    }),

  updateOtherDetail: (index, newValue) =>
    set((state) => {
      const updatedOtherDetails = [...state.otherDetails];
      updatedOtherDetails[index] = {
        ...updatedOtherDetails[index],
        value: newValue,
      };
      return { otherDetails: updatedOtherDetails };
    }),

  setBidBondStatus: (id: string, bankName: IssuingBank, status: BondStatus) =>
    set((state) => ({
      bidDetails: state.bidDetails.map((bid) =>
        bid.id === id
          ? {
              ...bid,
              banks: bid.banks.map((bank) =>
                bank.name === bankName
                  ? { ...bank, bidBond: { ...bank.bidBond, status } }
                  : bank
              ),
            }
          : bid
      ),
    })),

  setRetentionBondStatus: (
    id: string,
    bankName: IssuingBank,
    status: BondStatus
  ) =>
    set((state) => ({
      bidDetails: state.bidDetails.map((bid) =>
        bid.id === id
          ? {
              ...bid,
              banks: bid.banks.map((bank) =>
                bank.name === bankName
                  ? {
                      ...bank,
                      retentionBond: { ...bank.retentionBond, status },
                    }
                  : bank
              ),
            }
          : bid
      ),
    })),

  setSelectedBank: (id: string, bankName: IssuingBank) =>
    set((state) => ({
      bidDetails: state.bidDetails.map((bid) =>
        bid.id === id ? { ...bid, selectedBank: bankName } : bid
      ),
    })),

  setBidStatus: (id: string, status: BidSatatus) =>
    set((state) => ({
      bidDetails: state.bidDetails.map((bid) =>
        bid.id === id ? { ...bid, bidStatus: status } : bid
      ),
    })),

  resetForm: (id: string) =>
    set((state) => ({
      bidDetails: state.bidDetails.map((bid) =>
        bid.id === id
          ? {
              ...bid,
              selectedBank: "Meezan Bank",
              banks: bid.banks.map((bank) => ({
                ...bank,
                bidBond: { ...bank.bidBond, status: "None" },
                retentionBond: { ...bank.retentionBond, status: "None" },
              })),
            }
          : bid
      ),
    })),
  getTotalBidDetails: () => get().bidDetails.length,
}));

export default useLGStore;
