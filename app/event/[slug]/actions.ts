'use server';

import { createClient } from "@/lib/supabase/server";

interface CreateRsvpParams {
  eventId: string;
  attendeeName: string;
  attendeeEmail: string;
}

export async function createRsvp({ eventId, attendeeName, attendeeEmail }: CreateRsvpParams) {
  const supabase = await createClient();

  // Check if the event exists
  const { data: event } = await supabase
    .from("events")
    .select("id")
    .eq("id", eventId)
    .single();

  if (!event) {
    throw new Error("Event not found");
  }

  // Check if user has already RSVP'd
  const { data: existingRsvp } = await supabase
    .from("rsvps")
    .select("id")
    .eq("event_id", eventId)
    .eq("attendee_email", attendeeEmail)
    .single();

  if (existingRsvp) {
    throw new Error("You have already RSVP'd to this event");
  }

  // Create RSVP
  const { error } = await supabase
    .from("rsvps")
    .insert({
      event_id: eventId,
      attendee_name: attendeeName,
      attendee_email: attendeeEmail,
    });

  if (error) {
    console.error("Error creating RSVP:", error);
    throw new Error("Failed to create RSVP");
  }
} 