interface Bank {
  bank: string;
  country: string;
}

interface LcPeriod {
  startDate: any;
  endDate: any;
  expectedDate?: boolean;
}

interface ShipmentPort {
  country: string;
  port: string;
}

interface ImporterInfo {
  applicantName: string;
  countryOfImport: string;
}

type TransactionData = {
  participantRole: "exporter" | "importer";
  amount: string;
  paymentTerms: "sight-lc" | "usance-lc" | "deferred-lc" | "upas-lc";
  currency: string;
  issuingBank: Bank;
  advisingBank: Bank;
  confirmingBank: Bank;
  lcPeriod: LcPeriod;
  shipmentPort: ShipmentPort;
  transhipment: "yes" | "no";
  importerInfo: ImporterInfo;
  productDescription: string;
  extraInfo:
    | "shipment"
    | "upas"
    | "acceptance"
    | "negotiation"
    | "invoice"
    | "sight"
    | "others";
};

interface LcConfirmation extends TransactionData {
  _id: string;
  expectedConfirmationDate: any;
  exporterInfo: {
    beneficiaryName: string;
    countryOfExport: string;
    beneficiaryCountry: string;
  };
  confirmationInfo: {
    behalfOf: string;
    pricePerAnnum: string;
    advisingBank: string;
  };
}

export type UseConfirmationStore = LcConfirmation & {
  setValues: (values: Partial<LcConfirmation>) => void;
};

interface LcDiscounting extends TransactionData {
  _id: string;
  expectedDiscountingDate: any;
  exporterInfo: {
    beneficiaryName: string;
    countryOfExport: string;
    beneficiaryCountry: string;
  };
  discountingInfo: {
    discountAtSight: string;
    behalfOf: string;
    pricePerAnnum: string;
  };
}

export type UseDiscountingStore = LcDiscounting & {
  setValues: (values: Partial<LcDiscounting>) => void;
};

interface LcConfrimationDiscounting extends TransactionData {
  _id: string;
  expectedConfirmationDate: any;
  exporterInfo: {
    beneficiaryName: string;
    countryOfExport: string;
    beneficiaryCountry: string;
    bank: string;
  };
  confirmationInfo: {
    behalfOf: string;
    pricePerAnnum: string;
  };
  discountingInfo: {
    discountAtSight: string;
    behalfOf: string;
    pricePerAnnum: string;
  };
}

export type UseConfrimationDiscountingStore = LcConfrimationDiscounting & {
  setValues: (values: Partial<LcConfrimationDiscounting>) => void;
};
