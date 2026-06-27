import { useEffect, useMemo, useState } from "react";
import "./AdminDashboard.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

type DashboardChartPoint = {
  date: string;
  label: string;
  sessions: number;
};

type DashboardSessionSummary = {
  id: number;
  title: string;
  type: string;
  startTime: string;
  endTime: string;
  eventId: string;
  eventTitle: string;
  roomId: number;
  roomName: string;
  capacity: number;
  live: boolean;
};

type DashboardSpeakerSummary = {
  id: number;
  name: string;
  role: string;
  company: string;
  specialty: string;
  photo: string | null;
  initials: string;
};

type DashboardResponse = {
  totalEvents: number;
  totalSessions: number;
  totalSpeakers: number;
  totalRooms: number;
  liveSessions: number;
  sessionsByDay: DashboardChartPoint[];
  upcomingSessions: DashboardSessionSummary[];
  latestSessions: DashboardSessionSummary[];
  latestSpeakers: DashboardSpeakerSummary[];
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getToken() {
  return localStorage.getItem("eventsync_admin_token");
}

function KpiCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: number;
  helper: string;
}) {
  return (
    <article className="dashboard-kpi-card">
      <div>
        <p>{label}</p>
        <strong>{value.toLocaleString("en-US")}</strong>
        <span>{helper}</span>
      </div>
      <div className="dashboard-kpi-glow" />
    </article>
  );
}

function SessionsLineChart({ data }: { data: DashboardChartPoint[] }) {
  const points = useMemo(() => {
    const max = Math.max(...data.map((item) => item.sessions), 1);
    const width = 640;
    const height = 220;
    const paddingX = 34;
    const paddingY = 34;

    return data.map((item, index) => {
      const x =
        paddingX +
        (index * (width - paddingX * 2)) / Math.max(data.length - 1, 1);

      const y =
        height -
        paddingY -
        (item.sessions * (height - paddingY * 2)) / max;

      return {
        ...item,
        x,
        y,
      };
    });
  }, [data]);

  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const areaPath =
    points.length > 0
      ? `${path} L ${points[points.length - 1].x} 190 L ${points[0].x} 190 Z`
      : "";

  return (
    <section className="dashboard-panel dashboard-chart-panel">
      <div className="dashboard-panel-header">
        <div>
          <p className="dashboard-eyebrow">Analytics</p>
          <h2>Sessions overview</h2>
        </div>
        <span className="dashboard-pill">Last 7 days</span>
      </div>

      <svg className="dashboard-chart" viewBox="0 0 640 220" role="img">
        <defs>
          <linearGradient id="sessionsGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(139, 92, 246, 0.42)" />
            <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
          </linearGradient>
        </defs>

        <path className="dashboard-chart-area" d={areaPath} />
        <path className="dashboard-chart-line" d={path} />

        {points.map((point) => (
          <g key={point.date}>
            <circle cx={point.x} cy={point.y} r="5" className="dashboard-chart-dot" />
            <text x={point.x} y="212" textAnchor="middle" className="dashboard-chart-label">
              {point.label}
            </text>
            <text
              x={point.x}
              y={point.y - 12}
              textAnchor="middle"
              className="dashboard-chart-value"
            >
              {point.sessions}
            </text>
          </g>
        ))}
      </svg>
    </section>
  );
}

function SessionMiniCard({ session }: { session: DashboardSessionSummary }) {
  return (
    <article className="dashboard-session-card">
      <div>
        <h3>{session.title}</h3>
        <p>{session.eventTitle}</p>
        <span>{session.roomName} · {formatDateTime(session.startTime)}</span>
      </div>

      <span className={session.live ? "dashboard-status live" : "dashboard-status"}>
        {session.live ? "Live" : session.type}
      </span>
    </article>
  );
}

function SpeakerRow({ speaker }: { speaker: DashboardSpeakerSummary }) {
  return (
    <div className="dashboard-speaker-row">
      <div className="dashboard-avatar">
        {speaker.photo ? (
          <img src={speaker.photo} alt={speaker.name} />
        ) : (
          <span>{speaker.initials}</span>
        )}
      </div>

      <div>
        <strong>{speaker.name}</strong>
        <p>{speaker.role} · {speaker.company}</p>
      </div>

      <span>{speaker.specialty}</span>
    </div>
  );
}

export function AdminDashboard() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const token = getToken();

        const response = await fetch(`${API_URL}/admin/dashboard`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!response.ok) {
          throw new Error(`Dashboard request failed with status ${response.status}`);
        }

        const data: DashboardResponse = await response.json();
        setDashboard(data);
      } catch (error) {
        console.error("Error loading admin dashboard:", error);
        setErrorMessage("Unable to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-loading-card">
          <div className="dashboard-spinner" />
          <h1>Loading dashboard</h1>
          <p>Fetching admin statistics...</p>
        </div>
      </main>
    );
  }

  if (errorMessage || !dashboard) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-error-card">
          <h1>Dashboard unavailable</h1>
          <p>{errorMessage}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <section className="dashboard-hero">
        <div>
          <p className="dashboard-eyebrow">Admin workspace</p>
          <h1>EventSync Admin</h1>
          <p>
            Manage events, rooms, speakers, and sessions from one dynamic dashboard.
          </p>
        </div>

        <div className="dashboard-hero-badge">
          <span>{dashboard.liveSessions}</span>
          <p>Live sessions now</p>
        </div>
      </section>

      <section className="dashboard-kpi-grid">
        <KpiCard
          label="Total events"
          value={dashboard.totalEvents}
          helper="Created events"
        />
        <KpiCard
          label="Total sessions"
          value={dashboard.totalSessions}
          helper="Scheduled sessions"
        />
        <KpiCard
          label="Total speakers"
          value={dashboard.totalSpeakers}
          helper="Registered speakers"
        />
        <KpiCard
          label="Total rooms"
          value={dashboard.totalRooms}
          helper="Available rooms"
        />
      </section>

      <section className="dashboard-main-grid">
        <SessionsLineChart data={dashboard.sessionsByDay} />

        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <p className="dashboard-eyebrow">Schedule</p>
              <h2>Upcoming sessions</h2>
            </div>
          </div>

          <div className="dashboard-list">
            {dashboard.upcomingSessions.length > 0 ? (
              dashboard.upcomingSessions.map((session) => (
                <SessionMiniCard key={session.id} session={session} />
              ))
            ) : (
              <p className="dashboard-empty">No upcoming sessions.</p>
            )}
          </div>
        </section>
      </section>

      <section className="dashboard-bottom-grid">
        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <p className="dashboard-eyebrow">Recently added</p>
              <h2>Latest sessions</h2>
            </div>
          </div>

          <div className="dashboard-list">
            {dashboard.latestSessions.map((session) => (
              <SessionMiniCard key={session.id} session={session} />
            ))}
          </div>
        </section>

        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <p className="dashboard-eyebrow">People</p>
              <h2>Latest speakers</h2>
            </div>
          </div>

          <div className="dashboard-speaker-list">
            {dashboard.latestSpeakers.map((speaker) => (
              <SpeakerRow key={speaker.id} speaker={speaker} />
            ))}
          </div>
        </section>

        <section className="dashboard-panel dashboard-live-panel">
          <div className="dashboard-live-orb">
            <span>{dashboard.liveSessions}</span>
          </div>

          <h2>Live sessions</h2>
          <p>
            {dashboard.liveSessions > 0
              ? "Some sessions are currently live."
              : "No live sessions right now."}
          </p>
        </section>
      </section>
    </main>
  );
}