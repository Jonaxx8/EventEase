'use client';

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "@/app/auth/actions/auth";

export function LogoutButton() {
  return (
    <form action={signOut}>
      <Button variant="ghost" size="icon" onClick={() => signOut()}>
        <LogOut className="h-5 w-5" />
      </Button>
    </form>
  );
} 