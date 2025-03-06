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
import { Day, TimeSlot } from "@/types/mentor.types";

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
  { hours: 9, minutes: 0 },
  { hours: 9, minutes: 30 },
  { hours: 10, minutes: 0 },
  { hours: 10, minutes: 30 },
  { hours: 11, minutes: 0 },
  { hours: 11, minutes: 30 },
  { hours: 12, minutes: 0 },
  { hours: 12, minutes: 30 },
  { hours: 13, minutes: 0 },
  { hours: 13, minutes: 30 },
  { hours: 14, minutes: 0 },
  { hours: 14, minutes: 30 },
  { hours: 15, minutes: 0 },
  { hours: 15, minutes: 30 },
  { hours: 16, minutes: 0 },
  { hours: 16, minutes: 30 },
  { hours: 17, minutes: 0 },
];

const formatTime = (time: { hours: number; minutes: number }) => {
  return `${time.hours.toString().padStart(2, "0")}:${time.minutes.toString().padStart(2, "0")}`;
};

export function AvailabilityScheduler({
  value = DAYS.map((day) => ({
    day: day.value as Day,
    startTime: { hours: 9, minutes: 0 },
    endTime: { hours: 17, minutes: 0 },
    isAvailable: false,
  })),
  onChange,
}: AvailabilitySchedulerProps) {
  const handleTimeChange = (
    day: Day,
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

  const handleAvailabilityToggle = (day: Day) => {
    const existingSlot = value.find((s) => s.day === day);
    const updatedSlots = existingSlot
      ? value.map((slot) => {
          if (slot.day === day) {
            return { ...slot, isAvailable: !slot.isAvailable };
          }
          return slot;
        })
      : [
          ...value,
          {
            day,
            startTime: { hours: 9, minutes: 0 },
            endTime: { hours: 17, minutes: 0 },
            isAvailable: true,
          },
        ];
    onChange(updatedSlots);
  };

  return (
    <div className="space-y-2">
      {DAYS.map((day) => {
        const slot = value.find((s) => s.day === day.value) ?? {
          day: day.value,
          startTime: { hours: 9, minutes: 0 },
          endTime: { hours: 17, minutes: 0 },
          isAvailable: false,
        };

        const startTime = slot.startTime || { hours: 9, minutes: 0 };
        const endTime = slot.endTime || { hours: 17, minutes: 0 };

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
                    value={formatTime(startTime)}
                    onValueChange={(time) =>
                      handleTimeChange(day.value, "startTime", time)
                    }
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Start Time" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((time) => (
                        <SelectItem
                          key={formatTime(time)}
                          value={formatTime(time)}
                        >
                          {formatTime(time)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <span>to</span>

                  <Select
                    value={formatTime(endTime)}
                    onValueChange={(time) =>
                      handleTimeChange(day.value, "endTime", time)
                    }
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="End Time" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((time) => (
                        <SelectItem
                          key={formatTime(time)}
                          value={formatTime(time)}
                        >
                          {formatTime(time)}
                        </SelectItem>
                      ))}
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
