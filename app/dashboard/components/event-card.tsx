'use client';

import { Calendar, MapPin, Link as LinkIcon } from "lucide-react";
import { EventActions } from "./event-actions";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";

interface Event {
    id: string;
    title: string;
    date_time: string;
    location?: string;
    public_slug: string;
    description?: string;
}

export function EventCard({ event }: { event: Event }) {
    const [isOpen, setIsOpen] = useState(false);
    const shareableLink = `${process.env.NEXT_PUBLIC_APP_URL}/event/${event.public_slug}`;

    const copyLink = async () => {
      await navigator.clipboard.writeText(shareableLink);
      setIsOpen(false);
      toast.success('Link copied to clipboard');
    };

    return (
      <>
        <Card key={event.id} className="group cursor-pointer" onClick={() => setIsOpen(true)}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h3 className="font-semibold line-clamp-1">
                  {event.title}
                </h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  {format(new Date(event.date_time), "EEEE, MMMM d, yyyy 'at' h:mm a")}
                </div>
                {event.location && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-2 h-4 w-4" />
                    {event.location}
                  </div>
                )}
              </div>
              <EventActions eventId={event.id} publicSlug={event.public_slug} />
            </div>
          </CardContent>
        </Card>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{event.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center text-sm">
                <Calendar className="mr-2 h-4 w-4" />
                {format(new Date(event.date_time), "EEEE, MMMM d, yyyy 'at' h:mm a")}
              </div>
              {event.location && (
                <div className="flex items-center text-sm">
                  <MapPin className="mr-2 h-4 w-4" />
                  {event.location}
                </div>
              )}
              {event.description && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">About</h4>
                  <p className="text-sm text-muted-foreground">
                    {event.description}
                  </p>
                </div>
              )}
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2">Share with attendees</h4>
                <div className="flex gap-2">
                  <Input 
                    value={shareableLink}
                    readOnly
                    className="flex-1"
                  />
                  <Button onClick={copyLink} size="sm">
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
}