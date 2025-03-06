import { create } from "zustand";

interface MentorStore {
  isOnline: boolean;
  setIsOnline: (isOnline: boolean) => void;
}

export const useMentorStore = create<MentorStore>((set) => ({
  isOnline: false,
  setIsOnline: (isOnline: boolean) => set({ isOnline }),
}));
