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

// Generate all 30-minute intervals from 00:00 to 23:30
const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const hours = Math.floor(i / 2);
  const minutes = i % 2 === 0 ? 0 : 30;
  return { hours, minutes };
});

const formatTo24 = (time: { hours: number; minutes: number }) => {
  return `${time.hours.toString().padStart(2, "0")}:${time.minutes
    .toString()
    .padStart(2, "0")}`;
};

const formatTo12Hour = (hours: number, minutes: number) => {
  const suffix = hours >= 12 ? "PM" : "AM";
  const adjustedHour = hours % 12 || 12;
  const formatted = `${adjustedHour.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")} ${suffix}`;
  return formatted;
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
      ? value.map((slot) =>
          slot.day === day ? { ...slot, isAvailable: !slot.isAvailable } : slot,
        )
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
                  {/* Start Time */}
                  <Select
                    value={formatTo24(startTime)}
                    onValueChange={(time) =>
                      handleTimeChange(day.value, "startTime", time)
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue
                        placeholder="Start Time"
                        renderValue={(value) => {
                          const [h, m] = value.split(":").map(Number);
                          return formatTo12Hour(h, m);
                        }}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((time) => {
                        const rawValue = formatTo24(time);
                        return (
                          <SelectItem key={rawValue} value={rawValue}>
                            {formatTo12Hour(time.hours, time.minutes)}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>

                  <span>to</span>

                  {/* End Time */}
                  <Select
                    value={formatTo24(endTime)}
                    onValueChange={(time) =>
                      handleTimeChange(day.value, "endTime", time)
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue
                        placeholder="End Time"
                        renderValue={(value) => {
                          const [h, m] = value.split(":").map(Number);
                          return formatTo12Hour(h, m);
                        }}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((time) => {
                        const rawValue = formatTo24(time);
                        return (
                          <SelectItem key={rawValue} value={rawValue}>
                            {formatTo12Hour(time.hours, time.minutes)}
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
