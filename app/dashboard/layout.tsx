import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { LogoutButton } from "./components/logout-button";

async function DashboardNav() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="border-b bg-white">
      <div className="container max-w-screen-2xl mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            <span className="font-semibold text-xl">EventEase</span>
          </Link>
          {/* <nav className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">My Events</Button>
            </Link>
          </nav> */}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden sm:block">
            {user?.email}
          </span>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <>
      <DashboardNav />
      <main className="flex-1 container max-w-screen-2xl mx-auto py-8 px-4">
        {children}
      </main>
    </>
  );
} 