import { useEffect, useMemo, useState } from "react";
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
import DoorFrontIcon from "@mui/icons-material/DoorFront";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import NoMeetingRoomIcon from "@mui/icons-material/NoMeetingRoom";
import SearchIcon from "@mui/icons-material/Search";

import "./RoomList.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

type RoomRecord = {
  id?: number;
  name?: string;
};

type SessionRecord = {
  id?: number;
  roomId?: number;
  roomName?: string;
};

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("eventsync_admin_token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function getRate(value: number, total: number) {
  if (total === 0) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

function RoomStatCard({
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
    <div className={`room-stat-card room-stat-card--${tone}`}>
      <div className="room-stat-icon">{icon}</div>

      <div>
        <p>{title}</p>
        <strong>{value}</strong>
        <span>{helper}</span>
      </div>

      <div className="room-stat-wave" />
    </div>
  );
}

function RoomListContent() {
  const { data, isLoading } = useListContext<RoomRecord>();
  const [search, setSearch] = useState("");
  const [sessions, setSessions] = useState<SessionRecord[]>([]);

  const rooms = Array.isArray(data) ? data : [];

  useEffect(() => {
    async function loadSessions() {
      try {
        const response = await fetch(`${API_URL}/sessions`, {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          throw new Error("Unable to load sessions");
        }

        const result = await response.json();

        setSessions(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error("Error loading room usage:", error);
        setSessions([]);
      }
    }

    loadSessions();
  }, []);

  const roomUsageById = useMemo(() => {
    const usage = new Map<number, number>();

    sessions.forEach((session) => {
      if (!session.roomId) {
        return;
      }

      usage.set(session.roomId, (usage.get(session.roomId) || 0) + 1);
    });

    return usage;
  }, [sessions]);

  const filteredRooms = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return rooms;
    }

    return rooms.filter((room) =>
      [room.name, room.id?.toString()]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [rooms, search]);

  const totalRooms = rooms.length;

  const usedRooms = rooms.filter((room) =>
    room.id ? (roomUsageById.get(room.id) || 0) > 0 : false
  ).length;

  const unusedRooms = totalRooms - usedRooms;

  const totalAssignedSessions = sessions.filter((session) => session.roomId).length;

  const usedRate = getRate(usedRooms, totalRooms);
  const unusedRate = getRate(unusedRooms, totalRooms);

  return (
    <section className="room-admin-page">
      <div className="room-page-orb room-page-orb--one" />
      <div className="room-page-orb room-page-orb--two" />

      <div className="room-page-header">
        <div>
          <p className="room-page-eyebrow">Admin resources</p>
          <h1>Rooms</h1>
          <span>
            Manage event rooms and track how sessions are distributed across
            spaces.
          </span>
        </div>

        <div className="room-page-actions">
          <label className="room-search">
            <SearchIcon fontSize="small" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search rooms..."
            />
          </label>

          <CreateButton label="Add Room" />
        </div>
      </div>

      <div className="room-stats-grid">
        <RoomStatCard
          icon={<MeetingRoomIcon />}
          title="Total Rooms"
          value={totalRooms}
          helper="All registered rooms"
          tone="purple"
        />

        <RoomStatCard
          icon={<EventSeatIcon />}
          title="Used Rooms"
          value={usedRooms}
          helper={`${usedRate}% have sessions`}
          tone="blue"
        />

        <RoomStatCard
          icon={<NoMeetingRoomIcon />}
          title="Unused Rooms"
          value={unusedRooms}
          helper={`${unusedRate}% need planning`}
          tone="pink"
        />

        <RoomStatCard
          icon={<DoorFrontIcon />}
          title="Assigned Sessions"
          value={totalAssignedSessions}
          helper="Sessions linked to rooms"
          tone="cyan"
        />
      </div>

      <div className="room-table-shell">
        <div className="room-table-glow" />

        <table className="room-table">
          <thead>
            <tr>
              <th>Room</th>
              <th>Usage</th>
              <th>Status</th>
              <th className="room-actions-column">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="room-empty-cell">
                  Loading rooms...
                </td>
              </tr>
            ) : filteredRooms.length === 0 ? (
              <tr>
                <td colSpan={4} className="room-empty-cell">
                  No rooms found.
                </td>
              </tr>
            ) : (
              filteredRooms.map((room) => {
                const usageCount = room.id
                  ? roomUsageById.get(room.id) || 0
                  : 0;

                return (
                  <RecordContextProvider key={room.id} value={room}>
                    <tr>
                      <td>
                        <div className="room-title-cell">
                          <div className="room-title-icon">
                            <MeetingRoomIcon fontSize="small" />
                          </div>

                          <div>
                            <strong>{room.name || "Unnamed room"}</strong>
                            <span>#{room.id}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span
                          className={`room-usage-pill ${
                            usageCount > 0 ? "is-used" : "is-empty"
                          }`}
                        >
                          {usageCount <= 1
                            ? `${usageCount} session`
                            : `${usageCount} sessions`}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`room-status-pill ${
                            usageCount > 0 ? "is-used" : "is-empty"
                          }`}
                        >
                          {usageCount > 0 ? "Used" : "Unused"}
                        </span>
                      </td>

                      <td>
                        <div className="room-row-actions">
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

        <div className="room-pagination">
          <Pagination rowsPerPageOptions={[10, 25, 50]} />
        </div>
      </div>
    </section>
  );
}

export function RoomList() {
  return (
    <ListBase resource="rooms" perPage={10} sort={{ field: "id", order: "ASC" }}>
      <RoomListContent />
    </ListBase>
  );
}