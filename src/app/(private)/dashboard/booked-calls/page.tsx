"use client";

import {
  Appointment,
  AppointmentResponse,
  useAppointments,
} from "@/hooks/useAppointments";
import { AppointmentService } from "@/services/appointment.service";
import { AppointmentSection } from "./_components/AppointmentSection";
import { AppointmentSectionSkeleton } from "./_components/AppointmentSectionSkeleton";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";

export default function BookedCallsPage() {
  const { user: currentUser } = useAuth();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [meta, setMeta] = useState<AppointmentResponse["meta"]>({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        const response = await AppointmentService.getAppointments({
          appointmentType: "Booking Call",
          mentorUserName: currentUser?.userName,
        });
        const appointmentData = response.data as AppointmentResponse;
        setAppointments(appointmentData.data);
        setMeta(appointmentData.meta);

        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to fetch appointments"),
        );
      } finally {
        setIsLoading(false);
      }
    };
    if (currentUser?.userName) fetchAppointments();
  }, [currentUser?.userName, refetch]);

  const bookingCallAppointments = appointments.filter(
    (appointment) =>
      appointment.appointmentType === "Booking Call" &&
      appointment.mentorUserName === currentUser?.userName,
  );

  const appointmentsByStatus = {
    pending: bookingCallAppointments.filter(
      (appointment) => appointment.status === "pending",
    ),
    confirmed: bookingCallAppointments.filter(
      (appointment) => appointment.status === "confirmed",
    ),
    completed: bookingCallAppointments.filter(
      (appointment) => appointment.status === "completed",
    ),
    cancelled: bookingCallAppointments.filter(
      (appointment) => appointment.status === "cancelled",
    ),
  };

  console.log("Appointments - BookedCallsPage", appointments);
  console.log("Appointments by status - BookedCallsPage", appointmentsByStatus);

  const handleAccept = async (appointmentId: string) => {
    await AppointmentService.updateAppointment(appointmentId, {
      status: "confirmed",
    });
    setRefetch(!refetch);
  };

  const handleReject = async (appointmentId: string) => {
    await AppointmentService.updateAppointment(appointmentId, {
      status: "cancelled",
    });
    setRefetch(!refetch);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <AppointmentSectionSkeleton />
        <AppointmentSectionSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AppointmentSection
        title="User Request"
        description="Pending call requests from users"
        appointments={appointmentsByStatus.pending}
        appointmentType="Booking Call"
        onAccept={handleAccept}
        onReject={handleReject}
        emptyMessage="No pending requests"
      />

      <AppointmentSection
        title="Confirmed User"
        description="List of confirmed and running calls"
        appointments={appointmentsByStatus.confirmed}
        appointmentType="Booking Call"
        emptyMessage="No confirmed bookings"
      />
      {/* 
      <AppointmentSection
        title="Completed Calls"
        description="List of completed calls"
        appointments={appointmentsByStatus.completed}
        emptyMessage="No completed bookings"
      />

      <AppointmentSection
        title="Cancelled Calls"
        description="List of cancelled calls"
        appointments={appointmentsByStatus.cancelled}
        emptyMessage="No cancelled bookings"
      /> */}
    </div>
  );
}
