import { create } from "zustand";

type StepState = {
  isSubmitted: boolean;
  stepStatus: string[]; // Allow for boolean or null values
  setStepStatus: (index: number | null, status: boolean | null) => void;
  addStep: (step: string) => void;
  removeStep: (step: string) => void;
  submit: () => void;
  resetSubmit: () => void;
};

const useStepStore = create<StepState>((set) => ({
  isSubmitted: false,
  stepStatus: [], // Initialize with 7 steps, all set to false (not completed)
  setStepStatus: (index: number | null, status: boolean | null) =>
    set((state) => {
      let newStepStatus;

      if (index === null && status === true) {
        // Set all steps to true
        newStepStatus = Array(7).fill(true);
      } else if (index === null && status === null) {
        // Reset all steps to null
        newStepStatus = Array(7).fill(null);
      } else if (index !== null) {
        // Set specific step status
        newStepStatus = [...state.stepStatus];
        newStepStatus[index] = status;
      } else {
        // In case neither of the conditions match, return the current state
        return state;
      }

      return { ...state, stepStatus: newStepStatus };
    }),
  addStep: (step: string) =>
    set((state) => {
      const isStepAdded = state?.stepStatus?.find((e) => e === step);
      if (isStepAdded) return state;

      return { ...state, stepStatus: [...state?.stepStatus, step] };
    }),
  removeStep: (step: string) =>
    set((state) => {
      const isStepAdded = state?.stepStatus?.find((e) => e === step);
      if (!isStepAdded) return state;

      const removedSteps = state?.stepStatus?.filter((e) => e !== step);

      return { ...state, stepStatus: removedSteps };
    }),
  submit: () =>
    set((state) => ({
      ...state,
      isSubmitted: true,
    })),
  resetSubmit: () =>
    set((state) => ({
      ...state,
      isSubmitted: false,
    })),
}));

export default useStepStore;
