import { CreateEventForm } from "./create-event-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateEventPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-0.5">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-muted-foreground hover:text-primary mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>
        <h2 className="text-2xl font-bold tracking-tight">Create Event</h2>
        <p className="text-muted-foreground">
          Fill in the details below to create a new event
        </p>
      </div>

      <CreateEventForm />
    </div>
  );
} 