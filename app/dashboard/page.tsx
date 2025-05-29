import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, MapPin, PlusCircle } from "lucide-react";
import Link from "next/link";
import { EventCalendar } from "./components/event-calendar";
import { EventActions } from "./components/event-actions";

export default async function DashboardPage() {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Get events owned by the current user
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("owner_id", user.id)
    .order("date_time", { ascending: true });

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
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-7">
        <div className="md:col-span-4">
          <EventCalendar events={events || []} />
        </div>

        <div className="md:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>
                Your next scheduled events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!events?.length ? (
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
                events.map((event) => (
                  <Card key={event.id} className="group">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h3 className="font-semibold line-clamp-1">
                            {event.title}
                          </h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="mr-2 h-4 w-4" />
                            {new Date(event.date_time).toLocaleDateString(undefined, {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: 'numeric'
                            })}
                          </div>
                          {event.location && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="mr-2 h-4 w-4" />
                              {event.location}
                            </div>
                          )}
                        </div>
                        <EventActions eventId={event.id} />
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 