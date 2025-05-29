'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { createRsvp } from "./actions";
import { useRouter } from "next/navigation";
import confetti from 'canvas-confetti';
import 'add-to-calendar-button';

const rsvpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
});

type RsvpFormValues = z.infer<typeof rsvpSchema>;

interface RsvpFormProps {
  eventId: string;
  eventDetails: {
    title: string;
    description: string;
    date_time: string;
    location?: string;
  };
}

export function RsvpForm({ eventId, eventDetails }: RsvpFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const form = useForm<RsvpFormValues>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  async function onSubmit(data: RsvpFormValues) {
    try {
      setIsSubmitting(true);
      await createRsvp({
        eventId,
        attendeeName: data.name,
        attendeeEmail: data.email,
      });
      
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      setIsSuccess(true);
      router.refresh();
    } catch (error) {
      console.error("Failed to submit RSVP:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center space-y-4 py-6">
        <div className="text-2xl font-semibold text-green-600">
          🎉 You&apos;re registered!
        </div>
        <p className="text-muted-foreground">
          Thank you for registering for this event. We&apos;ve sent a confirmation email to your inbox.
        </p>
        <div className="pt-4">
          {/* @ts-expect-error - add-to-calendar-button is a web component */}
          <add-to-calendar-button
            name={eventDetails.title}
            description={eventDetails.description}
            startDate={new Date(eventDetails.date_time).toISOString().split('T')[0]}
            startTime={new Date(eventDetails.date_time).toTimeString().slice(0,5)}
            endTime={new Date(new Date(eventDetails.date_time).getTime() + 2 * 60 * 60 * 1000).toTimeString().slice(0,5)}
            location={eventDetails.location}
            options="['Google','Apple','iCal','Outlook.com']"
            timeZone="America/New_York"
            inline
          />
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
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
                <Input type="email" placeholder="your.email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "RSVP to Event"}
        </Button>
      </form>
    </Form>
  );
}