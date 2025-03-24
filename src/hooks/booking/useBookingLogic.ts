import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/store/useBookingStore";
import { useBookSession } from "@/hooks/useBookSession";
import { AppointmentType } from "@/types/booking";
import { get_socket } from "@/utils/get-socket";
import api from "@/config/axios.config";

export const useBookingLogic = (
  mentorUsername: string,
  sessionType: AppointmentType,
) => {
  const router = useRouter();
  const bookingStore = useBookingStore();
  const setMentorUsername = useBookingStore((state) => state.setMentorUsername);
  const setAppointmentType = useBookingStore(
    (state) => state.setAppointmentType,
  );
  const { bookSession, isLoading } = useBookSession();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    setMentorUsername(mentorUsername);
    setAppointmentType(
      sessionType === "Booking Call"
        ? "Booking Call"
        : sessionType === "Quick Call"
          ? "Quick Call"
          : "Chat",
    );
  }, [mentorUsername, sessionType, setMentorUsername, setAppointmentType]);

  const handleDurationChange = (value: number) => {
    bookingStore.setDuration(value);
  };

  const handleConfirmBooking = async (username: string, type: string) => {
    const response = await bookSession();

    if (response?.data?.data._id) {
      setShowConfirmDialog(false);
      bookingStore.resetBooking();
      router.push(`/booking/confirmation?id=${response.data.data._id}`);

      const socket = get_socket();

      if (type !== "Booking Call") {
        await api.post("/api/v1/notifications/create-notification", {
          receiver: "listener",
          type: `${type}_request`,
          listenerUsername: username,
          content: `A new chat request has been created by ${response?.data?.data?.menteeUserName}.`,
          isSeen: false,
        });
        socket.emit("notification", {
          receiver: "listener",
          receiver_username: username,
          type: `${type}_request`,
          content: `A new ${type} request has been created by ${response?.data?.data?.menteeUserName}.`,
        });
      }
    }
  };

  const isBookingDisabled = useMemo(() => {
    if (!bookingStore.mentorUsername) return true;

    return sessionType === "Booking Call"
      ? !bookingStore.selectedTimeSlot || !bookingStore.selectedDate
      : false;
  }, [
    sessionType,
    bookingStore.mentorUsername,
    bookingStore.selectedTimeSlot,
    bookingStore.selectedDate,
  ]);

  return {
    duration: bookingStore.selectedDuration,
    isLoading,
    showConfirmDialog,
    setShowConfirmDialog,
    handleDurationChange,
    handleConfirmBooking,
    isBookingDisabled,
  };
};
