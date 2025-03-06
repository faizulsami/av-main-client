export interface MentorRequest {
  id: string;
  name: string;
  userName: string;
  designation: string;
  status: "pending" | "approved" | "rejected";
  profileImage: string;
  adminApproval: boolean;
  email: string;
  gender: "male" | "female" | "other";
  availability: TimeSlot[];
  specialization: string;
  bio: string;
  createdAt: string;
  activeStatus: "online" | "offline";
  scheduleId: {
    schedule: {
      _id: string;
      day: Day;
      startTime: {
        hours: number;
        minutes: number;
      };
      endTime: {
        hours: number;
        minutes: number;
      };
      isAvailable: boolean;
    }[];
  };
  phone?: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: T[];
}

export interface DialogState {
  type: "approve" | "reject" | "details" | null;
  mentor: MentorRequest | null;
}

export interface MentorTableProps {
  mentorRequests: MentorRequest[];
  isLoading: boolean;
  onApprove: (mentor: MentorRequest) => void;
  onReject: (mentor: MentorRequest) => void;
  onViewDetails: (mentor: MentorRequest) => void;
}

export interface MentorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => Promise<void>;
  confirmLabel: string;
  confirmVariant: "default" | "destructive";
}

// updated mentor-reg config
import { z } from "zod";

export const DayEnum = z.enum([
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]) as z.ZodEnum<
  ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
>;

export const TimeSchema = z.object({
  hours: z.number().min(0).max(23),
  minutes: z.number().min(0).max(59),
});

export const TimeSlotSchema = z.object({
  day: DayEnum,
  startTime: TimeSchema,
  endTime: TimeSchema,
  isAvailable: z.boolean(),
});

export const mentorFormSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    ),
  userName: z.string().min(3, "Username must be at least 3 characters"),
  mentor: z.object({
    gender: z.enum(["male", "female", "other"]),
    name: z.string().min(2, "Name is required"),
    bio: z.string().min(10, "Bio must be at least 10 characters"),
    designation: z.string().min(2, "Designation is required"),
    specialization: z.string().min(2, "Specialization is required"),
    availability: z.array(TimeSlotSchema),
    email: z.string().email("Invalid email address"),
    profileImage: z.string().optional(),
    adminApproval: z.boolean().default(false),
    activeStatus: z.enum(["online", "offline"]).default("offline"),
    phone: z.string().min(11, "Phone number is required"),
  }),
});

export type Day = z.infer<typeof DayEnum>;
export type TimeSlot = z.infer<typeof TimeSlotSchema>;
export type MentorFormValues = z.infer<typeof mentorFormSchema>;
