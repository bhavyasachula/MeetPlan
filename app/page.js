"use client";

import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

const meetings = [
  { time: "09:30 AM", title: "Design Review", team: "Team Sync", icon: "📹", people: ["SK", "AM"], tone: "green" },
  { time: "11:00 AM", title: "Product Demo", team: "Acme Corporation", icon: "●", people: ["JM"], tone: "blue" },
  { time: "02:30 PM", title: "Interview – UX Designer", team: "Hiring Team", icon: "T", people: ["RS"], tone: "purple" },
  { time: "04:00 PM", title: "Sales Call", team: "Global Solutions", icon: "📹", people: ["AV", "KW"], tone: "green" },
];

const nav = [
  ["⌘", "Dashboard"], ["□", "Meetings"], ["▣", "Calendar"], ["◷", "Availability"],
  ["♧", "Meeting Types"], ["♙", "Contacts"], ["▥", "Analytics"], ["⌘", "Integrations"],
  ["♙", "Team"], ["▤", "Billing"], ["⚙", "Settings"],
];

function prettyTime(dateString) {
  return new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit" }).format(new Date(dateString));
}

function EventIcon({ item }) {
  return <span className={`event-icon ${item.tone || "green"}`}>{item.icon || "●"}</span>;
}

function Avatar({ name, index = 0 }) {
  const swatches = ["peach", "ink", "sand", "rose"];
  return <span className={`avatar ${swatches[index % swatches.length]}`}>{name.slice(0, 2)}</span>;
}

function EventRow({ item, dense = false }) {
  return <div className={`event-row ${dense ? "dense" : ""}`}>
    <div className="event-time"><strong>{item.time}</strong><span>Today</span></div>
    <EventIcon item={item} />
    <div className="event-info"><strong>{item.title}</strong><span>{item.team || "Google Calendar"}</span></div>
    {!dense && <div className="attendees">{(item.people || ["GC"]).slice(0, 2).map((p, index) => <Avatar key={p} name={p} index={index} />)}{(item.people || []).length > 2 && <span className="more-people">+{item.people.length - 2}</span>}</div>}
    {!dense && <button className="join">Join</button>}
    <button className="dots" aria-label="More options">⋮</button>
  </div>;
}

function Calendar() {
  const year = 2025, month = 4, days = new Date(year, month + 1, 0).getDate();
  const start = new Date(year, month, 1).getDay();
  const cells = Array.from({ length: 42 }, (_, i) => i - start + 1);
  return <aside className="calendar-card">
    <div className="month-head"><h3>May 2025</h3><div><button>‹</button><button>›</button></div></div>
    <div className="week-labels">{["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(d => <span key={d}>{d}</span>)}</div>
    <div className="calendar-grid">{cells.map((date, i) => {
      const inactive = date < 1 || date > days;
      const shown = date < 1 ? 27 + date : date > days ? date - days : date;
      const marked = [5, 8, 13, 16, 20, 21, 22, 27, 29].includes(date);
      return <span key={i} className={`${inactive ? "inactive" : ""} ${date === 20 ? "selected" : ""} ${marked ? "marked" : ""}`}>{shown}</span>;
    })}</div>
    <button className="calendar-link">▣ <span>View full calendar</span></button>
  </aside>;
}

function MeetingTypes() {
  const types = [[<img src="https://cdn-icons-png.flaticon.com/512/5346/5346453.png"></img>, "30 Min Consultation", "30 mins · One-on-One", "green"], [<img src="https://cdn-icons-png.flaticon.com/512/5346/5346453.png"></img> , "60 Min Strategy Call", "60 mins · One-on-One", "orange"], [<img src="https://cdn-icons-png.flaticon.com/512/482/482478.png " ></img>, "Quick Demo", "30 mins · Group", "blue"], [	<img src="https://cdn-icons-png.flaticon.com/512/511/511587.png"></img>, "Interview Session", "45 mins · One-on-One", "pink"]];
  return <section className="types-section"><div className="section-title"><h2>Your Meeting Types</h2><button>Manage all</button></div><div className="type-grid">{types.map(([icon, title, subtitle, tone]) => <article className="type-card" key={title}><span className={`type-icon ${tone}`}>{icon}</span><strong>{title}</strong><small>{subtitle}</small><footer><button>▱ &nbsp; Copy link</button><button className="dots">⋮</button></footer></article>)}</div></section>;
}

function Dashboard() {
  const { data: session, status } = useSession();     
  const [eventList, setEventList] = useState(meetings);
  const [loadingEvents, setLoadingEvents] = useState(false);  
  const connected = status === "authenticated";

  useEffect(() => {
    if (!connected) return;
    setLoadingEvents(true);
    fetch("/api/calendar/events").then(r => r.ok ? r.json() : Promise.reject()).then(data => {
      if (data.events?.length) setEventList(data.events);
    }).catch(() => { }).finally(() => setLoadingEvents(false));
  }, [connected]);

  const name = session?.user?.name?.split(" ")[0] || "Alex";
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-icon">✓</span><strong>MeetPlan</strong></div>
      <nav>{nav.map(([icon, label], index) => <button className={index === 0 ? "active" : ""} key={label}><i>{icon}</i><span>{label}</span></button>)}</nav>
      <div className="upgrade"><div className="upgrade-art"><img src="/image.png" alt="Calendar and plant illustration" /></div><strong>Upgrade to Pro</strong><p>Unlock advanced features and<br />grow your business.</p><button>Upgrade Now</button></div>
      <div className="account"><span className="account-avatar">A</span><div><strong>Account</strong><small>Starter Plan</small></div><span>⌄</span></div>
    </aside>
    <main>
      <header className="topbar"><label className="search">⌕ <input placeholder="Search meetings, contacts, etc..." /><kbd>⌘ K</kbd></label><div className="header-actions"><button className="connect" onClick={() => connected ? signOut() : signIn("google")}>{connected ? "Disconnect Calendar" : "Connect Google Calendar"}</button><button className="bell">♧<b>3</b></button><span className="profile">{name[0]}<i /></span></div></header>
      <div className="content-grid">
        <div className="center-content">
          <section className="welcome"><div><p>Good Morning,</p><h1>Welcome back! <span>👋</span></h1><small>You have <em>{eventList.length}</em> meetings today.</small></div><div className="city"><img src="/good-morning-city.png" alt="City skyline illustration" /></div></section>
          <section className="stats">{[[<img src="https://cdn-icons-png.flaticon.com/512/3239/3239948.png"></img>, "Upcoming Meetings", eventList.length, "12%", "green"], [<img src="https://cdn-icons-png.flaticon.com/512/511/511587.png"></img>, "Pending Invitations", "3", "8%", "orange"], [<img src="https://cdn-icons-png.flaticon.com/512/2088/2088617.png"></img>, "Hours Booked", "24.5", "18%", "green"], [<img src="https://cdn-icons-png.flaticon.com/512/2529/2529396.png"></img>, "Revenue", "₹24,680", "15%", "orange"]].map(([icon, label, num, growth, tone]) => <article key={label}><span className={`stat-icon ${tone}`}>{icon}</span><small>{label}</small><strong>{num}</strong><em>↑ {growth} <i>vs {label === "Hours Booked" ? "last week" : label === "Revenue" ? "last month" : "yesterday"}</i></em></article>)}</section>
          <section className="meetings-section"><div className="section-title"><h2>Upcoming Meetings</h2><button>View all</button></div><div className="meeting-list">{loadingEvents && <p className="loading">Syncing Google Calendar…</p>}{eventList.slice(0, 4).map((item, index) => <EventRow item={item} key={`${item.title}-${index}`} />)}</div></section>
          <MeetingTypes />
        </div>
        <div className="right-content"><Calendar /><section className="schedule"><div className="section-title"><h2>Today’s Schedule</h2><button>See full day</button></div><div className="schedule-list">{eventList.slice(0, 4).map((item, index) => <EventRow item={item} dense key={`${item.title}-${index}`} />)}</div><button className="new-meeting">＋ New Meeting</button></section></div>
      </div>
    </main>
    <nav className="bottom-nav">{nav.slice(0, 5).map(([icon, label], i) => <button key={label} className={i === 0 ? "active" : ""}><i>{icon}</i><span>{label}</span></button>)}</nav>
  </div>;
}

export default function Home() { return <Dashboard />; }
