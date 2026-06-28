import { useEffect, useState } from "react";
import {
  EditButton,
  Show,
  TopToolbar,
  useNotify,
  useRecordContext,
  useRefresh,
} from "react-admin";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventIcon from "@mui/icons-material/Event";
import GroupsIcon from "@mui/icons-material/Groups";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";

import "./SessionForm.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

type Speaker = {
  id: number;
  name: string;
  role: string;
  specialty?: string;
  company?: string;
  photo?: string | null;
  initials?: string;
};

type SessionRecord = {
  id?: number;
  title?: string;
  description?: string | null;
  type?: string;
  image?: string | null;
  startTime?: string;
  endTime?: string;
  capacity?: number;
  eventId?: string;
  eventTitle?: string;
  roomId?: number;
  roomName?: string;
  live?: boolean;
  speakerCount?: number;
  speakers?: Speaker[];
};

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("eventsync_admin_token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function formatDateTime(value?: string) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getPhotoSrc(photo?: string | null) {
  if (!photo) return undefined;
  if (photo.startsWith("http")) return photo;
  return `${API_URL}${photo}`;
}

function getInitials(speaker?: Speaker) {
  if (speaker?.initials) return speaker.initials;
  if (!speaker?.name) return "?";

  return speaker.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

async function requestSessionSpeakerAssignment(
  sessionId: number,
  speakerId: number,
  method: "POST" | "DELETE"
) {
  const response = await fetch(
    `${API_URL}/sessions/${sessionId}/speakers/${speakerId}`,
    {
      method,
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Unable to update speaker assignment");
  }

  const text = await response.text();

  if (!text) {
    return null;
  }

  return JSON.parse(text);
}

const SessionShowActions = () => (
  <TopToolbar>
    <EditButton />
  </TopToolbar>
);

function SpeakerAssignmentPanel() {
  const record = useRecordContext<SessionRecord>();
  const notify = useNotify();
  const refresh = useRefresh();

  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [selectedSpeakerId, setSelectedSpeakerId] = useState("");
  const [isLoadingSpeakers, setIsLoadingSpeakers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const assignedSpeakers = record?.speakers || [];
  const assignedSpeakerIds = new Set(
    assignedSpeakers.map((speaker) => speaker.id)
  );

  const availableSpeakers = speakers.filter(
    (speaker) => !assignedSpeakerIds.has(speaker.id)
  );

  useEffect(() => {
    async function loadSpeakers() {
      try {
        setIsLoadingSpeakers(true);

        const response = await fetch(`${API_URL}/speakers`, {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          throw new Error("Unable to load speakers");
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setSpeakers(data);
        } else if (Array.isArray(data.content)) {
          setSpeakers(data.content);
        } else {
          setSpeakers([]);
        }
      } catch (error) {
        console.error("Error loading speakers:", error);
        notify("Unable to load speakers", { type: "error" });
      } finally {
        setIsLoadingSpeakers(false);
      }
    }

    loadSpeakers();
  }, [notify]);

  const handleAssignSpeaker = async () => {
    if (!record?.id || !selectedSpeakerId) return;

    try {
      setIsSubmitting(true);

      await requestSessionSpeakerAssignment(
        record.id,
        Number(selectedSpeakerId),
        "POST"
      );

      notify("Speaker assigned successfully", { type: "success" });
      setSelectedSpeakerId("");
      refresh();
    } catch (error) {
      console.error("Error assigning speaker:", error);
      notify("Unable to assign speaker", { type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveSpeaker = async (speakerId: number) => {
    if (!record?.id) return;

    try {
      setIsSubmitting(true);

      await requestSessionSpeakerAssignment(record.id, speakerId, "DELETE");

      notify("Speaker removed successfully", { type: "success" });
      refresh();
    } catch (error) {
      console.error("Error removing speaker:", error);
      notify("Unable to remove speaker", { type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <article className="session-detail-panel session-detail-panel--large">
      <div className="session-panel-header">
        <div>
          <p className="session-panel-title">Speakers assignment</p>
          <span>Assign or remove speakers linked to this session.</span>
        </div>

        <PersonAddAltIcon />
      </div>

      {assignedSpeakers.length === 0 ? (
        <p className="session-muted">No speakers assigned yet.</p>
      ) : (
        <ul className="session-speaker-list">
          {assignedSpeakers.map((speaker) => {
            const photoSrc = getPhotoSrc(speaker.photo);

            return (
              <li key={speaker.id} className="session-speaker-item">
                <div className="session-speaker-info">
                  <div className="session-speaker-avatar">
                    {photoSrc ? (
                      <img src={photoSrc} alt={speaker.name} />
                    ) : (
                      <span>{getInitials(speaker)}</span>
                    )}
                  </div>

                  <div>
                    <strong>{speaker.name}</strong>
                    <span>
                      {speaker.role}
                      {speaker.company ? ` · ${speaker.company}` : ""}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="session-remove-button"
                  onClick={() => handleRemoveSpeaker(speaker.id)}
                  disabled={isSubmitting}
                >
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="session-assignment-form">
        <select
          className="session-assignment-select"
          value={selectedSpeakerId}
          onChange={(event) => setSelectedSpeakerId(event.target.value)}
          disabled={isLoadingSpeakers || isSubmitting}
        >
          <option value="">
            {isLoadingSpeakers ? "Loading speakers..." : "Select a speaker"}
          </option>

          {availableSpeakers.map((speaker) => (
            <option key={speaker.id} value={speaker.id}>
              {speaker.name} — {speaker.role}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="session-assign-button"
          onClick={handleAssignSpeaker}
          disabled={!selectedSpeakerId || isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Assign speaker"}
        </button>
      </div>
    </article>
  );
}

function SessionShowContent() {
  const record = useRecordContext<SessionRecord>();

  if (!record) {
    return null;
  }

  return (
    <section className="session-detail-page">
      <div className="session-detail-orb session-detail-orb--one" />
      <div className="session-detail-orb session-detail-orb--two" />

      <div className="session-detail-hero">
        <div className="session-detail-icon">
          <GroupsIcon />
        </div>

        <div className="session-detail-main">
          <p className="session-detail-eyebrow">Session details</p>
          <h1>{record.title || "Untitled session"}</h1>

          <div className="session-detail-meta">
            <span>{record.type || "No type"}</span>
            <span>{record.eventTitle || "No event"}</span>
            <span>{record.roomName || "No room"}</span>
            <span className={record.live ? "is-live" : ""}>
              {record.live ? "Live" : "Offline"}
            </span>
          </div>
        </div>

        <div className="session-detail-count-card">
          <strong>{record.speakerCount || 0}</strong>
          <span>{(record.speakerCount || 0) <= 1 ? "Speaker" : "Speakers"}</span>
        </div>
      </div>

      <div className="session-detail-grid">
        <article className="session-detail-panel">
          <p className="session-panel-title">Description</p>
          <p className="session-description">
            {record.description || "No description provided for this session."}
          </p>
        </article>

        <article className="session-detail-panel">
          <div className="session-info-row">
            <EventIcon />
            <div>
              <span>Event</span>
              <strong>{record.eventTitle || "—"}</strong>
            </div>
          </div>

          <div className="session-info-row">
            <MeetingRoomIcon />
            <div>
              <span>Room</span>
              <strong>{record.roomName || "—"}</strong>
            </div>
          </div>

          <div className="session-info-row">
            <AccessTimeIcon />
            <div>
              <span>Start</span>
              <strong>{formatDateTime(record.startTime)}</strong>
            </div>
          </div>

          <div className="session-info-row">
            <AccessTimeIcon />
            <div>
              <span>End</span>
              <strong>{formatDateTime(record.endTime)}</strong>
            </div>
          </div>
        </article>

        <SpeakerAssignmentPanel />
      </div>
    </section>
  );
}

export function SessionShow() {
  return (
    <Show title="Session details" actions={<SessionShowActions />}>
      <SessionShowContent />
    </Show>
  );
}