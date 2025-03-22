"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import Availability from "./Availability";
import type { Volunteer } from "@/types/volunteer";
import { CalendarDays, MapPin } from "lucide-react";

interface BookingDetailsProps extends Volunteer {
  showAvailability?: boolean;
}

const ProfileSection = ({
  name,
  gender,
  title,
  location,
}: BookingDetailsProps) => {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-start gap-6">
        <div className="relative shrink-0">
          <div className="w-24 h-24 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-muted">
            <Image
              src={
                gender === "male"
                  ? "/images/avatar/man.png"
                  : "/images/avatar/woman.png"
              }
              alt={name}
              width={400}
              height={400}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        <h2 className="text-xl font-semibold">{name}</h2>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          {location && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span>{location}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function BookingDetailsCard({
  showAvailability = false,
  ...props
}: BookingDetailsProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          <ProfileSection {...props} />

          {showAvailability && (
            <div className="lg:w-1/2 space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <CalendarDays className="w-4 h-4 text-primary" />
                Available Time Slots
              </div>
              <Availability schedule={props.scheduleId.schedule} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
