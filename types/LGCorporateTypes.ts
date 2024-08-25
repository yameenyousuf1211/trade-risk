export type IssuingBank = "Meezan Bank" | "Barclays" | "BMO";
export type BondStatus = "Accepted" | "Rejected" | "None";
export type BidSatatus = "Submitted" | "Expired" | "None";

export type Bank = {
  name: IssuingBank;
  country: string;
  bidBond: {
    pricing: string;
    status: BondStatus;
  };
  retentionBond: {
    pricing: string;
    status: BondStatus;
  };
};

export type BidDetails = {
  id: string;
  bidNumber: string;
  bidValidity: string;
  submittedDate: string;
  submittedBy: string;
  country: string;
  banks: Bank[];
  selectedBank: IssuingBank;
  bidStatus: BidSatatus;
};

export type LGDetail = {
  label: string;
  value: string;
};

export type LGState = {
  beneficiaryDetails: LGDetail[];
  lgDetails: LGDetail[];
  otherDetails: LGDetail[];
  bidDetails: BidDetails[];
  updateLGDetail: (index: number, newValue: string) => void;
  updateOtherDetail: (index: number, newValue: string) => void;
  setBidBondStatus: (
    id: string,
    bankName: IssuingBank,
    status: BondStatus
  ) => void;
  setRetentionBondStatus: (
    id: string,
    bankName: IssuingBank,
    status: BondStatus
  ) => void;
  setSelectedBank: (id: string, bankName: IssuingBank) => void;
  setBidStatus: (id: string, status: BidSatatus) => void;
  resetForm: (id: string) => void;
  getTotalBidDetails: () => number;
};
