import {
  EditButton,
  Show,
  TopToolbar,
  useRecordContext,
} from "react-admin";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import NotesIcon from "@mui/icons-material/Notes";

import "./RoomForm.css";

type RoomRecord = {
  id?: number;
  name?: string;
};

const RoomShowActions = () => (
  <TopToolbar>
    <EditButton />
  </TopToolbar>
);

function RoomShowContent() {
  const record = useRecordContext<RoomRecord>();

  if (!record) {
    return null;
  }

  return (
    <section className="room-detail-page">
      <div className="room-detail-orb room-detail-orb--one" />
      <div className="room-detail-orb room-detail-orb--two" />

      <div className="room-detail-hero">
        <div className="room-detail-icon">
          <MeetingRoomIcon />
        </div>

        <div className="room-detail-main">
          <p className="room-detail-eyebrow">Room details</p>
          <h1>{record.name || "Unnamed room"}</h1>

          <div className="room-detail-meta">
            <span>Room ID #{record.id}</span>
            <span>Physical or logical event space</span>
          </div>
        </div>
      </div>

      <div className="room-detail-grid">
        <article className="room-detail-panel room-detail-panel--large">
          <div className="room-panel-heading">
            <NotesIcon />
            <div>
              <p className="room-panel-title">Room information</p>
              <span>Basic room data used for session planning</span>
            </div>
          </div>

          <div className="room-info-list">
            <div>
              <span>ID</span>
              <strong>{record.id || "—"}</strong>
            </div>

            <div>
              <span>Name</span>
              <strong>{record.name || "—"}</strong>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

export function RoomShow() {
  return (
    <Show title="Room details" actions={<RoomShowActions />}>
      <RoomShowContent />
    </Show>
  );
}