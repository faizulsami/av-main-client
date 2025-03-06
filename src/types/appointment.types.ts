export interface AppointmentSlot {
  time: string;
  isAvailable: boolean;
  _id: string;
}

export interface AppointmentSchedule {
  day: string;
  isAvailable: boolean;
  startTime: {
    hours: number;
    minutes: number;
  };
  endTime: {
    hours: number;
    minutes: number;
  };
}

export interface Appointment {
  _id: string;
  appointmentType: string;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "running";
  durationMinutes: number;
  selectedSlot: AppointmentSlot[];
  mentorUserName: string;
  menteeUserName: string;
  createdAt: string;
  updatedAt: string;
  scheduleSlot?: {
    id: string;
    userName: string;
    createdAt: string;
    schedule: AppointmentSchedule[];
  };
}
