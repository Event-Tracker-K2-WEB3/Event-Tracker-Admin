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
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import SearchIcon from "@mui/icons-material/Search";

import "./SpeakerList.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

type SpeakerRecord = {
  id?: string | number;
  name?: string;
  role?: string;
  specialty?: string;
  company?: string;
  photo?: string | null;
  initials?: string;
  sessionCount?: number;
};

function getInitials(record?: SpeakerRecord) {
  if (record?.initials) {
    return record.initials;
  }

  if (!record?.name) {
    return "?";
  }

  return record.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

function getPhotoSrc(photo?: string | null) {
  if (!photo) {
    return undefined;
  }

  if (photo.startsWith("http")) {
    return photo;
  }

  return `${API_URL}${photo}`;
}

function getSessionLabel(count?: number) {
  const value = count || 0;

  if (value <= 1) {
    return `${value} session`;
  }

  return `${value} sessions`;
}

function getRate(value: number, total: number) {
  if (total === 0) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

function SpeakerStatCard({
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
    <div className={`speaker-stat-card speaker-stat-card--${tone}`}>
      <div className="speaker-stat-icon">{icon}</div>

      <div>
        <p>{title}</p>
        <strong>{value}</strong>
        <span>{helper}</span>
      </div>

      <div className="speaker-stat-wave" />
    </div>
  );
}

function SpeakerListContent() {
  const { data, isLoading } = useListContext<SpeakerRecord>();
  const [search, setSearch] = useState("");

  const speakers = Array.isArray(data) ? data : [];

  const filteredSpeakers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return speakers;
    }

    return speakers.filter((speaker) =>
      [
        speaker.name,
        speaker.role,
        speaker.specialty,
        speaker.company,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [speakers, search]);

  const totalSpeakers = speakers.length;

  const assignedSpeakers = speakers.filter(
    (speaker) => (speaker.sessionCount || 0) > 0
  ).length;

  const unassignedSpeakers = totalSpeakers - assignedSpeakers;

  const assignedRate = getRate(assignedSpeakers, totalSpeakers);
  const unassignedRate = getRate(unassignedSpeakers, totalSpeakers);

  const specialitiesCovered = new Set(
    speakers
      .map((speaker) => speaker.specialty?.trim())
      .filter(Boolean)
  ).size;

  return (
    <section className="speaker-admin-page">
      <div className="speaker-page-orb speaker-page-orb--one" />
      <div className="speaker-page-orb speaker-page-orb--two" />

      <div className="speaker-page-header">
        <div>
          <p className="speaker-page-eyebrow">Admin resources</p>
          <h1>Speakers</h1>
          <span>
            Manage speaker profiles, specialities, and session participation.
          </span>
        </div>

        <div className="speaker-page-actions">
          <label className="speaker-search">
            <SearchIcon fontSize="small" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search speakers..."
            />
          </label>

          <CreateButton label="Add Speaker" />
        </div>
      </div>

      <div className="speaker-stats-grid">
        <SpeakerStatCard
          icon={<GroupsIcon />}
          title="Total Speakers"
          value={totalSpeakers}
          helper="All registered speakers"
          tone="purple"
        />

        <SpeakerStatCard
          icon={<EventAvailableIcon />}
          title="Assigned Speakers"
          value={assignedSpeakers}
          helper={`${assignedRate}% of total speakers`}
          tone="blue"
        />

        <SpeakerStatCard
          icon={<PersonOffIcon />}
          title="Unassigned Speakers"
          value={unassignedSpeakers}
          helper={`${unassignedRate}% of total speakers`}
          tone="pink"
        />

        <SpeakerStatCard
          icon={<AutoAwesomeIcon />}
          title="Specialities Covered"
          value={specialitiesCovered}
          helper="Across all speakers"
          tone="cyan"
        />
      </div>

      <div className="speaker-table-shell">
        <div className="speaker-table-glow" />

        <table className="speaker-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Specialty</th>
              <th>Company</th>
              <th>Sessions</th>
              <th className="speaker-actions-column">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="speaker-empty-cell">
                  Loading speakers...
                </td>
              </tr>
            ) : filteredSpeakers.length === 0 ? (
              <tr>
                <td colSpan={6} className="speaker-empty-cell">
                  No speakers found.
                </td>
              </tr>
            ) : (
              filteredSpeakers.map((speaker) => (
                <RecordContextProvider key={speaker.id} value={speaker}>
                  <tr>
                    <td>
                      <div className="speaker-profile-cell">
                        <div className="speaker-avatar">
                          {speaker.photo ? (
                            <img
                              src={getPhotoSrc(speaker.photo)}
                              alt={speaker.name || "Speaker"}
                            />
                          ) : (
                            <span>{getInitials(speaker)}</span>
                          )}
                        </div>

                        <div>
                          <strong>{speaker.name || "Unnamed speaker"}</strong>
                          <span>#{speaker.id}</span>
                        </div>
                      </div>
                    </td>

                    <td>{speaker.role || "—"}</td>

                    <td>
                      <span className="speaker-specialty-badge">
                        {speaker.specialty || "Unspecified"}
                      </span>
                    </td>

                    <td>{speaker.company || "—"}</td>

                    <td>
                      <span
                        className={`speaker-session-pill ${
                          (speaker.sessionCount || 0) > 0
                            ? "is-assigned"
                            : "is-empty"
                        }`}
                      >
                        {getSessionLabel(speaker.sessionCount)}
                      </span>
                    </td>

                    <td>
                      <div className="speaker-row-actions">
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

        <div className="speaker-pagination">
          <Pagination rowsPerPageOptions={[10, 25, 50]} />
        </div>
      </div>
    </section>
  );
}

export function SpeakerList() {
  return (
    <ListBase resource="speakers" perPage={10} sort={{ field: "id", order: "ASC" }}>
      <SpeakerListContent />
    </ListBase>
  );
}