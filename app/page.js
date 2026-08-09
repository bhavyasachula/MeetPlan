"use client";

import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

const meetings = [
  {
    time: "09:30 AM",
    title: "Design Review",
    team: "Team Sync",
    icon: 1,
    people: ["SK", "AM"],
    tone: "green",
  },
  {
    time: "11:00 AM",
    title: "Product Demo",
    team: "Acme Corporation",
    icon: 2,
    people: ["JM"],
    tone: "blue",
  },
  {
    time: "02:30 PM",
    title: "Interview – UX Designer",
    team: "Hiring Team",
    icon: 3,
    people: ["RS"],
    tone: "purple",
  },
  {
    time: "04:00 PM",
    title: "Sales Call",
    team: "Global Solutions",
    icon: 4,
    people: ["AV", "KW"],
    tone: "green",
  },
];

const nav = [
  [
    <img src="https://cdn-icons-png.flaticon.com/512/609/609503.png"></img>,
    "Dashboard",
  ],
  [
    <img src="https://cdn-icons-png.flaticon.com/512/1250/1250599.png"></img>,
    "Meetings",
  ],
  [
    <img src="https://cdn-icons-png.flaticon.com/512/1250/1250599.png"></img>,
    "Calendar",
  ],
  [
    <img src="https://cdn-icons-png.flaticon.com/512/2088/2088617.png"></img>,
    "Availability",
  ],
  [
    <img src="https://cdn-icons-png.flaticon.com/512/4557/4557570.png"></img>,
    "Meeting Types",
  ],
  [
    <img src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png"></img>,
    "Contacts",
  ],
  [
    <img src="https://cdn-icons-png.flaticon.com/512/4440/4440475.png"></img>,
    "Analytics",
  ],
  [
    <img src="   https://cdn-icons-png.flaticon.com/512/7758/7758132.png "></img>,
    "Integrations",
  ],
  [
    <img src="https://cdn-icons-png.flaticon.com/512/511/511587.png"></img>,
    "Team",
  ],
  [
    <img src="https://cdn-icons-png.flaticon.com/512/4492/4492772.png"></img>,
    "Billing",
  ],
  [
    <img src="https://cdn-icons-png.flaticon.com/512/3524/3524636.png"></img>,
    "Settings",
  ],
];

function prettyTime(dateString) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

function EventIcon({ item }) {
  const logoByMeeting = {
    1: { src: "/googlemeet.png", alt: "Google Meet" },
    2: { src: "/zoomlogo.png", alt: "Zoom" },
    3: { src: "/microsoftteeams.png", alt: "Microsoft Teams" },
    4: { src: "/googlemeet.png", alt: "Google Meet" },
  };
  const logo = logoByMeeting[item.icon];
  return (
    <span className={`event-icon ${item.tone || "green"}`}>
      {logo ? (
        <img src={logo.src} alt={logo.alt} />
      ) : (
        <img src="https://cdn-icons-png.flaticon.com/512/511/511587.png"></img>
      )}
    </span>
  );
}

function Avatar({ name, index = 0 }) {
  const swatches = ["peach", "ink", "sand", "rose"];
  return (
    <span className={`avatar ${swatches[index % swatches.length]}`}>
      {name.slice(0, 2)}
    </span>
  );
}

function EventRow({ item, dense = false }) {
  return (
    <div className={`event-row ${dense ? "dense" : ""}`}>
      <div className="event-time">
        <strong>{item.time}</strong>
        <span>{item.dateLabel || "Today"}</span>
      </div>
      <EventIcon item={item} />
      <div className="event-info">
        <strong>{item.title}</strong>
        <span>{item.team || "Google Calendar"}</span>
      </div>
      {!dense && (
        <div className="attendees">
          {(item.people || ["GC"]).slice(0, 2).map((p, index) => (
            <Avatar key={p} name={p} index={index} />
          ))}
          {(item.people || []).length > 2 && (
            <span className="more-people">+{item.people.length - 2}</span>
          )}
        </div>
      )}
      {!dense && <button className="join">Join</button>}
      <button className="dots" aria-label="More options">
        ⋮
      </button>
    </div>
  );
}

function Calendar() {
  const year = 2025,
    month = 4,
    days = new Date(year, month + 1, 0).getDate();
  const start = new Date(year, month, 1).getDay();
  const cells = Array.from({ length: 42 }, (_, i) => i - start + 1);
  return (
    <aside className="calendar-card">
      <div className="month-head">
        <h3>May 2025</h3>
        <div>
          <button>‹</button>
          <button>›</button>
        </div>
      </div>
      <div className="week-labels">
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="calendar-grid">
        {cells.map((date, i) => {
          const inactive = date < 1 || date > days;
          const shown = date < 1 ? 27 + date : date > days ? date - days : date;
          const marked = [5, 8, 13, 16, 20, 21, 22, 27, 29].includes(date);
          return (
            <span
              key={i}
              className={`${inactive ? "inactive" : ""} ${date === 20 ? "selected" : ""} ${marked ? "marked" : ""}`}
            >
              {shown}
            </span>
          );
        })}
      </div>
      <button className="calendar-link">
        <img src="https://cdn-icons-png.flaticon.com/512/1250/1250599.png"></img>{" "}
        <span>View full calendar</span>
      </button>
    </aside>
  );
}

function MeetingTypes() {
  const types = [
    [
      <img src="https://cdn-icons-png.flaticon.com/512/5346/5346453.png"></img>,
      "30 Min Consultation",
      "30 mins · One-on-One",
      "green",
    ],
    [
      <img src="https://cdn-icons-png.flaticon.com/512/5346/5346453.png"></img>,
      "60 Min Strategy Call",
      "60 mins · One-on-One",
      "orange",
    ],
    [
      <img src="https://cdn-icons-png.flaticon.com/512/482/482478.png "></img>,
      "Quick Demo",
      "30 mins · Group",
      "blue",
    ],
    [
      <img src="https://cdn-icons-png.flaticon.com/512/511/511587.png"></img>,
      "Interview Session",
      "45 mins · One-on-One",
      "pink",
    ],
  ];
  return (
    <section className="types-section">
      <div className="section-title">
        <h2>Your Meeting Types</h2>
        <button>Manage all</button>
      </div>
      <div className="type-grid">
        {types.map(([icon, title, subtitle, tone]) => (
          <article className="type-card" key={title}>
            <span className={`type-icon ${tone}`}>{icon}</span>
            <strong>{title}</strong>
            <small>{subtitle}</small>
            <footer>
              <button>
                <img src="https://cdn-icons-png.flaticon.com/512/126/126498.png"></img>{" "}
                Copy link
              </button>
              <button className="dots">⋮</button>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}

function Dashboard() {
  const { data: session, status } = useSession();
  const [eventList, setEventList] = useState(meetings);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [calendarError, setCalendarError] = useState("");
  const connected = status === "authenticated";

  useEffect(() => {
    if (!connected) {
      setEventList(meetings);
      setCalendarError("");
      return;
    }
    setLoadingEvents(true);
    setCalendarError("");
    fetch("/api/calendar/events")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error || "Could not load your calendar");
        return data;
      })
      .then((data) => {
        setEventList(data.events || []);
      })
      .catch((error) => {
        setEventList([]);
        setCalendarError(error.message);
      })
      .finally(() => setLoadingEvents(false));
  }, [connected]);

  const name = session?.user?.name?.split(" ")[0] || "Alex";
  const todayEvents = connected
    ? eventList.filter((event) => event.isToday)
    : eventList;
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">
            <img src="https://cdn-icons-png.flaticon.com/512/1250/1250599.png"></img>
          </span>
          <strong>MeetPlan</strong>
        </div>
        <nav>
          {nav.map(([icon, label], index) => (
            <button className={index === 0 ? "active" : ""} key={label}>
              <i>{icon}</i>
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="upgrade">
          <div className="upgrade-art">
            <img src="/image.png" alt="Calendar and plant illustration" />
          </div>
          <strong>Upgrade to Pro</strong>
          <p>
            Unlock advanced features and
            <br/>
            grow your business.
          </p>
          <button>Upgrade Now</button>
        </div>
        <div className="account">
          <span className="account-avatar">A</span>
          <div>
            <strong>Account</strong>
            <small>Starter Plan</small>
          </div>
          <span>⌄</span>
        </div>
      </aside>
      <main>
        <header className="topbar">
          <label className="search">
            ⌕ <input placeholder="Search meetings, contacts, etc..." />
            <kbd>⌘ K</kbd>
          </label>
          <div className="header-actions">
            <button
              className="connect"
              onClick={() => (connected ? signOut() : signIn("google"))}
            >
              {connected ? "Disconnect Calendar" : "Connect Google Calendar"}
            </button>
            <button className="bell">
              <img src="https://cdn-icons-png.flaticon.com/512/2529/2529521.png"></img>
              <b>3</b>
            </button>
            <span className="profile">
              {name[0]}
              <i />
            </span>
          </div>
        </header>
        <div className="content-grid">
          <div className="center-content">
            <section className="welcome">
              <div>
                <p>Good Morning,</p>
                <h1>
                  Welcome back! <span>👋</span>
                </h1>
                <small>
                  You have <em>{todayEvents.length}</em> meetings today.
                </small>
              </div>
              <div className="city">
                <img
                  src="/good-morning-city.png"
                  alt="City skyline illustration"
                />
              </div>
            </section>
            <section className="stats">
              {[
                [
                  <img src="https://cdn-icons-png.flaticon.com/512/3239/3239948.png"></img>,
                  "Upcoming Meetings",
                  eventList.length,
                  "12%",
                  "green",
                ],
                [
                  <img src="https://cdn-icons-png.flaticon.com/512/511/511587.png"></img>,
                  "Pending Invitations",
                  "3",
                  "8%",
                  "orange",
                ],
                [
                  <img src="https://cdn-icons-png.flaticon.com/512/2088/2088617.png"></img>,
                  "Hours Booked",
                  "24.5",
                  "18%",
                  "green",
                ],
                [
                  <img src="https://cdn-icons-png.flaticon.com/512/2529/2529396.png"></img>,
                  "Revenue",
                  "₹24,680",
                  "15%",
                  "orange",
                ],
              ].map(([icon, label, num, growth, tone]) => (
                <article key={label}>
                  <span className={`stat-icon ${tone}`}>{icon}</span>
                  <small>{label}</small>
                  <strong>{num}</strong>
                  <em>
                    ↑ {growth}{" "}
                    <i>
                      vs{" "}
                      {label === "Hours Booked"
                        ? "last week"
                        : label === "Revenue"
                          ? "last month"
                          : "yesterday"}
                    </i>
                  </em>
                </article>
              ))}
            </section>
            <section className="meetings-section">
              <div className="section-title">
                <h2>Upcoming Meetings</h2>
                <button>View all</button>
              </div>
              <div className="meeting-list">
                {loadingEvents && (
                  <p className="loading">Syncing Google Calendar…</p>
                )}
                {calendarError && (
                  <p className="calendar-message">{calendarError}</p>
                )}
                {connected &&
                  !loadingEvents &&
                  !calendarError &&
                  eventList.length === 0 && (
                    <p className="calendar-message">
                      No calendar events in the next 7 days.
                    </p>
                  )}
                {eventList.slice(0, 4).map((item, index) => (
                  <EventRow item={item} key={`${item.title}-${index}`} />
                ))}
              </div>
            </section>
            <MeetingTypes />
          </div>
          <div className="right-content">
            <Calendar />
            <section className="schedule">
              <div className="section-title">
                <h2>Today’s Schedule</h2>
                <button>See full day</button>
              </div>
              <div className="schedule-list">
                {connected &&
                  !loadingEvents &&
                  !calendarError &&
                  todayEvents.length === 0 && (
                    <p className="calendar-message">No meetings today.</p>
                  )}
                {todayEvents.slice(0, 4).map((item, index) => (
                  <EventRow item={item} dense key={`${item.title}-${index}`} />
                ))}
              </div>
              <button className="new-meeting">＋ New Meeting</button>
            </section>
          </div>
        </div>
      </main>
      <nav className="bottom-nav">
        {nav.slice(0, 5).map(([icon, label], i) => (
          <button key={label} className={i === 0 ? "active" : ""}>
            <i>{icon}</i>
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default function Home() {
  return <Dashboard />;
}
