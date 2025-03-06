import { Appointment } from "@/types/appointment.types";

export const getFilteredAppointments = (
  appointments: Appointment[],
  username: string | null,
  role: "mentor" | "mentee" | "admin",
  appointmentType?: string,
): Appointment[] => {
  if (!username || !role) return [];

  return appointments.filter((appointment) => {
    // Match by role and username
    const isMatchedByRole =
      (role === "mentor" && appointment.mentorUserName === username) ||
      (role === "mentee" && appointment.menteeUserName === username);

    // Match by appointment type (if provided)
    const isMatchedByType =
      !appointmentType || appointment.appointmentType === appointmentType;

    // Only include confirmed appointments
    const isConfirmed = appointment.status === "confirmed";

    return isMatchedByRole && isMatchedByType && isConfirmed;
  });
};
