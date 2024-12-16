import { create } from 'zustand';
import { Step1Schema } from '../validation/auth';
import { z } from 'zod';

type Step1Data = z.infer<typeof Step1Schema>;

interface SignupState {
  step1Data: Step1Data | null;
  setStep1Data: (data: Step1Data) => void;
  clearData: () => void;
}

export const useSignupStore = create<SignupState>((set) => ({
  step1Data: null,
  setStep1Data: (data) => set({ step1Data: data }),
  clearData: () => set({ step1Data: null }),
}));