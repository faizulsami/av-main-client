/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Phone, MessageCircle, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import type { ActionType } from "../pages/home/hero/Hero";
import { SessionConfirmDialog } from "@/app/(marketing)/(session)/sessions/_components/SessionConfirmDialog";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import api from "@/config/axios.config";

interface VolunteerProps {
  name: string;
  userName: string;
  title: string;
  gender: string;
  profileImage: string;
  isOnline: boolean;
  rating: number;
  yearsExperience: number;
  sessionsCompleted: number;
  expertise: Expertise[];
  description: string;
  onQuickCall?: () => void;
  onChat?: () => void;
  onBookCall?: () => void;
  actionType: ActionType;
  user: any;
}

interface Expertise {
  name: string;
}

export default function VolunteerCard({
  name,
  userName,
  gender,
  isOnline,
  actionType,
  user,
}: VolunteerProps) {
  const [allAppointments, setAllAppointments] = useState([]);
  const { isAuthenticated, userRole } = useAuth();
  const router = useRouter();

  const handleAction = (action: string) => {
    if (!isAuthenticated) {
      router.push(`/login?returnTo=${action}`);
      return;
    }

    const actionMap = {
      "quick-call": "Quick Call",
      chat: "Chat",
      booking: "Booking Call",
    };

    const appointmentType = actionMap[action as keyof typeof actionMap];
    router.push(`/booking?mentor=${userName}&type=${appointmentType}`);
  };

  const isButtonEnabled = (buttonType: ActionType): boolean => {
    return actionType === buttonType;
  };

  const isDisabled = userRole && userRole !== "mentee" && userRole !== "guest";

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const { data } = await api.get(`/api/v1/appointments`);
        const filterAppointments = data?.data?.filter(
          (appointment: any) =>
            appointment.appointmentType ===
              (actionType === "chat"
                ? "Chat"
                : actionType == "quick-call"
                  ? "Quick Call"
                  : "Booking Call") &&
            appointment.menteeUserName === user?.userName,
        );

        setAllAppointments(filterAppointments);
        if (!data?.data) {
          throw new Error("Booking not found");
        }
      } catch (error) {
        console.error("Error fetching booking details: ", error);

        // router.push("/");
      }
    };
    fetchBookingDetails();
  }, []);

  const isCompleted = allAppointments?.some(
    (appointment: any) =>
      appointment.status !== "completed" || appointment.status !== "cancelled",
  );

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md bg-soft-paste-light-hover">
      <CardContent className="p-5 ">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-primary/10 to-muted">
              <Image
                src={
                  gender === "male"
                    ? "/images/avatar/man.png"
                    : "/images/avatar/woman.png"
                }
                alt={name}
                width={200}
                height={200}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            {isOnline && (
              <div className="absolute -bottom-2 right-0">
                <div className="relative">
                  <div className="absolute inline-flex h-3 w-3 rounded-full bg-emerald-500 opacity-75 animate-ping"></div>
                  <div className="relative -top-1 inline-flex rounded-full h-3 w-3 bg-emerald-500"></div>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col">
              <h3 className="text-base truncate font-bold">{name}</h3>
              {/* <p className="text-xs text-muted-foreground mb-2">{title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {description}
              </p> */}
            </div>
          </div>
        </div>
      </CardContent>

      <Separator />

      <CardFooter className="p-3 gap-2">
        <TooltipProvider>
          {!isDisabled && (
            <div className="grid grid-cols-1 gap-2 w-full">
              {isButtonEnabled("quick-call") && (
                <Button
                  disabled={allAppointments?.length > 0 && !isCompleted}
                  className=" h-9 text-xs font-bold bg-soft-paste hover:bg-soft-paste-dark text-white"
                  onClick={() => handleAction("quick-call")}
                >
                  <Phone className="w-3.5 h-3.5 mr-1.5" />
                  Quick Call
                </Button>
              )}

              {isButtonEnabled("chat") && (
                <Button
                  disabled={allAppointments?.length > 0 && !isCompleted}
                  className="h-9 text-xs font-bold bg-violet hover:bg-violet-dark text-white"
                  onClick={() => handleAction("chat")}
                >
                  <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                  Chat
                </Button>
              )}

              {isButtonEnabled("booking") && (
                <Button
                  className=" h-9 text-xs font-bold bg-soft-paste hover:bg-soft-paste-dark text-white"
                  onClick={() => handleAction("booking")}
                >
                  <CalendarCheck className="w-3.5 h-3.5 mr-1.5" />
                  Book A Call
                </Button>
              )}
            </div>
          )}
        </TooltipProvider>
      </CardFooter>
      <SessionConfirmDialog />
    </Card>
  );
}
