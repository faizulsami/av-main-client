/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { DaySchedule } from "@/types/volunteer";
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

const daysOfWeek = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

type TimeRange = { hours: number; minutes: number };
type TimeSlot = {
  start: TimeRange;
  end: TimeRange;
  formatted: string;
};

function format12Hour(hours: number, minutes: number): string {
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  const paddedMinutes = String(minutes).padStart(2, "0");
  return `${hour12}:${paddedMinutes} ${suffix}`;
}

function generateTimeSlots(
  startTime: TimeRange,
  endTime: TimeRange,
): TimeSlot[] {
  const slots: TimeSlot[] = [];

  let currentStart = startTime.hours * 60 + startTime.minutes;
  let end = endTime.hours * 60 + endTime.minutes;

  // Handle overnight range (e.g., 14:00 to 02:00 next day)
  if (end <= currentStart) {
    end += 24 * 60;
  }

  while (currentStart < end) {
    const currentEnd = currentStart + 30;

    const startHours = Math.floor(currentStart / 60) % 24;
    const startMins = currentStart % 60;
    const endHours = Math.floor(currentEnd / 60) % 24;
    const endMins = currentEnd % 60;

    slots.push({
      start: { hours: startHours, minutes: startMins },
      end: { hours: endHours, minutes: endMins },
      formatted: `${format12Hour(startHours, startMins)} - ${format12Hour(endHours, endMins)}`,
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

  const [selectedSlot, setSelectedSlot] = useState<SelectedTimeSlot | null>(
    null,
  );
  const [selectData, setSelectData] = useState({
    day: "",
    slot: "",
  });
  const [isSelected, setIsSelected] = useState({ day: "", selected: false });
  const query = useSearchParams();
  const mentorUserName = query.get("mentor");

  const { setSelectedTimeSlot, bookedSlots, setSelectedDate } =
    useBookingStore();

  const { appointments } = useAppointments({
    mentorUserName: mentorUserName!,
    appointmentType: "Booking Call",
    not: "completed",
    limit: 10000,
  });

  // Filter Booking Call appointments and extract their time slots
  const bookedCallSlots = appointments.flatMap(
    (appointment) => appointment.selectedSlot?.map((slot) => slot.time) || [],
  );

  // Combine Zustand bookedSlots with appointments' booked slots
  const allBookedSlots = [...bookedSlots, ...bookedCallSlots];

  const handleSlotSelect = (slot: TimeSlot | null) => {
    if (!slot) {
      setSelectedTimeSlot(null);
      return;
    }
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
                <div key={index} className="grid grid-cols-9 pr-2 items-center">
                  <h4
                    className={`${selectedSlot?.day === daySchedule.day ? "text-[#9E8CDD] " : ""} text-sm  col-span-2 font-semibold uppercase`}
                  >
                    {daySchedule.day}
                  </h4>

                  <div className={`col-span-4 `}>
                    <Select
                      value={
                        daySchedule.day === selectData.day
                          ? selectData.slot
                          : ""
                      }
                      onValueChange={(value: string) => {
                        const isAvailable = !allBookedSlots.find(
                          (item) => item === value,
                        );

                        setSelectData({ day: daySchedule.day, slot: value });

                        setIsSelected({
                          day: daySchedule.day,
                          selected: false,
                        });
                        handleSlotSelect(null);
                        setSelectedSlot({
                          day: daySchedule.day,
                          formatted: value,
                          available: isAvailable,
                        });
                        if (isAvailable) setSelectedDate(value);
                      }}
                    >
                      <SelectTrigger className="mx-auto w-[70%] md:w-[80%]">
                        <SelectValue
                          placeholder={`
  ${
    daySchedule.startTime.hours % 12 === 0
      ? 12
      : daySchedule.startTime.hours % 12
  } ${daySchedule.startTime.hours >= 12 ? "pm" : "am"} - ${
    daySchedule.endTime.hours % 12 === 0 ? 12 : daySchedule.endTime.hours % 12
  } ${daySchedule.endTime.hours >= 12 ? "pm" : "am"}
`}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {slots.map((slot, index) => {
                            const formatTime = (time: any) => {
                              const { hours, minutes } = time;
                              const period = hours >= 12 ? "pm" : "am";
                              const hour12 =
                                hours === 0
                                  ? 12
                                  : hours > 12
                                    ? hours - 12
                                    : hours;

                              return `${hour12?.toString()?.padStart(2, "0")} : ${minutes?.toString()?.padStart(2, "0")} ${period}`;
                            };
                            return (
                              <>
                                <SelectItem
                                  key={index}
                                  value={`${daySchedule.day} ${formatTime(slot.start)}`}
                                >
                                  {formatTime(slot.start)}
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
                        selectedSlot?.day === daySchedule.day &&
                        isSelected.selected &&
                        daySchedule?.day === isSelected.day &&
                        selectedSlot?.available
                      }
                      onChange={() => {
                        if (!!selectedSlot) {
                          if (!selectedSlot?.available) {
                            toast({
                              title: "Slot is not available",
                              variant: "destructive",
                            });
                            return;
                          }
                          if (selectedSlot?.day !== daySchedule.day) {
                            toast({
                              title: "please try for selected day",
                              variant: "destructive",
                            });
                            return;
                          }

                          const selected =
                            selectedSlot?.day === daySchedule.day &&
                            daySchedule.isAvailable;

                          if (isSelected.selected) {
                            setIsSelected({
                              day: daySchedule.day,
                              selected: false,
                            });
                            handleSlotSelect(null);
                          } else {
                            setIsSelected({ day: daySchedule.day, selected });
                            handleSlotSelect({
                              start: daySchedule.startTime,
                              end: daySchedule.endTime,
                              formatted: selectedSlot?.formatted || "",
                            });
                          }
                        } else {
                          toast({
                            title: "Please select a time slot",
                            variant: "destructive",
                          });
                        }
                      }}
                      disabled={
                        !daySchedule.isAvailable ||
                        isTodayUnavailable(daySchedule.day)
                      }
                      className={`w-5 h-5 pr-4 rounded-none border-gray-300 text-soft-paste-active
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
