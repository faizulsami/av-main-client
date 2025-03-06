import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BookingState {
  appointmentType: "Booking Call" | "Quick Call" | "Chat";
  mentorUsername: string | null;
  selectedTimeSlot: string | null;
  selectedDate: string | null;
  selectedDuration: number;
  showPlanDetails: boolean;
  validityTime: string;
  bookedSlots: string[];

  setSelectedTimeSlot: (time: string | null) => void;
  setSelectedDate: (date: string | null) => void;
  setShowPlanDetails: (show: boolean) => void;
  setDuration: (duration: number) => void;
  setMentorUsername: (userName: string) => void;
  setAppointmentType: (type: "Booking Call" | "Quick Call" | "Chat") => void;
  startCountdown: () => void;
  resetBooking: () => void;
  addBookedSlot: (slot: string) => void;
}

const initialState = {
  selectedTimeSlot: null,
  selectedDate: null,
  selectedDuration: 10,
  durationMinutes: 10,
  mentorUsername: null,
  showPlanDetails: false,
  appointmentType: "Booking Call" as const,
  validityTime: "24:00",
  bookedSlots: [],
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setSelectedTimeSlot: (time) => set({ selectedTimeSlot: time }),
      setSelectedDate: (date) => set({ selectedDate: date }),
      setShowPlanDetails: (show) => set({ showPlanDetails: show }),
      setDuration: (duration) => set({ selectedDuration: duration }),
      setMentorUsername: (userName) => set({ mentorUsername: userName }),
      setAppointmentType: (type) => set({ appointmentType: type }),

      // Add method to mark slots as booked
      addBookedSlot: (slot) =>
        set((state) => ({
          bookedSlots: [...state.bookedSlots, slot],
        })),

      startCountdown: () => {
        const countdownInterval = setInterval(() => {
          const [hours, minutes] = get().validityTime.split(":").map(Number);
          const totalMinutes = hours * 60 + minutes - 1;

          if (totalMinutes < 0) {
            clearInterval(countdownInterval);
            return;
          }

          const newHours = Math.floor(totalMinutes / 60);
          const newMinutes = totalMinutes % 60;

          set({
            validityTime: `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}`,
          });
        }, 60000);
      },

      resetBooking: () => set(initialState),
    }),
    {
      name: "booking-storage",
      partialize: (state) => ({
        selectedDuration: state.selectedDuration,
        appointmentType: state.appointmentType,
        validityTime: state.validityTime,
        bookedSlots: state.bookedSlots,
      }),
    },
  ),
);
