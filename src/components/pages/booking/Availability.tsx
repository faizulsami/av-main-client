"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { DaySchedule, TimeRange } from "@/types/volunteer";
import { useBookingStore } from "@/store/useBookingStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useAppointments } from "@/hooks/useAppointments";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams } from "next/navigation";
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
    <>
      <div className="relative">
        <div className="flex items-center justify-center gap-4 px-6 py-1 border border-soft-paste-light-active rounded-lg text-sm">
          <span className="tracking-wide text-md">{slot.formatted}</span>
        </div>
      </div>
    </>
  );
};

function generateTimeSlots(
  startTime: TimeRange,
  endTime: TimeRange,
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  let currentStart = startTime.hours * 60 + startTime.minutes;
  if (startTime.hours < 9) {
    startTime.hours = startTime.hours + 12;
  }
  if (endTime.hours < 9) {
    endTime.hours = endTime.hours + 12;
  }
  const endMinutes = endTime.hours * 60 + endTime.minutes;

  while (currentStart < endMinutes) {
    const currentEnd = currentStart + 30;

    // Format start time
    const startHours = Math.floor(currentStart / 60);
    const startMins = currentStart % 60;
    const formattedStart = `${String(startHours).padStart(2, "0")} : ${String(startMins).padStart(2, "0")}`;

    // Format end time
    const endHours = Math.floor(currentEnd / 60);
    const endMins = currentEnd % 60;
    const formattedEnd = `${String(endHours).padStart(2, "0")} : ${String(endMins).padStart(2, "0")}`;

    slots.push({
      start: { hours: startHours, minutes: startMins },
      end: { hours: endHours, minutes: endMins },
      formatted: `${formattedStart}`,
    });

    currentStart += 30;
  }

  return slots;
}

type SelectedTimeSlot = {
  formatted: string;
  day: string;
  available: boolean;
};

export default function Availability({ schedule }: AvailabilityProps) {
  const { toast } = useToast();
  const [currentDaySchedule, setCurrentDaySchedule] =
    useState<DaySchedule | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<SelectedTimeSlot | null>(
    null,
  );
  const [isSelected, setIsSelected] = useState(false);
  const query = useSearchParams();
  const mentorUserName = query.get("mentor");
  console.log({ mentorUserName });
  const {
    selectedTimeSlot,
    setSelectedTimeSlot,
    bookedSlots,
    setSelectedDate,
  } = useBookingStore();
  const { appointments } = useAppointments();

  // Filter Booking Call appointments and extract their time slots
  const bookedCallSlots = appointments
    .filter(
      (appointment) =>
        appointment.appointmentType === "Booking Call" &&
        appointment.mentorUserName === mentorUserName,
    )
    .flatMap(
      (appointment) => appointment.selectedSlot?.map((slot) => slot.time) || [],
    );

  // Combine Zustand bookedSlots with appointments' booked slots
  const allBookedSlots = [...bookedSlots, ...bookedCallSlots];

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

  return (
    <div className="w-full mx-auto space-y-4">
      <ScrollArea className="h-60">
        <div className="space-y-4">
          {schedule && schedule.length > 0 ? (
            schedule.map((daySchedule, index) => {
              const slots = generateTimeSlots(
                daySchedule.startTime,
                daySchedule.endTime,
              );

              const isTodayUnavailable = (day: string) => {
                const today = new Date();
                return (
                  today.getHours() > 17 && daysOfWeek[today.getDay()] === day
                );
              };

              return (
                <div key={index} className="grid grid-cols-9 pr-2">
                  <h4 className=" col-span-3 text-lg font-semibold uppercase">
                    {daySchedule.day}
                  </h4>

                  <div className="col-span-3">
                    <Select
                      onValueChange={(value: string) => {
                        const isAvailable = !allBookedSlots.find(
                          (item) => item === value,
                        );
                        setSelectedSlot({
                          day: daySchedule.day,
                          formatted: value,
                          available: isAvailable,
                        });
                        if (isAvailable) setSelectedDate(value);
                      }}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue
                          placeholder={`${daySchedule.startTime.hours < 12 && daySchedule.startTime.hours > 5 ? daySchedule.startTime.hours : daySchedule.startTime.hours - 12} ${daySchedule.startTime.hours < 12 && daySchedule.startTime.hours > 5 ? "am" : "pm"} - ${daySchedule.endTime.hours < 12 && daySchedule.endTime.hours > 5 ? daySchedule.endTime.hours : daySchedule.endTime.hours - 12} ${daySchedule.endTime.hours < 12 && daySchedule.endTime.hours > 5 ? "am" : "pm"}`}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {slots.map((slot, index) => {
                            const formatTime = (time: string) => {
                              const [hours, minutes] = time
                                .split(":")
                                .map(Number);
                              const period =
                                hours < 12 && hours > 5 ? "am" : "pm";
                              const formattedHours =
                                hours > 12 || hours <= 5
                                  ? (hours - 12).toString().padStart(2, "0")
                                  : hours.toString();

                              return `${formattedHours} : ${minutes.toString().padStart(2, "0")} ${period}`;
                            };
                            return (
                              <>
                                <SelectItem
                                  key={index}
                                  value={formatTime(slot.formatted)}
                                >
                                  {formatTime(slot.formatted)}
                                </SelectItem>
                              </>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between gap-2 col-span-3">
                    <Badge
                      className={`px-2 py-1  rounded-md text-white font-semibold ${
                        (!selectedSlot?.available &&
                          selectedSlot?.day === daySchedule.day) ||
                        !daySchedule.isAvailable ||
                        isTodayUnavailable(daySchedule.day)
                          ? "bg-gray-400"
                          : "bg-[#34D399]"
                      }`}
                    >
                      <span className="text-sm text-center w-full font-medium">
                        {(!selectedSlot?.available &&
                          selectedSlot?.day === daySchedule.day) ||
                        !daySchedule.isAvailable ||
                        isTodayUnavailable(daySchedule.day)
                          ? "Unavailable"
                          : "Available"}
                      </span>
                    </Badge>
                    <input
                      type="checkbox"
                      checked={
                        !(
                          !selectedSlot?.available &&
                          selectedSlot?.day === daySchedule.day
                        ) && isSelected
                      }
                      onChange={() => {
                        if (!!selectedSlot) {
                          const isSelected =
                            selectedSlot?.day === daySchedule.day &&
                            daySchedule.isAvailable;
                          setIsSelected(isSelected);
                          handleSlotSelect({
                            start: daySchedule.startTime,
                            end: daySchedule.endTime,
                            formatted: selectedSlot?.formatted || "",
                          });
                        }
                      }}
                      disabled={
                        !daySchedule.isAvailable ||
                        isTodayUnavailable(daySchedule.day)
                      }
                      className={`w-5 h-5 rounded-none border-gray-300 text-soft-paste-active
          focus:ring-soft-paste-active cursor-pointer
          checked:bg-soft-paste-active checked:border-soft-paste-active
          ${!daySchedule.isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 text-xs">
              No time slots available for today.
            </p>
          )}

          {/* {currentDaySchedule ? (
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
          )} */}
        </div>
      </ScrollArea>
    </div>
  );
}
