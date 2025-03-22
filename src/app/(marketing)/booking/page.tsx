"use client";

import Loading from "@/app/loading";
import BookingDetailsCard from "@/components/pages/booking/BookingDetailsCard";
import ChoosePlan from "@/components/pages/booking/ChoosePlan";
import useApprovedVolunteers from "@/hooks/useApprovedVolunteers";

import { AppointmentType, SESSION_CONFIG } from "@/types/booking";
import { Volunteer } from "@/types/volunteer";
import { useSearchParams } from "next/navigation";

const DEFAULT_SESSION_TYPE: AppointmentType = "Booking Call";

export default function Booking() {
  const { approvedVolunteers, loading } = useApprovedVolunteers<Volunteer[]>();
  const searchParams = useSearchParams();
  const mentorUserName = searchParams.get("mentor") || "";

  // Get the session type with a fallback
  const rawType = searchParams.get("type") || "";
  const sessionType = Object.keys(SESSION_CONFIG).includes(rawType)
    ? (rawType as AppointmentType)
    : DEFAULT_SESSION_TYPE;

  const sessionConfig = SESSION_CONFIG[sessionType];

  if (loading) return <Loading />;

  // Filter only adminApproved volunteers

  const selectedVolunteer = approvedVolunteers.find(
    (volunteer) => volunteer.userName === mentorUserName,
  );

  return (
    <div className="max-w-4xl w-full mx-auto mt-4 px-2 gap-4 flex flex-col py-10">
      {selectedVolunteer && (
        <BookingDetailsCard
          {...selectedVolunteer}
          showAvailability={sessionConfig?.requiresTimeSlot ?? true}
        />
      )}

      <ChoosePlan
        mentorUsername={mentorUserName}
        sessionType={sessionType}
        sessionConfig={sessionConfig}
      />
    </div>
  );
}
