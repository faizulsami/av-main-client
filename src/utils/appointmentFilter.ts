import { Appointment } from "@/types/appointment.types";

export const getFilteredAppointments = (
  appointments: Appointment[],
): Appointment[] => {
  return appointments.filter((appointment) => {
    // Match by role and username

    // Match by appointment type (if provided)
    const isMatchedByType =
      appointment.appointmentType === "Quick Call" ||
      appointment.appointmentType === "Chat";

    return isMatchedByType;
  });
};
