import {
  Edit,
  required,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar,
  useRecordContext,
} from "react-admin";

import "./RoomForm.css";

function RoomEditToolbar() {
  return (
    <Toolbar className="room-form-toolbar">
      <SaveButton label="Save changes" />
    </Toolbar>
  );
}

function RoomEditTitle() {
  const record = useRecordContext();

  return (
    <span>
      Edit room
      {record?.name ? ` · ${record.name}` : ""}
    </span>
  );
}

export function RoomEdit() {
  return (
    <Edit title={<RoomEditTitle />} redirect="show">
      <section className="room-form-page">
        <div className="room-detail-orb room-detail-orb--one" />
        <div className="room-detail-orb room-detail-orb--two" />

        <div className="room-form-header">
          <p className="room-detail-eyebrow">Room management</p>
          <h1>Edit room</h1>
          <span>
            Update the room name used in the session planning system.
          </span>
        </div>

        <div className="room-form-shell">
          <SimpleForm toolbar={<RoomEditToolbar />}>
            <div className="room-form-grid">
              <section className="room-form-panel room-form-panel--large">
                <p className="room-panel-title">Main information</p>

                <TextInput
                  source="name"
                  label="Room name"
                  validate={required()}
                  fullWidth
                />
              </section>
            </div>
          </SimpleForm>
        </div>
      </section>
    </Edit>
  );
}