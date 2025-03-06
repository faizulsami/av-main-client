/* eslint-disable prettier/prettier */
"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "../ui/switch";
import { TimeSlot } from "@/types/mentor.types";

interface AvailabilitySchedulerProps {
  value: TimeSlot[];
  onChange: (value: TimeSlot[]) => void;
}

const DAYS = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
] as const;

const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
];

export function AvailabilityScheduler({
  value,
  onChange,
}: AvailabilitySchedulerProps) {
  const handleTimeChange = (
    day: string,
    field: "startTime" | "endTime",
    newTime: string,
  ) => {
    const [hours, minutes] = newTime.split(":").map(Number);
    const updatedSlots = value.map((slot) => {
      if (slot.day === day) {
        return { ...slot, [field]: { hours, minutes } };
      }
      return slot;
    });
    onChange(updatedSlots);
  };

  const handleAvailabilityToggle = (day: string) => {
    const updatedSlots = value.map((slot) => {
      if (slot.day === day) {
        return { ...slot, isAvailable: !slot.isAvailable };
      }
      return slot;
    });
    onChange(updatedSlots);
  };

  return (
    <div className="space-y-2">
      {DAYS.map((day) => {
        const slot = value.find((s) => s.day === day.value) || {
          day: day.value,
          startTime: { hours: 9, minutes: 0 },
          endTime: { hours: 17, minutes: 0 },
          isAvailable: false,
        };

        return (
          <Card key={day.value} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Switch
                  checked={slot.isAvailable}
                  onCheckedChange={() => handleAvailabilityToggle(day.value)}
                />
                <Label className="font-medium">{day.label}</Label>
              </div>

              {slot.isAvailable && (
                <div className="flex items-center space-x-2">
                  <Select
                    value={`${slot.startTime.hours}:${slot.startTime.minutes}`}
                    onValueChange={(time) =>
                      handleTimeChange(day.value, "startTime", time)
                    }
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Start Time" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <span>to</span>

                  <Select
                    value={`${slot.endTime.hours}:${slot.endTime.minutes}`}
                    onValueChange={(time) =>
                      handleTimeChange(day.value, "endTime", time)
                    }
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="End Time" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((time) => {
                        console.log({ time });
                        return (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
