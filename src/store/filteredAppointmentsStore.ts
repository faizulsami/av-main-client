import { create } from "zustand";
import { ChatContact } from "@/types/chat.types";

interface FilteredAppointmentsStore {
  filteredAppointments: ChatContact[];
  setFilteredAppointments: (appointments: ChatContact[]) => void;
}

export const useFilteredAppointmentsStore = create<FilteredAppointmentsStore>(
  (set) => ({
    filteredAppointments: [],
    setFilteredAppointments: (appointments) =>
      set({ filteredAppointments: appointments }),
  }),
);
