import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;
  if (!accessToken) return NextResponse.json({ error: "Not connected" }, { status: 401 });

  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 8);
  const query = new URLSearchParams({ timeMin: start.toISOString(), timeMax: end.toISOString(), singleEvents: "true", orderBy: "startTime", maxResults: "30" });
  const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?${query}`, { headers: { Authorization: `Bearer ${accessToken}` }, cache: "no-store" });
  if (!response.ok) return NextResponse.json({ error: "Could not fetch Google Calendar events" }, { status: response.status });

  const calendar = await response.json();
  const events = (calendar.items || []).map((event) => {
    const eventStart = event.start.dateTime || event.start.date;
    return {
      time: event.start.dateTime ? new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit" }).format(new Date(eventStart)) : "All day",
      title: event.summary || "Untitled event",
      team: event.organizer?.displayName || "Google Calendar",
      icon: "●",
      tone: "blue",
      people: (event.attendees || []).map((attendee) => attendee.displayName || attendee.email).slice(0, 3),
    };
  });
  return NextResponse.json({ events });
}
