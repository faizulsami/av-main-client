"use client";
import { useState, useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Save,
  Loader2,
  User,
  Mail,
  Briefcase,
  FileText,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import useMentorData from "@/hooks/mentor/useMentorData";
import { ScheduleDisplay } from "./_components/schedule-display";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import { useMentorStore } from "@/store/useMentorStore";
import { get_socket } from "@/utils/get-socket";

type Mentor = {
  _id: string;
  userName: string;
  name: string;
  bio: string;
  gender: string;
  designation: string;
  specialization: string;
  isOnline: boolean;
  adminApproval: boolean;
  email: string;
  profileImage: string;
  phone: string;
  scheduleId: {
    _id: string;
    userName: string;
    schedule: Array<{
      day: string;
      startTime: { hours: number; minutes: number; _id: string; id: string };
      endTime: { hours: number; minutes: number; _id: string; id: string };
      isAvailable: boolean;
      _id: string;
      id: string;
    }>;
    createdAt: string;
    updatedAt: string;
    __v: number;
    id: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
};

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(30, { message: "Name must not be longer than 30 characters." }),
  userName: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." }),
  email: z
    .string()
    .min(1, { message: "This field is required" })
    .email("This is not a valid email"),
  bio: z.string().max(500).min(4),
  gender: z.string({
    required_error: "Please select a gender",
  }),
  designation: z.string().min(2, { message: "Designation is required" }),
  specialization: z.string().min(2, { message: "Specialization is required" }),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const { user: currentUser } = useAuth();
  const { mentor, loading, error } = useMentorData({
    userName: currentUser?.userName,
  }) as unknown as { mentor: Mentor; loading: boolean; error: string | null };

  const { isOnline, setIsOnline } = useMentorStore();

  const userData = useMemo(() => {
    if (mentor) {
      return {
        name: mentor.name ?? "",
        userName: mentor.userName ?? "",
        email: mentor.email ?? "",
        bio: mentor.bio ?? "",
        gender: mentor.gender ?? "",
        designation: mentor.designation ?? "",
        specialization: mentor.specialization ?? "",
        phone: mentor.phone ?? "",
      };
    }
    return {
      name: "",
      userName: "",
      email: "",
      bio: "",
      gender: "",
      designation: "",
      specialization: "",
      phone: "",
    };
  }, [mentor]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
    defaultValues: userData,
  });

  useEffect(() => {
    if (mentor) {
      form.reset(userData);
      setIsOnline(mentor.isOnline);
    }
  }, [mentor, form, userData]);

  const { isSubmitting } = form.formState;

  const calculateProfileCompletion = () => {
    if (!mentor) return 0;
    const fields = [
      "name",
      "email",
      "bio",
      "gender",
      "designation",
      "specialization",
    ];
    const completedFields = fields.filter((field) =>
      Boolean(mentor[field as keyof typeof mentor]),
    );
    return Math.round((completedFields.length / fields.length) * 100);
  };

  async function updateIsOnlineStatus(newStatus: boolean) {
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/mentors/${mentor?.userName}`,
        {
          isOnline: newStatus,
          adminApproval: mentor?.adminApproval || false,
          phone: mentor?.phone || "",
        },
      );

      const socket = get_socket();

      socket.emit("mentor-online", {
        username: mentor?.userName,
        isOnline: newStatus,
      });
      if (response.status === 200) {
        toast.success("Status updated successfully");
        setIsOnline(newStatus); // Update Zustand store
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  }

  async function onSubmit(data: ProfileFormValues) {
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/mentors/${mentor?._id}`,
        {
          ...data,
          isOnline: isOnline,
          adminApproval: mentor?.adminApproval || false,
          phone: data.phone || "",
        },
      );
      if (response.status === 200) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  }

  if (loading) {
    return (
      <div className="container py-10">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-48 bg-muted animate-pulse rounded" />
              <div className="h-3 w-24 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-10">
        <div className="max-w-5xl mx-auto">
          <Card>
            <CardContent className="py-10">
              <div className="text-center space-y-2">
                <p className="text-muted-foreground">
                  Failed to load profile data
                </p>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Try again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container pb-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="grid gap-8 grid-cols-1 md:grid-cols-[280px_1fr]">
          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold">
                  Active Status
                </CardTitle>
                <Switch
                  checked={isOnline}
                  onCheckedChange={(checked) => {
                    setIsOnline(checked); // Update Zustand store immediately
                    updateIsOnlineStatus(checked); // Update backend
                  }}
                  aria-label="Toggle active status"
                  aria-checked={isOnline}
                />
              </div>
            </CardHeader>
            <Separator className="my-1" />
            <CardContent className="pt-2">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage
                      src={
                        mentor?.gender === "male"
                          ? "/images/avatar/man.png"
                          : "/images/avatar/woman.jpg"
                      }
                      alt={mentor?.name}
                    />
                    <AvatarFallback>{mentor?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {isOnline && (
                    <Badge
                      variant="secondary"
                      className="absolute -bottom-2 right-0 bg-emerald-500 text-white border-2 border-background"
                    >
                      Active
                    </Badge>
                  )}
                </div>
                <div className="space-y-1 text-center">
                  <h3 className="font-medium">{mentor?.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {mentor?.designation}
                  </p>
                </div>
                <Separator />
                <div className="w-full space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Profile completion
                    </span>
                    <span className="font-medium">
                      {calculateProfileCompletion()}%
                    </span>
                  </div>
                  <Progress
                    value={calculateProfileCompletion()}
                    className="h-2"
                  />
                </div>
                <div className="w-full">
                  <div className="flex items-center justify-between text-sm py-2">
                    <span className="text-muted-foreground">
                      Admin Approval
                    </span>
                    <Badge
                      variant={mentor?.adminApproval ? "default" : "secondary"}
                    >
                      {mentor?.adminApproval ? "Approved" : "Pending"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="professional">Professional</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Your basic profile information.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                      >
                        <div className="grid gap-4">
                          <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Full Name</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                      <Input
                                        {...field}
                                        disabled={!isEditing}
                                        className="pl-10"
                                        placeholder="Enter your full name"
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                      <Input
                                        {...field}
                                        disabled={!isEditing}
                                        className="pl-10"
                                        type="email"
                                        placeholder="Enter your email"
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Gender</FormLabel>
                                <Select
                                  disabled={!isEditing}
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">
                                      Female
                                    </SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <FileText className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Textarea
                                      {...field}
                                      disabled={!isEditing}
                                      className="min-h-[100px] resize-none pl-10"
                                      placeholder="Tell us about yourself"
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    disabled={!isEditing}
                                    placeholder="Enter your phone number"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="professional" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Professional Details</CardTitle>
                    <CardDescription>
                      Your expertise and specialization information.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="designation"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Designation</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      {...field}
                                      disabled={!isEditing}
                                      className="pl-10"
                                      placeholder="Enter your designation"
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="specialization"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Specialization</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <CheckCircle className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      {...field}
                                      disabled={!isEditing}
                                      className="pl-10"
                                      placeholder="Enter your specialization"
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="schedule" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Schedule</CardTitle>
                    <CardDescription>
                      Your weekly availability for mentoring sessions.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScheduleDisplay
                      schedule={mentor?.scheduleId?.schedule || []}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {isEditing && (
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={form.handleSubmit(onSubmit)}
                >
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <Save className="w-4 h-4 mr-2" />
                  Save changes
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
