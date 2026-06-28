import { useEffect, useState } from "react";
import {
  BooleanField,
  DateField,
  FunctionField,
  NumberField,
  Show,
  SimpleShowLayout,
  TextField,
  useNotify,
  useRecordContext,
  useRefresh,
} from "react-admin";

import "./SessionShow.css";

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

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("eventsync_admin_token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
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

const SpeakerAssignmentField = () => {
  const record = useRecordContext();
  const notify = useNotify();
  const refresh = useRefresh();

  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [selectedSpeakerId, setSelectedSpeakerId] = useState("");
  const [isLoadingSpeakers, setIsLoadingSpeakers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const assignedSpeakers: Speaker[] = record?.speakers || [];

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
    if (!record?.id || !selectedSpeakerId) {
      return;
    }

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
    if (!record?.id) {
      return;
    }

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
    <div className="session-show-assignment">
      <div>
        <p className="session-show-section-title">Assigned speakers</p>

        {assignedSpeakers.length === 0 ? (
          <p className="session-empty">No speakers assigned</p>
        ) : (
          <ul className="session-speaker-list">
            {assignedSpeakers.map((speaker) => (
              <li key={speaker.id} className="session-speaker-item">
                <div className="session-speaker-info">
                  <div className="session-speaker-avatar">
                    {speaker.photo ? (
                      <img src={speaker.photo} alt={speaker.name} />
                    ) : (
                      <span>
                        {speaker.initials || speaker.name.charAt(0)}
                      </span>
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
            ))}
          </ul>
        )}
      </div>

      <div>
        <p className="session-show-section-title">Assign a speaker</p>

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
      </div>
    </div>
  );
};

export const SessionShow = () => (
  <Show title="Session details">
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <TextField source="title" label="Title" />
      <TextField source="description" label="Description" />
      <TextField source="type" label="Type" />
      <TextField source="eventTitle" label="Event" />
      <TextField source="roomName" label="Room" />
      <DateField source="startTime" label="Start time" showTime />
      <DateField source="endTime" label="End time" showTime />
      <NumberField source="capacity" label="Capacity" />
      <TextField source="image" label="Image" />
      <BooleanField source="live" label="Live" />

      <FunctionField
        label="Speakers"
        render={() => <SpeakerAssignmentField />}
      />
    </SimpleShowLayout>
  </Show>
);