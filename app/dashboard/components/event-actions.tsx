'use client';

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2, Share } from "lucide-react";
import Link from "next/link";
import { deleteEvent } from "../actions/event";

interface EventActionsProps {
  eventId: string;
  publicSlug: string;
}

export function EventActions({ eventId, publicSlug }: EventActionsProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={handleClick}>
        <Button
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/${eventId}/edit`} className="flex items-center" onClick={handleClick}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/event/${publicSlug}`} className="flex items-center" onClick={handleClick}>
            <Share className="mr-2 h-4 w-4" />
            Share
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="text-destructive flex items-center"
          onClick={(e) => {
            e.stopPropagation();
            deleteEvent(eventId);
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 