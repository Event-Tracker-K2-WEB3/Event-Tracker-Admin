import { useMemo, useState } from "react";
import {
  CreateButton,
  DeleteButton,
  EditButton,
  ListBase,
  Pagination,
  RecordContextProvider,
  ShowButton,
  useListContext,
} from "react-admin";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import GroupsIcon from "@mui/icons-material/Groups";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import SearchIcon from "@mui/icons-material/Search";
import ScheduleIcon from "@mui/icons-material/Schedule";

import "./SessionList.css";

type SessionRecord = {
  id?: string | number;
  title?: string;
  description?: string | null;
  type?: string;
  eventTitle?: string;
  roomName?: string;
  startTime?: string;
  endTime?: string;
  capacity?: number;
  live?: boolean;
  speakerCount?: number;
};

function formatDateTime(value?: string) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getRate(value: number, total: number) {
  if (total === 0) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

function isUpcomingSession(session: SessionRecord) {
  if (!session.startTime) {
    return false;
  }

  return new Date(session.startTime).getTime() > Date.now();
}

function getSpeakerLabel(count?: number) {
  const value = count || 0;

  if (value <= 1) {
    return `${value} speaker`;
  }

  return `${value} speakers`;
}

function SessionStatCard({
  icon,
  title,
  value,
  helper,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  helper: string;
  tone: "purple" | "blue" | "pink" | "cyan";
}) {
  return (
    <div className={`session-stat-card session-stat-card--${tone}`}>
      <div className="session-stat-icon">{icon}</div>

      <div>
        <p>{title}</p>
        <strong>{value}</strong>
        <span>{helper}</span>
      </div>

      <div className="session-stat-wave" />
    </div>
  );
}

function SessionListContent() {
  const { data, isLoading } = useListContext<SessionRecord>();
  const [search, setSearch] = useState("");

  const sessions = Array.isArray(data) ? data : [];

  const filteredSessions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return sessions;
    }

    return sessions.filter((session) =>
      [
        session.title,
        session.type,
        session.eventTitle,
        session.roomName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [sessions, search]);

  const totalSessions = sessions.length;
  const liveSessions = sessions.filter((session) => session.live).length;
  const upcomingSessions = sessions.filter(isUpcomingSession).length;
  const withoutSpeakerSessions = sessions.filter(
    (session) => (session.speakerCount || 0) === 0
  ).length;

  const liveRate = getRate(liveSessions, totalSessions);
  const withoutSpeakerRate = getRate(withoutSpeakerSessions, totalSessions);

  return (
    <section className="session-admin-page">
      <div className="session-page-orb session-page-orb--one" />
      <div className="session-page-orb session-page-orb--two" />

      <div className="session-page-header">
        <div>
          <p className="session-page-eyebrow">Admin resources</p>
          <h1>Sessions</h1>
          <span>
            Manage session planning, rooms, speakers, timing, and live status.
          </span>
        </div>

        <div className="session-page-actions">
          <label className="session-search">
            <SearchIcon fontSize="small" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search sessions..."
            />
          </label>

          <CreateButton label="Add Session" />
        </div>
      </div>

      <div className="session-stats-grid">
        <SessionStatCard
          icon={<EventAvailableIcon />}
          title="Total Sessions"
          value={totalSessions}
          helper="All planned sessions"
          tone="purple"
        />

        <SessionStatCard
          icon={<LiveTvIcon />}
          title="Live Sessions"
          value={liveSessions}
          helper={`${liveRate}% of total sessions`}
          tone="blue"
        />

        <SessionStatCard
          icon={<ScheduleIcon />}
          title="Upcoming Sessions"
          value={upcomingSessions}
          helper="Scheduled for later"
          tone="cyan"
        />

        <SessionStatCard
          icon={<PersonOffIcon />}
          title="Without Speaker"
          value={withoutSpeakerSessions}
          helper={`${withoutSpeakerRate}% need assignment`}
          tone="pink"
        />
      </div>

      <div className="session-table-shell">
        <div className="session-table-glow" />

        <table className="session-table">
          <thead>
            <tr>
              <th>Session</th>
              <th>Type</th>
              <th>Event</th>
              <th>Room</th>
              <th>Time</th>
              <th>Speakers</th>
              <th>Live</th>
              <th className="session-actions-column">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="session-empty-cell">
                  Loading sessions...
                </td>
              </tr>
            ) : filteredSessions.length === 0 ? (
              <tr>
                <td colSpan={8} className="session-empty-cell">
                  No sessions found.
                </td>
              </tr>
            ) : (
              filteredSessions.map((session) => (
                <RecordContextProvider key={session.id} value={session}>
                  <tr>
                    <td>
                      <div className="session-title-cell">
                        <div className="session-title-icon">
                          <GroupsIcon fontSize="small" />
                        </div>

                        <div>
                          <strong>{session.title || "Untitled session"}</strong>
                          <span>#{session.id}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="session-type-badge">
                        {session.type || "Unspecified"}
                      </span>
                    </td>

                    <td>{session.eventTitle || "—"}</td>

                    <td>{session.roomName || "—"}</td>

                    <td>
                      <div className="session-time-cell">
                        <strong>{formatDateTime(session.startTime)}</strong>
                        <span>{formatDateTime(session.endTime)}</span>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`session-speaker-pill ${
                          (session.speakerCount || 0) > 0
                            ? "is-assigned"
                            : "is-empty"
                        }`}
                      >
                        {getSpeakerLabel(session.speakerCount)}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`session-live-pill ${
                          session.live ? "is-live" : "is-offline"
                        }`}
                      >
                        {session.live ? "Live" : "Offline"}
                      </span>
                    </td>

                    <td>
                      <div className="session-row-actions">
                        <ShowButton />
                        <EditButton />
                        <DeleteButton />
                      </div>
                    </td>
                  </tr>
                </RecordContextProvider>
              ))
            )}
          </tbody>
        </table>

        <div className="session-pagination">
          <Pagination rowsPerPageOptions={[10, 25, 50]} />
        </div>
      </div>
    </section>
  );
}

export function SessionList() {
  return (
    <ListBase resource="sessions" perPage={10} sort={{ field: "id", order: "ASC" }}>
      <SessionListContent />
    </ListBase>
  );
}