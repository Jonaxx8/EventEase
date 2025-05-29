import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Calendar, MapPin, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RsvpForm } from "./rsvp-form";
import Link from "next/link";

interface EventPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const supabase = await createClient();
  const { id } = await params;
  // Get event details
  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (!event) {
    notFound();
  }

  // Get RSVP count
  const { count } = await supabase
    .from("rsvps")
    .select("*", { count: 'exact', head: true })
    .eq("event_id", event.id);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container max-w-screen-md mx-auto py-8 px-4">
        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl">{event.title}</CardTitle>
            <CardDescription className="flex flex-col gap-2 text-base">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {format(new Date(event.date_time), "EEEE, MMMM d, yyyy 'at' h:mm a")}
              </div>
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {event.location}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {count || 0} {count === 1 ? 'person' : 'people'} attending
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">About this event</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {event.description}
              </p>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">RSVP to this event</h3>
              <RsvpForm 
                eventId={event.id} 
                eventDetails={{
                  title: event.title,
                  description: event.description,
                  date_time: event.date_time,
                  location: event.location,
                }}
              />
            </div>
          </CardContent>
        </Card>

        <div className="fixed bottom-4 right-4">
          <Link 
            href="/"
            className="text-md text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <Calendar className="h-4 w-4" />
            <span>Powered by <span className="font-bold">EventEase</span></span>
          </Link>
        </div>
      </div>
    </div>
  );
} 