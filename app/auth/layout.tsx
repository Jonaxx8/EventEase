import Link from "next/link";
import { Calendar, Clock, Users, MapPin, Music, PartyPopper, Utensils } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
        <div className="container max-w-screen-2xl mx-auto flex h-16 items-center px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            <span className="font-semibold text-xl">EventEase</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex mt-16">
        {/* Left Side - Illustration */}
        <div className="hidden lg:flex w-1/2 bg-black/5 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full max-w-2xl aspect-square p-8">
              {/* Calendar Icon - Center */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-full shadow-lg">
                <Calendar className="w-20 h-20 text-black" strokeWidth={1.5} />
              </div>
              
              {/* Floating Icons */}
              <div className="absolute top-1/4 left-1/4 bg-white p-4 rounded-full shadow-md animate-float-slow">
                <Users className="w-8 h-8 text-black" strokeWidth={1.5} />
              </div>
              
              <div className="absolute top-1/4 right-1/4 bg-white p-4 rounded-full shadow-md animate-float-medium">
                <Music className="w-8 h-8 text-black" strokeWidth={1.5} />
              </div>
              
              <div className="absolute bottom-1/4 left-1/4 bg-white p-4 rounded-full shadow-md animate-float-fast">
                <Utensils className="w-8 h-8 text-black" strokeWidth={1.5} />
              </div>
              
              <div className="absolute bottom-1/4 right-1/4 bg-white p-4 rounded-full shadow-md animate-float-medium">
                <MapPin className="w-8 h-8 text-black" strokeWidth={1.5} />
              </div>
              
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 bg-white p-4 rounded-full shadow-md animate-float-slow">
                <Clock className="w-8 h-8 text-black" strokeWidth={1.5} />
              </div>
              
              <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 bg-white p-4 rounded-full shadow-md animate-float-fast">
                <PartyPopper className="w-8 h-8 text-black" strokeWidth={1.5} />
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-12 text-center bg-gradient-to-t from-white via-white/90 to-transparent">
            <div className="max-w-md mx-auto space-y-4">
              <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-black to-neutral-600">
                Streamline Your Event Management
              </h2>
              <div className="h-1 w-20 bg-black mx-auto rounded-full"></div>
              <p className="text-lg text-neutral-600 leading-relaxed">
                Plan, organize, and execute events with ease
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="flex-1 flex items-center justify-center px-4 py-8 lg:w-1/2">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <div className="container max-w-screen-2xl mx-auto px-4">
          <p>© {new Date().getFullYear()} EventEase. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 