"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { DaySchedule, TimeRange } from "@/types/volunteer";
import { useBookingStore } from "@/store/useBookingStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useAppointments } from "@/hooks/useAppointments";

interface AvailabilityProps {
  schedule: DaySchedule[];
}

interface TimeSlot {
  start: { hours: number; minutes: number };
  end: { hours: number; minutes: number };
  formatted: string;
}

const daysOfWeek = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const TimeSlotItem = ({
  slot,
  onSelect,
  isSelected,
  isBooked,
}: {
  slot: TimeSlot;
  onSelect: () => void;
  isSelected: boolean;
  isBooked: boolean;
}) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="relative">
        <div className="flex items-center justify-center gap-4 px-6 py-1 border border-soft-paste-light-active rounded-lg text-sm">
          <span className="tracking-wide text-md">{slot.formatted}</span>
        </div>
      </div>

      <Badge
        className={`px-4 py-1 min-w-32 rounded-md text-white font-semibold ${
          isBooked ? "bg-gray-400" : "bg-[#34D399]"
        }`}
      >
        <span className="text-sm text-center w-full font-medium">
          {isBooked ? "Unavailable" : "Available"}
        </span>
      </Badge>

      <input
        type="checkbox"
        checked={isSelected}
        onChange={onSelect}
        disabled={isBooked}
        className={`w-5 h-5 rounded-none border-gray-300 text-soft-paste-active
          focus:ring-soft-paste-active cursor-pointer
          checked:bg-soft-paste-active checked:border-soft-paste-active
          ${isBooked ? "opacity-50 cursor-not-allowed" : ""}`}
      />
    </div>
  );
};

function generateTimeSlots(
  startTime: TimeRange,
  endTime: TimeRange,
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  let currentStart = startTime.hours * 60 + startTime.minutes;
  const endMinutes = endTime.hours * 60 + endTime.minutes;

  while (currentStart < endMinutes) {
    const currentEnd = currentStart + 30;

    // Format start time
    const startHours = Math.floor(currentStart / 60);
    const startMins = currentStart % 60;
    const formattedStart = `${String(startHours).padStart(2, "0")}:${String(startMins).padStart(2, "0")}`;

    // Format end time
    const endHours = Math.floor(currentEnd / 60);
    const endMins = currentEnd % 60;
    const formattedEnd = `${String(endHours).padStart(2, "0")}:${String(endMins).padStart(2, "0")}`;

    slots.push({
      start: { hours: startHours, minutes: startMins },
      end: { hours: endHours, minutes: endMins },
      formatted: `${formattedStart} - ${formattedEnd}`,
    });

    currentStart += 30;
  }

  return slots;
}

export default function Availability({ schedule }: AvailabilityProps) {
  const { toast } = useToast();
  const [currentDaySchedule, setCurrentDaySchedule] =
    useState<DaySchedule | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const {
    selectedTimeSlot,
    setSelectedTimeSlot,
    bookedSlots,
    setSelectedDate,
  } = useBookingStore();
  const { appointments } = useAppointments();
  console.log("Schedule", schedule);

  // Filter Booking Call appointments and extract their time slots
  const bookedCallSlots = appointments
    .filter((appointment) => appointment.appointmentType === "Booking Call")
    .flatMap(
      (appointment) => appointment.selectedSlot?.map((slot) => slot.time) || [],
    );

  // Combine Zustand bookedSlots with appointments' booked slots
  const allBookedSlots = [...bookedSlots, ...bookedCallSlots];

  useEffect(() => {
    const today = new Date();
    const currentDay = daysOfWeek[today.getDay()];
    const todaySchedule = schedule?.find(
      (day) => day.day.toLowerCase() === currentDay,
    );
    setCurrentDaySchedule(todaySchedule || null);

    if (todaySchedule && todaySchedule.isAvailable) {
      const slots = generateTimeSlots(
        todaySchedule.startTime,
        todaySchedule.endTime,
      );
      setAvailableSlots(slots);
    } else {
      setAvailableSlots([]);
    }
  }, [schedule]);

  const handleSlotSelect = (slot: TimeSlot) => {
    if (!bookedSlots.includes(slot.formatted)) {
      setSelectedTimeSlot(slot.formatted);
      setSelectedDate(new Date().toISOString());
    } else {
      toast({
        title: "Slot Unavailable",
        description: "This slot is already booked.",
        variant: "destructive",
      });
    }
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="w-full mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-soft-paste text-lg font-normal">Availability</h2>
      </div>

      <Separator className="bg-soft-paste" />

      <ScrollArea className="h-60">
        <div className="space-y-4">
          {currentDaySchedule ? (
            availableSlots.map((slot, index) => {
              const isBooked = allBookedSlots.includes(slot.formatted);
              return (
                <TimeSlotItem
                  key={index}
                  slot={slot}
                  onSelect={() => handleSlotSelect(slot)}
                  isSelected={selectedTimeSlot === slot.formatted}
                  isBooked={isBooked}
                />
              );
            })
          ) : (
            <p className="text-center text-gray-500 text-xs">
              No time slots available for today.
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
