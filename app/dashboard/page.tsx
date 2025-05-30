import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, PlusCircle, Users, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { EventCalendar } from "./components/event-calendar";
import { EventCard } from "./components/event-card";

interface Event {
  id: string;
  title: string;
  description: string;
  date_time: string;
  location?: string;
  owner_id: string;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // First get owned events
  const { data: ownedEvents } = await supabase
    .from("events")
    .select("*")
    .eq("owner_id", user.id)
    .order("date_time", { ascending: true });

  const userEvents = ownedEvents || [];

  // Then get RSVPs and total attendees
  const [rsvpsResponse, totalAttendeesResponse] = await Promise.all([
    supabase
      .from("events")
      .select("*, rsvps!inner(*)")
      .eq("rsvps.attendee_email", user.email)
      .order("date_time", { ascending: true }),
    supabase
      .from("rsvps")
      .select("event_id")
      .in("event_id", userEvents.map(event => event.id))
  ]);

  // Get RSVP events
  const rsvpEvents = (rsvpsResponse.data || []) as Event[];

  // Combine and deduplicate events
  const allEventIds = new Set();
  const allEvents = [...userEvents, ...rsvpEvents].filter((event: Event) => {
    if (allEventIds.has(event.id)) return false;
    allEventIds.add(event.id);
    // Only include events that are in the future or today
    return new Date(event.date_time) >= new Date(new Date().setHours(0, 0, 0, 0));
  }).sort((a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime());

  // Calculate analytics
  const totalEvents = userEvents.length;
  const totalAttendees = totalAttendeesResponse.data?.length || 0;
  const upcomingEvents = userEvents.filter(
    (event: Event) => new Date(event.date_time) >= new Date(new Date().setHours(0, 0, 0, 0))
  ).length;

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
            <PlusCircle className="0h-4 w-4" />
            <span className="hidden sm:block">Create Event</span>
          </Button>
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-7">
        <div className="md:col-span-4">
          <EventCalendar events={allEvents} />
          
          {/* Analytics Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <Link href="/dashboard/analytics">
              <Card className="hover:border-primary/50 transition-colors">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                      <p className="text-2xl font-bold">{totalEvents}</p>
                    </div>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/analytics">
              <Card className="hover:border-primary/50 transition-colors">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Total Attendees</p>
                      <p className="text-2xl font-bold">{totalAttendees}</p>
                    </div>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/analytics">
              <Card className="hover:border-primary/50 transition-colors">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Upcoming Events</p>
                      <p className="text-2xl font-bold">{upcomingEvents}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
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