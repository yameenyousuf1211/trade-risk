import {create} from 'zustand';

type BreadCrumbsTypeStore = {
    value: string;
    setValue: (newValue: string) => void;
};

const useBreadCrumbsTypeStore = create<BreadCrumbsTypeStore>((set) => ({
    value: '',
    setValue: (newValue) => set({ value: newValue }),
}));

export default useBreadCrumbsTypeStore;