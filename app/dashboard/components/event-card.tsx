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
import { Role } from "@/enums/role";

interface Event {
    id: string;
    title: string;
    date_time: string;
    location?: string;
    public_slug: string;
    description?: string;
    owner_id: string;
}

interface EventCardProps {
    event: Event;
    userRole: string;
    isOwner: boolean;
}

export function EventCard({ event, userRole, isOwner }: EventCardProps) {
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
    const eventUrl = `${process.env.NEXT_PUBLIC_APP_URL}/event/${event.public_slug}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(eventUrl);
        toast.success("Link copied to clipboard");
    };

    // Allow event owners to manage any event, and owners to manage their own events
    const canManageEvent = userRole === Role.ADMIN || userRole === Role.EVENT_OWNER || isOwner;

    return (
        <Card className="group relative">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h3 className="font-semibold leading-none">{event.title}</h3>
                        <p className="text-sm text-muted-foreground flex items-center">
                            <Calendar className="mr-1 h-4 w-4" />
                            {format(new Date(event.date_time), "PPP p")}
                        </p>
                        {event.location && (
                            <p className="text-sm text-muted-foreground flex items-center">
                                <MapPin className="mr-1 h-4 w-4" />
                                {event.location}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsShareDialogOpen(true)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <LinkIcon className="h-4 w-4" />
                        </Button>
                        {canManageEvent && (
                            <EventActions eventId={event.id} publicSlug={event.public_slug} />
                        )}
                    </div>
                </div>
            </CardContent>

            <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Share Event</DialogTitle>
                    </DialogHeader>
                    <div className="flex gap-2">
                        <Input value={eventUrl} readOnly />
                        <Button onClick={handleCopyLink}>Copy</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </Card>
    );
}