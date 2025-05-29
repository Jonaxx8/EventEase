import { Calendar, MapPin } from "lucide-react";
import { EventActions } from "./event-actions";

import { Card, CardContent } from "@/components/ui/card";

interface Event {
    id: string;
    title: string;
    date_time: string;
    location?: string;
}
  
  
export function EventCard({ event }: { event: Event }) {
    return (
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
    );
  }