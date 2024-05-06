import { RegisterStore, UseRegisterStore } from '@/types/type';
import {create} from 'zustand';


type StateValues = Omit<UseRegisterStore, 'setValues'>;

const useRegisterStore = create<UseRegisterStore>((set, get) => ({
    role: '',
    name: '',
    email: '',
    address: '',
    constitution: '',
    businessType: '',
    phone: '',
    bank: '',
    swiftCode: '',
    accountNumber: undefined,
    accountHolderName: '',
    accountCountry: '',
    accountCity: '',
    productInfo: {
        product: '',
        annualSalary: 0,
        annualValueExports: 0,
        annualValueImports: 0,
    },
    pocEmail: '',
    pocPhone: '',
    pocName: '',
    poc: '',
    pocDesignation: '',
    currentBanks: [],
    confirmationLcs: false,
    discountingLcs: false,
    guaranteesCounterGuarantees: false,
    discountingAvalizedBills: false,
    avalizationExportBills: false,
    riskParticipation: false,
    setValues: (values: Partial<RegisterStore>) => set((state) => ({ ...state, ...values })),
}));
export const getStateValues = (state: UseRegisterStore): StateValues => {
    const { setValues, ...stateValues } = state;
    return stateValues;
};
export default useRegisterStore;