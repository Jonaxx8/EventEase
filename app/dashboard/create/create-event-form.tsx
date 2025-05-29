"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createEvent } from "../actions/event";
import { toast } from "sonner";
import { slugify } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, MapPin, Type, FileText, Loader2 } from "lucide-react";

const eventFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  location: z.string().optional(),
  date_time: z.string().min(1, "Date and time is required"),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

export function CreateEventForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      date_time: new Date().toISOString().slice(0, 16), // Format for datetime-local
    },
  });

  async function onSubmit(data: EventFormValues) {
    setIsLoading(true);
    try {
      const public_slug = slugify(data.title);
      
      await createEvent({
        ...data,
        public_slug,
        description: data.description || null,
        location: data.location || null,
      });
      
      toast.success("Event created successfully");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 mb-6">
              <Type className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Basic Information</h2>
            </div>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Summer Tech Conference 2024" 
                        {...field}
                        className="border-2"
                      />
                    </FormControl>
                    <FormDescription>
                      Give your event a clear and descriptive title
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Join us for an exciting event..."
                        className="min-h-[120px] border-2 resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Describe what your event is about
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 mb-6">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Location & Time</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Convention Center, City" 
                        {...field}
                        className="border-2"
                      />
                    </FormControl>
                    <FormDescription>
                      Where will the event take place?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      Date and Time
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="datetime-local" 
                        {...field}
                        className="border-2"
                      />
                    </FormControl>
                    <FormDescription>
                      When will the event take place?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            size="lg"
            className="min-w-[200px]" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Event"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}