import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, PlusCircle } from "lucide-react";
import Link from "next/link";
import { EventCalendar } from "./components/event-calendar";
import { EventCard } from "./components/event-card";


export default async function DashboardPage() {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Get all events: owned by user OR has user's RSVP
  const [ownedEventsResponse, rsvpsResponse] = await Promise.all([
    supabase
      .from("events")
      .select("*")
      .eq("owner_id", user.id)
      .order("date_time", { ascending: true }),
    supabase
      .from("events")
      .select("*, rsvps!inner(*)")
      .eq("rsvps.attendee_email", user.email)
      .order("date_time", { ascending: true })
  ]);

  // Combine and deduplicate events
  const ownedEvents = ownedEventsResponse.data || [];
  const rsvpEvents = rsvpsResponse.data || [];
  const allEventIds = new Set();
  const allEvents = [...ownedEvents, ...rsvpEvents].filter(event => {
    if (allEventIds.has(event.id)) return false;
    allEventIds.add(event.id);
    return true;
  }).sort((a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime());

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and track all your events in one place
          </p>
        </div>
        <Link href="/dashboard/create">
          <Button>
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:block">Create Event</span>
          </Button>
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-7">
        <div className="md:col-span-4">
          <EventCalendar events={allEvents} />
        </div>  

        <div className="md:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>
                Your events and RSVPs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {allEvents.length === 0 ? (
                <div className="text-center py-6">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold mb-1">No events yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create your first event to get started
                  </p>
                  <Link href="/dashboard/create">
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Event
                    </Button>
                  </Link>
                </div>
              ) : (
                allEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 