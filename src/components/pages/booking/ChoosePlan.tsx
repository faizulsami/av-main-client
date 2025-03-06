"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBookingStore } from "@/store/useBookingStore";
import { useBookingLogic } from "@/hooks/booking/useBookingLogic";
import { PlanField } from "./_components/PlanField";
import { formatDateToLocale } from "@/lib/date";
import type { AppointmentType, SessionConfig } from "@/types/booking";
import { BookingConfirmationDialog } from "./_components/ConfirmationDialog";

interface ChoosePlanProps {
  mentorUsername: string;
  sessionType: AppointmentType;
  sessionConfig: SessionConfig;
}

export default function ChoosePlan({
  mentorUsername,
  sessionType,
  sessionConfig,
}: ChoosePlanProps) {
  const {
    duration,
    isLoading,
    showConfirmDialog,
    setShowConfirmDialog,
    handleDurationChange,
    handleConfirmBooking,
    isBookingDisabled,
  } = useBookingLogic(mentorUsername, sessionType);

  const setMentorUsername = useBookingStore((state) => state.setMentorUsername);
  const selectedTimeSlot = useBookingStore((state) => state.selectedTimeSlot);
  const selectedDate = useBookingStore((state) => state.selectedDate);

  useEffect(() => {
    setMentorUsername(mentorUsername);
  }, [mentorUsername, setMentorUsername]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-lg font-semibold text-primary">
          Session Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4 items-end">
          {sessionConfig.requiresDuration && (
            <PlanField
              label="Duration"
              value={duration}
              onDurationChange={handleDurationChange}
              hasDropdown={true}
            />
          )}
          {sessionConfig.requiresTimeSlot && (
            <PlanField label="Time" value={selectedTimeSlot || "Select time"} />
          )}
          {sessionConfig.requiresDate && (
            <PlanField label="Date" value={formatDateToLocale(selectedDate)} />
          )}

          <Button
            className="w-full md:w-auto"
            onClick={() => setShowConfirmDialog(true)}
            disabled={isBookingDisabled}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                Processing...
              </span>
            ) : (
              `Book ${sessionType}`
            )}
          </Button>
        </div>

        <BookingConfirmationDialog
          isOpen={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          onConfirm={handleConfirmBooking}
          sessionType={sessionType}
          duration={duration}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
}
