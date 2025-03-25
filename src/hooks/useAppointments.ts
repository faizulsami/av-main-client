import { useState, useEffect } from "react";
import {
  AppointmentFilters,
  AppointmentService,
} from "@/services/appointment.service";

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "running";

export interface AppointmentSlot {
  time: string;
  isAvailable: boolean;
  _id: string;
}

export interface Appointment {
  _id: string;
  appointmentType: string;
  status: AppointmentStatus;
  selectedSlot: AppointmentSlot[];
  mentorUserName: string;
  menteeUserName: string;
  createdAt: string;
  updatedAt: string;
  id: string;
  scheduleSlot: {
    id: string;
    userName: string;
    createdAt: string;
    schedule: {
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
    }[];
  };
  durationMinutes: number;
}

export interface AppointmentResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: Appointment[];
}

export interface UseAppointmentsReturn {
  appointments: Appointment[];
  isLoading: boolean;
  error: Error | null;
  meta: AppointmentResponse["meta"];
  refetch: () => Promise<void>;
}

export function useAppointments(
  filters?: AppointmentFilters,
): UseAppointmentsReturn {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [meta, setMeta] = useState<AppointmentResponse["meta"]>({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const response = await AppointmentService.getAppointments(filters);
      const appointmentData = response.data as AppointmentResponse;
      setAppointments(appointmentData.data);
      setMeta(appointmentData.meta);

      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch appointments"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return {
    appointments,
    isLoading,
    error,
    meta,
    refetch: fetchAppointments,
  };
}
