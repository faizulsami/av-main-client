import { Appointment } from "@/types/appointment.types";

export const getContactsByRole = (
  appointments: Appointment[],
  currentUserRole: string,
  currentUserName: string,
) => {
  const confirmedAppointments = appointments.filter(
    (appointment) => appointment.status === "confirmed",
  );

  if (currentUserRole === "mentee") {
    return confirmedAppointments
      .filter((appointment) => appointment.menteeUserName === currentUserName)
      .map((appointment) => ({
        id: appointment._id,
        username: appointment.mentorUserName,
        avatar: "/images/avatar/male-avatar.png",
        lastMessage: "",
        duration: appointment.durationMinutes ?? 10,
        type: appointment.appointmentType,
        selectedSlot: appointment.selectedSlot,
      }));
  }

  return confirmedAppointments.map((appointment) => ({
    id: appointment._id,
    username: appointment.menteeUserName,
    avatar: "/images/avatar/male-avatar.png",
    lastMessage: "",
    duration: appointment.durationMinutes ?? 10,
    type: appointment.appointmentType,
    selectedSlot: appointment.selectedSlot,
  }));
};
