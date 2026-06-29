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
import EventBusyIcon from "@mui/icons-material/EventBusy";
import EventIcon from "@mui/icons-material/Event";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";

import "./EventList.css";

type EventRecord = {
  id?: string | number;
  title?: string;
  description?: string | null;
  startDate?: string;
  endDate?: string;
  location?: string;
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

function getEventStatus(event: EventRecord) {
  const now = Date.now();
  const start = event.startDate ? new Date(event.startDate).getTime() : null;
  const end = event.endDate ? new Date(event.endDate).getTime() : null;

  if (start && end && start <= now && end >= now) {
    return "Live";
  }

  if (start && start > now) {
    return "Upcoming";
  }

  if (end && end < now) {
    return "Past";
  }

  return "Unknown";
}

function getRate(value: number, total: number) {
  if (total === 0) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

function EventStatCard({
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
    <div className={`event-stat-card event-stat-card--${tone}`}>
      <div className="event-stat-icon">{icon}</div>

      <div>
        <p>{title}</p>
        <strong>{value}</strong>
        <span>{helper}</span>
      </div>

      <div className="event-stat-wave" />
    </div>
  );
}

function EventListContent() {
  const { data, isLoading } = useListContext<EventRecord>();
  const [search, setSearch] = useState("");

  const events = Array.isArray(data) ? data : [];

  const filteredEvents = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return events;
    }

    return events.filter((event) =>
      [event.title, event.description, event.location]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [events, search]);

  const totalEvents = events.length;

  const liveEvents = events.filter(
    (event) => getEventStatus(event) === "Live"
  ).length;

  const upcomingEvents = events.filter(
    (event) => getEventStatus(event) === "Upcoming"
  ).length;

  const pastEvents = events.filter(
    (event) => getEventStatus(event) === "Past"
  ).length;

  const liveRate = getRate(liveEvents, totalEvents);
  const upcomingRate = getRate(upcomingEvents, totalEvents);

  return (
    <section className="event-admin-page">
      <div className="event-page-orb event-page-orb--one" />
      <div className="event-page-orb event-page-orb--two" />

      <div className="event-page-header">
        <div>
          <p className="event-page-eyebrow">Admin resources</p>
          <h1>Events</h1>
          <span>
            Manage event programs, dates, locations and public visibility.
          </span>
        </div>

        <div className="event-page-actions">
          <label className="event-search">
            <SearchIcon fontSize="small" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search events..."
            />
          </label>

          <CreateButton label="Add Event" />
        </div>
      </div>

      <div className="event-stats-grid">
        <EventStatCard
          icon={<EventIcon />}
          title="Total Events"
          value={totalEvents}
          helper="All registered events"
          tone="purple"
        />

        <EventStatCard
          icon={<LiveTvIcon />}
          title="Live Events"
          value={liveEvents}
          helper={`${liveRate}% currently active`}
          tone="blue"
        />

        <EventStatCard
          icon={<EventAvailableIcon />}
          title="Upcoming Events"
          value={upcomingEvents}
          helper={`${upcomingRate}% scheduled later`}
          tone="cyan"
        />

        <EventStatCard
          icon={<EventBusyIcon />}
          title="Past Events"
          value={pastEvents}
          helper="Already completed"
          tone="pink"
        />
      </div>

      <div className="event-table-shell">
        <div className="event-table-glow" />

        <table className="event-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Location</th>
              <th>Start date</th>
              <th>End date</th>
              <th>Status</th>
              <th className="event-actions-column">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="event-empty-cell">
                  Loading events...
                </td>
              </tr>
            ) : filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={6} className="event-empty-cell">
                  No events found.
                </td>
              </tr>
            ) : (
              filteredEvents.map((event) => {
                const status = getEventStatus(event);

                return (
                  <RecordContextProvider key={event.id} value={event}>
                    <tr>
                      <td>
                        <div className="event-title-cell">
                          <div className="event-title-icon">
                            <EventIcon fontSize="small" />
                          </div>

                          <div>
                            <strong>{event.title || "Untitled event"}</strong>
                            <span>#{event.id}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="event-location-cell">
                          <LocationOnIcon fontSize="small" />
                          <span>{event.location || "—"}</span>
                        </div>
                      </td>

                      <td>{formatDateTime(event.startDate)}</td>
                      <td>{formatDateTime(event.endDate)}</td>

                      <td>
                        <span
                          className={`event-status-pill event-status-pill--${status.toLowerCase()}`}
                        >
                          {status}
                        </span>
                      </td>

                      <td>
                        <div className="event-row-actions">
                          <ShowButton />
                          <EditButton />
                          <DeleteButton />
                        </div>
                      </td>
                    </tr>
                  </RecordContextProvider>
                );
              })
            )}
          </tbody>
        </table>

        <div className="event-pagination">
          <Pagination rowsPerPageOptions={[10, 25, 50]} />
        </div>
      </div>
    </section>
  );
}

export function EventList() {
  return (
    <ListBase resource="events" perPage={10} sort={{ field: "startDate", order: "ASC" }}>
      <EventListContent />
    </ListBase>
  );
}