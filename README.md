# EventEase

EventEase is a modern event management platform built with Next.js and Supabase, designed to simplify the process of creating, managing, and sharing events. Whether you're organizing corporate meetings, social gatherings, or community events, EventEase provides a seamless experience for both organizers and attendees.

## Features

### User Management & Roles
- **Role-based Access Control**
  - Admin: Full system access and user management
  - Event Owner: Event management and basic user role assignment
  - User: Basic access for viewing and RSVP capabilities

### Event Management
- **Intuitive Event Creation**
  - Easy-to-use form for creating new events
  - Support for event title, description, date/time, and location
  - Customizable event settings

- **Event Dashboard**
  - Calendar view of all events
  - List view with detailed event information
  - Quick access to event management tools
  - Real-time event updates

### Analytics & Insights
- **Event Performance Metrics**
  - Total events overview
  - Attendee tracking
  - Upcoming events counter
  - RSVP analytics

### Sharing & Collaboration
- **Event Sharing**
  - Unique public links for each event
  - Easy-to-copy shareable URLs
  - Public event pages for non-registered users

### User Interface
- **Modern Design**
  - Clean and intuitive interface
  - Responsive layout for all devices
  - Dark/light mode support
  - Interactive calendar view

### Security
- **Authentication & Authorization**
  - Secure user authentication
  - Role-based permissions
  - Protected API endpoints
  - Secure data handling

## Technology Stack

- **Frontend**
  - Next.js (App Router)
  - Tailwind CSS
  - shadcn/ui components

- **Backend**
  - Supabase (Database & Authentication)
  - Next.js API Routes
  - Server-side rendering

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/eventease.git
cd eventease
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with the following variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=your_app_url
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.


