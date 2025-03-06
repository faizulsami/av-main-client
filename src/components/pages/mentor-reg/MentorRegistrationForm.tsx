"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Day, mentorFormSchema, MentorFormValues } from "@/types/mentor.types";
import { AvailabilityScheduler } from "@/components/availability/AvailabilityScheduler";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { registerMentor } from "@/services/mentor/mentor.service";

const DEFAULT_PROFILE_IMAGE = "/images/avatar.png";
const DEFAULT_AVAILABILITY: Array<{
  day: Day;
  startTime: { hours: number; minutes: number };
  endTime: { hours: number; minutes: number };
  isAvailable: boolean;
}> = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
].map((day) => ({
  day: day as Day,
  startTime: { hours: 9, minutes: 0 },
  endTime: { hours: 17, minutes: 0 },
  isAvailable: false,
}));

const MentorRegistrationForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const router = useRouter();

  const form = useForm<MentorFormValues>({
    resolver: zodResolver(mentorFormSchema),
    defaultValues: {
      userName: "",
      password: "",
      mentor: {
        gender: "male",
        availability: DEFAULT_AVAILABILITY,
        adminApproval: false,
        profileImage: DEFAULT_PROFILE_IMAGE,
        name: "",
        email: "",
        bio: "",
        designation: "",
        specialization: "",
        activeStatus: "offline",
        phone: "",
      },
    },
  });

  async function onSubmit(values: MentorFormValues) {
    // console.log("Registration Values:", values);
    setIsLoading(true);
    try {
      await registerMentor(values);
      // console.log("MENTOR REGISTRATION RESULT", result);

      setDialogMessage(
        "Registration Successful. Your mentor account has been created. Please wait for admin approval.",
      );
      setShowDialog(true);

      form.reset();
      // router.push("/login");
    } catch (error) {
      setDialogMessage(
        "Registration Failed. There was an error creating your account. Please try again.",
      );
      setShowDialog(true);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-3xl mx-auto shadow space-y-6">
        <CardHeader>
          <h2 className="text-xl md:text-2xl font-bold text-center text-violet">
            Apply Now
          </h2>
          <p className="text-center text-muted-foreground mt-2 text-sm">
            Apply now to become a Listener or join our Placement Program.
          </p>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="userName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="mentor.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mentor.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mentor.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Enter your phone number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mentor.gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
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
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="mentor.designation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Designation</FormLabel>
                      <FormControl>
                        <Input placeholder="Lead Specialist" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mentor.specialization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialization</FormLabel>
                      <FormControl>
                        <Input placeholder="Neurology" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="mentor.bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share your professional experience and expertise"
                        className="h-32 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mentor.availability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability Schedule</FormLabel>
                    <FormControl>
                      <AvailabilityScheduler
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-soft-paste font-bold"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Register as Mentor"
            )}
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-violet text-center pb-3">
              Registration Result
            </DialogTitle>
            <DialogDescription className="text-center text-soft-paste-dark font-bold">
              {dialogMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-2 flex items-center justify-center gap-4">
            <DialogClose asChild>
              <Button
                type="button"
                size={"sm"}
                className="bg-soft-paste hover:bg-gray-300 font-bold py-2 px-4 rounded"
                onClick={() => {
                  router.push("/login");
                }}
              >
                Login
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                type="button"
                size={"sm"}
                className="bg-red-400 hover:bg-gray-300 font-bold py-2 px-4 rounded"
                onClick={() => setShowDialog(false)}
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MentorRegistrationForm;
