import { create } from "zustand";

type StepState = {
  stepStatus: boolean[] | null[]; // Allow for boolean or null values
  setStepStatus: (index: number | null, status: boolean | null) => void;
};

const useStepStore = create<StepState>((set) => ({
  stepStatus: Array(7).fill(false), // Initialize with 7 steps, all set to false (not completed)
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
}));

export default useStepStore;
