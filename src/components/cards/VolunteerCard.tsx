"use client";

import {
  Phone,
  MessageCircle,
  CalendarCheck,
  Clock,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ActionType } from "../pages/home/hero/Hero";
import { SessionConfirmDialog } from "@/app/(marketing)/(session)/sessions/_components/SessionConfirmDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Expertise {
  name: string;
}

interface VolunteerProps {
  name: string;
  userName: string;
  title: string;
  profileImage: string;
  isActive?: boolean;
  rating: number;
  yearsExperience: number;
  sessionsCompleted: number;
  expertise: Expertise[];
  description: string;
  onQuickCall?: () => void;
  onChat?: () => void;
  onBookCall?: () => void;
  actionType: ActionType;
}

export default function VolunteerCard({
  name,
  userName,
  title,
  // profileImage,
  isActive,
  yearsExperience,
  sessionsCompleted,
  description,
  actionType,
}: VolunteerProps) {
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
  const tooltipMessage =
    userRole === "mentor" || userRole === "admin"
      ? "Action not allowed for your role"
      : "";

  console.log(userRole);

  return (
    <Card className="rounded-xl border overflow-hidden">
      <CardContent className="p-6">
        {/* Profile Section */}
        <div className="flex gap-6">
          <div className="shrink-0">
            <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted-foreground/20">
              <Image
                src="/images/avatar.png"
                alt={name}
                width={200}
                height={200}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h2 className="text-lg font-semibold">{name}</h2>
                <p className="text-gray-600">{title}</p>
              </div>
              {isActive && (
                <Badge className="bg-emerald-400 hover:bg-emerald-400 text-white border-0 rounded-md px-3">
                  Active Now
                </Badge>
              )}
            </div>

            {/* Rating Stars */}
            {/* <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < rating ? "text-soft-paste fill-current" : "text-gray-300"
                  }`}
                />
              ))}
            </div> */}

            {/* Stats */}
            <div className="space-y-1.5 mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-soft-paste" />
                <span className="text-sm text-gray-600">
                  {yearsExperience}+ years experience
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-soft-paste" />
                <span className="text-sm text-gray-600">
                  {sessionsCompleted}+ sessions completed
                </span>
              </div>
            </div>

            {/* Expertise Tags */}
            {/* <div className="flex flex-wrap gap-2 mb-4">
              {expertise.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-soft-paste/10 text-sm text-soft-paste"
                >
                  {item.name}
                </div>
              ))}
            </div> */}

            <p className="text-sm text-gray-600 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </CardContent>

      {/* Action Buttons */}
      <CardFooter className="grid grid-cols-3 gap-3 p-3">
        <TooltipProvider>
          {isDisabled ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="bg-soft-paste hover:bg-soft-paste-dark text-white border-0 rounded-md h-11"
                  onClick={() => handleAction("quick-call")}
                  disabled={isDisabled || !isButtonEnabled("quick-call")}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Quick Call
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltipMessage}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button
              className="bg-soft-paste hover:bg-soft-paste-dark text-white border-0 rounded-md h-11"
              onClick={() => handleAction("quick-call")}
              disabled={isDisabled || !isButtonEnabled("quick-call")}
            >
              <Phone className="w-4 h-4 mr-2" />
              Quick Call
            </Button>
          )}

          {isDisabled ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="bg-violet hover:bg-violet-dark text-white border-0 rounded-md h-11"
                  onClick={() => handleAction("chat")}
                  disabled={isDisabled || !isButtonEnabled("chat")}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltipMessage}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button
              className="bg-violet hover:bg-violet-dark text-white border-0 rounded-md h-11"
              onClick={() => handleAction("chat")}
              disabled={isDisabled || !isButtonEnabled("chat")}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat
            </Button>
          )}

          {isDisabled ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="bg-soft-paste hover:bg-soft-paste-dark text-white border-0 rounded-md h-11"
                  onClick={() => handleAction("booking")}
                  disabled={isDisabled || !isButtonEnabled("booking")}
                >
                  <CalendarCheck className="w-4 h-4 mr-2" />
                  Book Call
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltipMessage}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button
              className="bg-soft-paste hover:bg-soft-paste-dark text-white border-0 rounded-md h-11"
              onClick={() => handleAction("booking")}
              disabled={isDisabled || !isButtonEnabled("booking")}
            >
              <CalendarCheck className="w-4 h-4 mr-2" />
              Book Call
            </Button>
          )}
        </TooltipProvider>
      </CardFooter>
      <SessionConfirmDialog />
    </Card>
  );
}
