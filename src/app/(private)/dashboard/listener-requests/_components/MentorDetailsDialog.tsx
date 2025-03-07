// _components/MentorDetailsDialog.tsx
import { useState } from "react";
import {
  CalendarDays,
  Mail,
  User,
  Briefcase,
  FileText,
  Globe,
  Clock,
  ChevronRight,
  Phone,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { MentorRequest } from "@/types/mentor.types";
import { getAvatarUrl } from "@/utils/getAvatarUrl";
import { DialogClose } from "@radix-ui/react-dialog";

interface MentorDetailsDialogProps {
  mentor: MentorRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MentorDetailsDialog({
  mentor,
  open,
  onOpenChange,
}: MentorDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState("profile");

  if (!mentor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 overflow-hidden rounded-lg max-h-[80vh]">
        <ScrollArea className="h-[80vh]">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-background z-0" />
            <div className="relative z-10 p-4">
              <DialogHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <Avatar className="h-16 w-16 border-2 border-background shadow-lg">
                      <AvatarImage
                        src={getAvatarUrl(mentor?.gender)}
                        alt={mentor?.name}
                      />
                      <AvatarFallback className="text-lg">
                        {mentor?.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="space-y-0.5">
                    <DialogTitle className="text-lg font-semibold">
                      {mentor?.name}
                    </DialogTitle>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Badge
                        variant="outline"
                        className="font-medium bg-soft-paste-light text-xs"
                      >
                        @{mentor?.userName}
                      </Badge>
                      <ChevronRight className="w-3 h-3" />
                      <span className="text-xs">{mentor?.designation}</span>
                    </div>
                  </div>
                </div>
                <DialogClose className="absolute right-3 top-1.5 w-6 h-6"></DialogClose>
              </DialogHeader>

              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="mt-2"
              >
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="profile" className="text-xs">
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="professional" className="text-xs">
                    Professional
                  </TabsTrigger>
                  <TabsTrigger value="availability" className="text-xs">
                    Availability
                  </TabsTrigger>
                </TabsList>

                <div className="space-y-4">
                  <TabsContent value="profile" className="mt-0 space-y-4">
                    <Card className="shadow-none">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <User className="w-4 h-4 text-primary" />
                          Contact Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-2 space-y-3">
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-muted-foreground" />
                          <span className="text-xs">{mentor?.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-muted-foreground" />
                          <span className="text-xs">{mentor?.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe size={14} className="text-muted-foreground" />
                          <span className="text-xs capitalize">
                            {mentor?.gender}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-none">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary" />
                          Biography
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          {mentor?.bio}
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="professional" className="mt-0 space-y-4">
                    <Card className="shadow-none">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-primary" />
                          Expertise
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-2 space-y-3">
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium">
                            Designation
                          </label>
                          <Badge variant="secondary" className="text-xs">
                            {mentor?.designation}
                          </Badge>
                        </div>
                        <Separator className="my-2" />
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium">
                            Specialization
                          </label>
                          <Badge variant="outline" className="text-xs">
                            {mentor?.specialization}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="availability" className="mt-0">
                    <Card className="shadow-none">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <CalendarDays className="w-4 h-4 text-primary" />
                          Schedule
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        {mentor?.scheduleId?.schedule?.length ? (
                          <div className="grid gap-2">
                            {mentor?.scheduleId.schedule.map(
                              (schedule, index) => {
                                console.log({ schedule });
                                return (
                                  <div
                                    key={schedule._id || index}
                                    className="grid grid-cols-3 p-2 rounded-md bg-muted/50 hover:bg-muted/80 transition-colors"
                                  >
                                    <span className="capitalize text-xs flex items-center gap-2">
                                      {schedule.day}
                                    </span>

                                    <div>
                                      <span className="text-xs font-medium flex items-center justify-end gap-2">
                                        <Clock className="w-3.5 h-3.5 text-primary" />
                                        {schedule.startTime.hours}:
                                        {schedule.startTime.minutes == 0
                                          ? "00"
                                          : schedule.startTime.minutes}{" "}
                                        {schedule.startTime.hours <= 5
                                          ? "PM"
                                          : "AM"}
                                        - {schedule.endTime.hours}:
                                        {schedule.endTime.minutes == 0
                                          ? "00"
                                          : schedule.endTime.minutes}{" "}
                                        {schedule.startTime.hours <= 5
                                          ? "PM"
                                          : "AM"}
                                      </span>
                                    </div>
                                    <div className="flex justify-end">
                                      <Badge
                                        variant={
                                          schedule.isAvailable
                                            ? "default"
                                            : "destructive"
                                        }
                                        className="text-[10px] px-2 py-0 w-[70px] text-center"
                                      >
                                        {schedule.isAvailable
                                          ? "Available"
                                          : "Unavailable"}
                                      </Badge>
                                    </div>
                                  </div>
                                );
                              },
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <CalendarDays className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
                            <p className="text-xs text-muted-foreground">
                              No schedule information available.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
          <ScrollBar />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
