"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useStats } from "@/hooks/useStats";
import { FileText } from "lucide-react";

const formSchema = z.object({
  interestedUsers: z.string().min(1, "This field is required"),
  respondedUsers: z.string().min(1, "This field is required"),
  serviceNeedsTo: z.string().min(1, "This field is required"),
});

export default function DataCustomizationForm() {
  const { toast } = useToast();
  const { saveStats, fetchStats, loading, error } = useStats();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interestedUsers: "",
      respondedUsers: "",
      serviceNeedsTo: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchStats();
        form.reset(data);
      } catch (fetchError) {
        console.error("Error fetching initial data:", fetchError);
        toast({
          title: "Error",
          description: "Failed to fetch initial data.",
        });
      }
    };

    fetchData();
  }, [form, toast]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await saveStats(values);
    if (result) {
      toast({
        title: "Data saved successfully",
        description: "Your customization settings have been updated.",
      });
    } else {
      toast({
        title: "Error",
        description: error || "Failed to save data.",
      });
    }
  }

  return (
    <div className="flex min-h-screen items-start justify-start bg-slate-50 p-4">
      <Card className="w-full space-y-4">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <FileText
              size={24}
              className="bg-soft-paste-light-active p-1 rounded-full"
            />
            Data Customization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 flex"
            >
              <div className="flex flex-row gap-6 items-center justify-between">
                <FormField
                  control={form.control}
                  name="interestedUsers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Interested Users
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="respondedUsers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Responded Users
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="serviceNeedsTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Service Needs To
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="submit"
                size="sm"
                className="max-w-40 w-full bg-teal-400 hover:bg-teal-500 text-white ml-auto"
                disabled={loading}
              >
                Save
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
