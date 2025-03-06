import { TimeSlot } from "./booking";

export interface TimeRange {
  hours: number;
  minutes: number;
}

export interface DaySchedule {
  day: string;
  isAvailable: boolean;
  startTime: TimeRange;
  endTime: TimeRange;
}

export interface Volunteer {
  id: string;
  name: string;
  userName: string;
  title: string;
  gender: string;
  profileImage: string;
  yearsExperience: number;
  bookingsCompleted: number;
  expertise: { name: string }[];
  description: string;
  date: string;
  timeSlots: TimeSlot[];
  scheduleId: {
    id: string;
    userName: string;
    createdAt: string;
    schedule: DaySchedule[];
  };
  rating: number;
  sessionsCompleted: number;
  isOnline: boolean;
  adminApproval: boolean;
}
