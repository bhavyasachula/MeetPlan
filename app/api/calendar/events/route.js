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
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const detail = errorBody?.error?.message || "Google Calendar rejected the request.";
    return NextResponse.json({ error: detail, code: errorBody?.error?.status || "CALENDAR_REQUEST_FAILED" }, { status: response.status });
  }

  const calendar = await response.json();
  const today = new Date();
  const isSameDay = (date) => date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate();
  const events = (calendar.items || []).map((event) => {
    const eventStart = event.start.dateTime || event.start.date;
    const startDate = new Date(event.start.dateTime || `${event.start.date}T00:00:00`);
    const conference = `${event.conferenceData?.conferenceSolution?.name || ""} ${(event.conferenceData?.entryPoints || []).map((entry) => entry.uri).join(" ")}`.toLowerCase();
    const icon = conference.includes("teams") ? 3 : conference.includes("zoom") ? 2 : conference.includes("meet") ? 1 : "●";
    return {
      time: event.start.dateTime ? new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit" }).format(new Date(eventStart)) : "All day",
      title: event.summary || "Untitled event",
      team: event.organizer?.displayName || "Google Calendar",
      icon,
      tone: "blue",
      isToday: isSameDay(startDate),
      dateLabel: isSameDay(startDate) ? "Today" : new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" }).format(startDate),
      people: (event.attendees || []).map((attendee) => attendee.displayName || attendee.email).slice(0, 3),
    };
  });
  return NextResponse.json({ events });
}
