import { create } from 'zustand';
import { LgDetails } from '@/types/lg';

type UseIssueanceStore = {
  _id: UseIssueanceStore;
  data: LgDetails['data'];
  setValues: (values: Partial<LgDetails['data']> | null) => void;
};

const useLcIssuance = create<UseIssueanceStore>((set, get) => ({

  data: {
    draft: false,
    lgIssuance: '',
    _id: '',
    applicantDetails: undefined,
    beneficiaryDetails: undefined,
    lgDetailsType: 'Choose any other type of LGs',
    bidBond: undefined,
    advancePaymentBond: undefined,
    performanceBond: undefined,
    retentionMoneyBond: undefined,
    otherBond: undefined,
    issuingBank: undefined,
    beneficiaryBanksDetails: undefined,
    purpose: '',
    remarks: '',
    priceQuotes: '',
    expectedPrice: undefined,
    typeOfLg: 'Custom',
    issueLgWithStandardText: false,
    lgStandardText: '',
    physicalLg: false,
    physicalLgCountry: '',
    physicalLgBank: '',
    physicalLgSwiftCode: null,
    type: '',
    createdAt: '',
    updatedAt: '',
    __v: 0,
    
  },
  setValues: (values: Partial<LgDetails['data']> | null) =>
    set((state) => ({
      data: {
        ...state.data,
        ...(values ?? {}),
      },
    })),
}));

export const getStateValues = (state: UseIssueanceStore): Omit<UseIssueanceStore, 'setValues'> => {
  const { setValues, ...stateValues } = state;
  return stateValues;
};

export default useLcIssuance;
