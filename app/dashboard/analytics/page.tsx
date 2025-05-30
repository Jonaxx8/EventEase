import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Event {
  id: string;
  title: string;
  date_time: string;
  owner_id: string;
}

export default async function AnalyticsPage() {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Get all events owned by the user
  const { data: fetchedEvents = [] } = await supabase
    .from("events")
    .select("*")
    .eq("owner_id", user.id)
    .order("date_time", { ascending: false });

  const events = fetchedEvents as Event[];

  // Get all RSVPs for user's events with count
  const { data: rsvps = [] } = await supabase
    .from("rsvps")
    .select("*")
    .in("event_id", events.map(event => event.id))
    .order("timestamp", { ascending: false });

  // Separate events into past and upcoming
  const now = new Date();
  const pastEvents = events.filter(event => new Date(event.date_time) < now);
  const upcomingEvents = events.filter(event => new Date(event.date_time) >= now);

  const EventsList = ({ events }: { events: typeof upcomingEvents }) => (
    <div className="space-y-4">
      {events.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">No events found</p>
          </CardContent>
        </Card>
      ) : (
        events.map((event) => {
          const eventRsvps = rsvps?.filter(rsvp => rsvp.event_id === event.id) || [];
          
          return (
            <Card key={event.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {event.title}
                      <span className="text-sm font-normal text-muted-foreground">
                        ({eventRsvps.length} attendees)
                      </span>
                    </CardTitle>
                    <CardDescription>
                      {new Date(event.date_time).toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </CardDescription>
                  </div>
                  <a href={`/api/analytics/export/${event.id}`} download>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Attendees
                    </Button>
                  </a>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>RSVP Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {eventRsvps.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-muted-foreground">
                            No attendees yet
                          </TableCell>
                        </TableRow>
                      ) : (
                        eventRsvps.map((rsvp) => (
                          <TableRow key={rsvp.id}>
                            <TableCell>{rsvp.attendee_name || 'N/A'}</TableCell>
                            <TableCell>{rsvp.attendee_email || 'N/A'}</TableCell>
                            <TableCell>
                              {new Date(rsvp.timestamp).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric'
                              })}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Event Analytics</h1>
        <p className="text-muted-foreground">
          Track and manage attendees for all your events
        </p>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming Events ({upcomingEvents.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past Events ({pastEvents.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All Events ({events.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="space-y-4">
          <EventsList events={upcomingEvents} />
        </TabsContent>
        <TabsContent value="past" className="space-y-4">
          <EventsList events={pastEvents} />
        </TabsContent>
        <TabsContent value="all" className="space-y-4">
          <EventsList events={events} />
        </TabsContent>
      </Tabs>
    </div>
  );
} 