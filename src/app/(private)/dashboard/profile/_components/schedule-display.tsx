"use client";

import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TimeSlot {
  hours: number;
  minutes: number;
}

interface ScheduleDay {
  day: string;
  startTime: TimeSlot;
  endTime: TimeSlot;
  isAvailable: boolean;
  _id: string;
}

interface ScheduleDisplayProps {
  schedule: ScheduleDay[];
}

const formatTime = (time: TimeSlot) => {
  const hours = time.hours.toString().padStart(2, "0");
  const minutes = time.minutes.toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export function ScheduleDisplay({ schedule }: ScheduleDisplayProps) {
  return (
    <div className="grid gap-3">
      {schedule.map((day) => (
        <div
          key={day._id}
          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
        >
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="font-medium capitalize">{day.day}</p>
              <p className="text-sm text-muted-foreground">
                {formatTime(day.startTime)} - {formatTime(day.endTime)}
              </p>
            </div>
          </div>
          <Badge
            variant={day.isAvailable ? "default" : "secondary"}
            className={
              day.isAvailable ? "bg-emerald-500 hover:bg-emerald-500" : ""
            }
          >
            {day.isAvailable ? "Available" : "Unavailable"}
          </Badge>
        </div>
      ))}
    </div>
  );
}
