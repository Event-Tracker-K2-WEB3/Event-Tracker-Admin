import {
  EditButton,
  Show,
  TopToolbar,
  useRecordContext,
} from "react-admin";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LanguageIcon from "@mui/icons-material/Language";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

import "./SpeakerForm.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

type SpeakerRecord = {
  id?: number;
  name?: string;
  role?: string;
  specialty?: string;
  company?: string;
  bio?: string | null;
  photo?: string | null;
  initials?: string;
  linkedin?: string | null;
  twitter?: string | null;
  website?: string | null;
  day?: string | null;
  sessionType?: string | null;
  sessionCount?: number;
};

function getPhotoSrc(photo?: string | null) {
  if (!photo) return undefined;
  if (photo.startsWith("http")) return photo;
  return `${API_URL}${photo}`;
}

function getInitials(record?: SpeakerRecord) {
  if (record?.initials) return record.initials;

  if (!record?.name) return "?";

  return record.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

const SpeakerShowActions = () => (
  <TopToolbar>
    <EditButton />
  </TopToolbar>
);

function SpeakerShowContent() {
  const record = useRecordContext<SpeakerRecord>();

  if (!record) {
    return null;
  }

  const photoSrc = getPhotoSrc(record.photo);
  const sessionCount = record.sessionCount || 0;

  return (
    <section className="speaker-detail-page">
      <div className="speaker-detail-orb speaker-detail-orb--one" />
      <div className="speaker-detail-orb speaker-detail-orb--two" />

      <div className="speaker-detail-hero">
        <div className="speaker-detail-avatar">
          {photoSrc ? (
            <img src={photoSrc} alt={record.name || "Speaker"} />
          ) : (
            <span>{getInitials(record)}</span>
          )}
        </div>

        <div className="speaker-detail-main">
          <p className="speaker-detail-eyebrow">Speaker profile</p>
          <h1>{record.name || "Unnamed speaker"}</h1>

          <div className="speaker-detail-meta">
            <span>{record.role || "No role"}</span>
            <span>{record.company || "No company"}</span>
            <span>{record.specialty || "No specialty"}</span>
          </div>
        </div>

        <div className="speaker-detail-session-card">
          <EventAvailableIcon />
          <div>
            <strong>{sessionCount}</strong>
            <span>{sessionCount <= 1 ? "Session" : "Sessions"}</span>
          </div>
        </div>
      </div>

      <div className="speaker-detail-grid">
        <article className="speaker-detail-panel speaker-detail-panel--large">
          <p className="speaker-panel-title">Biography</p>
          <p className="speaker-bio-text">
            {record.bio || "No biography provided for this speaker."}
          </p>
        </article>

        <article className="speaker-detail-panel">
          <p className="speaker-panel-title">Professional information</p>

          <div className="speaker-info-list">
            <div>
              <span>Role</span>
              <strong>{record.role || "—"}</strong>
            </div>

            <div>
              <span>Company</span>
              <strong>{record.company || "—"}</strong>
            </div>

            <div>
              <span>Specialty</span>
              <strong>{record.specialty || "—"}</strong>
            </div>

            <div>
              <span>Preferred day</span>
              <strong>{record.day || "—"}</strong>
            </div>

            <div>
              <span>Session type</span>
              <strong>{record.sessionType || "—"}</strong>
            </div>
          </div>
        </article>

        <article className="speaker-detail-panel">
          <p className="speaker-panel-title">External links</p>

          <div className="speaker-links-list">
            {record.linkedin ? (
              <a href={record.linkedin} target="_blank" rel="noreferrer">
                <LinkedInIcon fontSize="small" />
                LinkedIn
              </a>
            ) : null}

            {record.twitter ? (
              <a href={record.twitter} target="_blank" rel="noreferrer">
                <AlternateEmailIcon fontSize="small" />
                Twitter
              </a>
            ) : null}

            {record.website ? (
              <a href={record.website} target="_blank" rel="noreferrer">
                <LanguageIcon fontSize="small" />
                Website
              </a>
            ) : null}

            {!record.linkedin && !record.twitter && !record.website ? (
              <p className="speaker-muted">No external links provided.</p>
            ) : null}
          </div>
        </article>
      </div>
    </section>
  );
}

export function SpeakerShow() {
  return (
    <Show title="Speaker details" actions={<SpeakerShowActions />}>
      <SpeakerShowContent />
    </Show>
  );
}