import {
  EditButton,
  Show,
  TopToolbar,
  useRecordContext,
} from "react-admin";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NotesIcon from "@mui/icons-material/Notes";

import "./EventForm.css";

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

const EventShowActions = () => (
  <TopToolbar>
    <EditButton />
  </TopToolbar>
);

function EventShowContent() {
  const record = useRecordContext<EventRecord>();

  if (!record) {
    return null;
  }

  const status = getEventStatus(record);

  return (
    <section className="event-detail-page">
      <div className="event-detail-orb event-detail-orb--one" />
      <div className="event-detail-orb event-detail-orb--two" />

      <div className="event-detail-hero">
        <div className="event-detail-icon">
          <EventIcon />
        </div>

        <div className="event-detail-main">
          <p className="event-detail-eyebrow">Event details</p>
          <h1>{record.title || "Untitled event"}</h1>

          <div className="event-detail-meta">
            <span>{record.location || "No location"}</span>
            <span className={`event-detail-status event-detail-status--${status.toLowerCase()}`}>
              {status}
            </span>
          </div>
        </div>
      </div>

      <div className="event-detail-grid">
        <article className="event-detail-panel event-detail-panel--large">
          <div className="event-panel-heading">
            <NotesIcon />
            <div>
              <p className="event-panel-title">Description</p>
              <span>Public event information</span>
            </div>
          </div>

          <p className="event-description">
            {record.description || "No description provided for this event."}
          </p>
        </article>

        <article className="event-detail-panel">
          <div className="event-info-row">
            <LocationOnIcon />
            <div>
              <span>Location</span>
              <strong>{record.location || "—"}</strong>
            </div>
          </div>

          <div className="event-info-row">
            <AccessTimeIcon />
            <div>
              <span>Start date</span>
              <strong>{formatDateTime(record.startDate)}</strong>
            </div>
          </div>

          <div className="event-info-row">
            <AccessTimeIcon />
            <div>
              <span>End date</span>
              <strong>{formatDateTime(record.endDate)}</strong>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

export function EventShow() {
  return (
    <Show title="Event details" actions={<EventShowActions />}>
      <EventShowContent />
    </Show>
  );
}