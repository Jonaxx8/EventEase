"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  date_time: string;
  description: string;
}

interface EventCalendarProps {
  events: Event[];
}

export function EventCalendar({ events }: EventCalendarProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  // Create a map of dates to event counts
  const eventDates = events.reduce((acc, event) => {
    const dateStr = format(new Date(event.date_time), "yyyy-MM-dd");
    acc[dateStr] = (acc[dateStr] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get events for the selected date
  const selectedDateEvents = React.useMemo(() => {
    if (!date) return [];
    const dateStr = format(date, "yyyy-MM-dd");
    return events.filter(
      (event) => format(new Date(event.date_time), "yyyy-MM-dd") === dateStr
    );
  }, [date, events]);

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle>Event Calendar</CardTitle>
        <CardDescription>
          {date
            ? format(date, "MMMM yyyy")
            : "Select a date to view events"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border-2"
              modifiers={{
                event: (date) => {
                  const dateStr = format(date, "yyyy-MM-dd");
                  return !!eventDates[dateStr];
                },
              }}
              modifiersStyles={{
                event: {
                  fontWeight: "bold",
                  backgroundColor: "hsl(var(--primary) / 0.1)",
                  // color: "hsl(var(--primary))",
                },
              }}
            />
          </div>
          <div className="border-t md:border-t-0 md:border-l p-4 flex-1">
            <div className="space-y-4">
              <h3 className="font-medium bg-gray-100 p-2 rounded-md">
                Events on {date ? format(date, "MMMM d, yyyy") : "selected date"}
              </h3>
              {selectedDateEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No events scheduled for this date
                </p>
              ) : (
                <div className="space-y-2">
                  {selectedDateEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex flex-col border-b pb-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{event.title}</span>
                        <Badge variant="secondary">
                          {format(new Date(event.date_time), "h:mm a")}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground max-w-sm text-ellipsis overflow-hidden">{event.description}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 