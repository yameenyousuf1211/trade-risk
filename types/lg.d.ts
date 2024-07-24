import { UseFormRegister, UseFormWatch } from 'react-hook-form';

export interface LgStepsProps1 {
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  setStepCompleted: (index: number, status: boolean) => void;
}

export interface LgStepsProps2 {
    register: UseFormRegister<any>;
    data: string[];
    flags: string[];
    setValue: UseFormSetValue<any>;
    setStepCompleted: (index: number, status: boolean) => void;
    watch: UseFormWatch<any>;
}

export interface LgStepsProps3 {
    register: UseFormRegister<any>;
    data?: string[];
    flags?: string[];
    setValue: UseFormSetValue<any>;
    setStepCompleted: (index: number, status: boolean) => void;
    watch: UseFormWatch<any>;
}
export interface LgStepsProps5 {
    register: UseFormRegister<any>;
    watch: UseFormWatch<any>;
    setStepCompleted: (index: number, status: boolean) => void;
    setValue: UseFormSetValue<any>;
    name?: string;
    listValue?:string
    currency?:string[]
}

export interface LgStepsProps10 {
    register: UseFormRegister<any>;
    watch: UseFormWatch<any>;
    setStepCompleted: (index: number, status: boolean) => void;
    setValue: UseFormSetValue<any>;
}