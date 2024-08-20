import { create } from "zustand";
import { BankData, AssignedValues, GenType } from "../types/LGBankTypes";

interface BidState {
  selectedBank: string;
  selectedLgType: string;
  pricingValue: string;
  assignedValues: AssignedValues;
  showPreview: boolean;
  allAssigned: boolean;
  bankData: BankData;
  details: GenType[];
  lgDetails: GenType[];
  setSelectedBank: (bank: string) => void;
  setSelectedLgType: (lgType: string) => void;
  setPricingValue: (value: string) => void;
  setAssignedValues: (values: AssignedValues) => void;
  setShowPreview: (show: boolean) => void;
  setAllAssigned: (assigned: boolean) => void;
  handleNext: () => void;
  handleSkip: () => void;
}

export const useBidStore = create<BidState>((set, get) => ({
  selectedBank: "Meezan Bank",
  selectedLgType: "Bid Bond",
  pricingValue: "",
  assignedValues: {},
  showPreview: false,
  allAssigned: false,
  details: [
    { label: "Request Expiry Date:", value: "10 Oct,2024" },
    { label: "Purpose of LG:", value: "Best Electronics in Pakistan" },
    { label: "Beneficiary Name", value: "Nishat Group" },
    { label: "Beneficiary Country", value: "Pakistan" },
    { label: "Beneficiary Address", value: "7- Main Gulberg, Lahore, Punjab" },
    { label: "Beneficiary Phone", value: "+92 21 8726368" },
  ],
  lgDetails: [
    { label: "Amount", value: "USD 20,000" },
    { label: "Expected Date of issuance", value: "October 11, 2024" },
    { label: "Expiry Date", value: "November 20, 2024" },
    { label: "LG Tenor", value: "12 Months" },
    { label: "LG Text Draft", value: "Draft.png" },
  ],
  bankData: {
    "Meezan Bank": {
      name: "Meezan Bank",
      country: "Pakistan",
      selected: true,
      lgTypes: [
        { type: "Bid Bond", amount: "USD 20,000", selected: true },
        {
          type: "Retention Bond",
          amount: "USD 10,000",
          selected: false,
        },
      ],
      clientExpectedPrice: "15% Per Annum",
    },
    Barclays: {
      name: "Barclays",
      country: "UK",
      selected: false,
      lgTypes: [
        { type: "Bid Bond", amount: "USD 25,000", selected: true },
        {
          type: "Retention Bond",
          amount: "USD 15,000",
          selected: false,
        },
      ],
      clientExpectedPrice: "12% Per Annum",
    },
    BMO: {
      name: "BMO",
      country: "USA",
      selected: false,
      lgTypes: [
        { type: "Bid Bond", amount: "USD 30,000", selected: true },
        {
          type: "Retention Bond",
          amount: "USD 20,000",
          selected: false,
        },
      ],
      clientExpectedPrice: "10% Per Annum",
    },
  },

  setSelectedBank: (bank) => set({ selectedBank: bank }),
  setSelectedLgType: (lgType) => set({ selectedLgType: lgType }),
  setPricingValue: (value) => set({ pricingValue: value }),
  setAssignedValues: (values) => set({ assignedValues: values }),
  setShowPreview: (show) => set({ showPreview: show }),
  setAllAssigned: (assigned) => set({ allAssigned: assigned }),

  handleNext: () => {
    const {
      selectedBank,
      selectedLgType,
      pricingValue,
      assignedValues,
      bankData,
    } = get();

    if (pricingValue) {
      set((state) => ({
        assignedValues: {
          ...state.assignedValues,
          [selectedBank]: {
            ...state.assignedValues[selectedBank],
            [selectedLgType]: pricingValue,
          },
        },
        pricingValue: "",
      }));
    }

    const nextOption = findNextOption(
      selectedBank,
      selectedLgType,
      bankData,
      assignedValues,
    );

    if (nextOption) {
      set({
        selectedBank: nextOption.bank,
        selectedLgType: nextOption.lgType,
      });
    } else {
      set({ allAssigned: true, showPreview: true });
    }
  },
  handleSkip: () => {
    const { selectedBank, selectedLgType, bankData, assignedValues } = get();

    const nextOption = findNextOption(
      selectedBank,
      selectedLgType,
      bankData,
      assignedValues,
    );

    if (nextOption) {
      set({
        selectedBank: nextOption.bank,
        selectedLgType: nextOption.lgType,
        pricingValue: "",
      });
    } else {
      set({ allAssigned: true, showPreview: true });
    }
  },
}));

// Helper function to find the next available option
function findNextOption(
  currentBank: string,
  currentLgType: string,
  bankData: BankData,
  assignedValues: AssignedValues,
) {
  const banks = Object.keys(bankData);
  const currentBankIndex = banks.indexOf(currentBank);

  for (let i = currentBankIndex; i < banks.length; i++) {
    const bank = banks[i];
    const lgTypes = bankData[bank].lgTypes;

    for (let j = 0; j < lgTypes.length; j++) {
      const lgType = lgTypes[j].type;
      if (i === currentBankIndex && lgType === currentLgType) continue;

      if (!assignedValues[bank] || !assignedValues[bank][lgType]) {
        return { bank, lgType };
      }
    }
  }

  // No more options available
  return null;
}
