import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { stringify } from 'csv-stringify/sync';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const eventId = params.id;

  if (!eventId) {
    return new NextResponse("Event ID is required", { status: 400 });
  }

  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Verify event ownership and get event details
  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .eq("owner_id", user.id)
    .single();

  if (!event) {
    return new NextResponse("Event not found or unauthorized", { status: 404 });
  }

  // Get all RSVPs for the event
  const { data: rsvps } = await supabase
    .from("rsvps")
    .select("*")
    .eq("event_id", eventId)
    .order("timestamp", { ascending: true });

  if (!rsvps || rsvps.length === 0) {
    return new NextResponse("No RSVPs found", { status: 404 });
  }

  // Prepare data for CSV
  const records = rsvps.map(rsvp => ({
    Name: rsvp.attendee_name || 'N/A',
    Email: rsvp.attendee_email || 'N/A',
    'RSVP Date': new Date(rsvp.timestamp).toLocaleString(),
  }));

  // Generate CSV with proper handling of special characters and encoding
  const csvContent = stringify(records, {
    header: true,
    quoted: true,
    quoted_empty: true,
  });

  // Set headers for file download
  const headers = new Headers();
  headers.set("Content-Type", "text/csv; charset=utf-8");
  headers.set(
    "Content-Disposition",
    `attachment; filename="${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_attendees.csv"`
  );

  return new NextResponse(csvContent, {
    headers,
  });
} 