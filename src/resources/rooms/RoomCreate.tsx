import {
  Create,
  required,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar,
} from "react-admin";

import "./RoomForm.css";

function RoomCreateToolbar() {
  return (
    <Toolbar className="room-form-toolbar">
      <SaveButton label="Create room" />
    </Toolbar>
  );
}

export function RoomCreate() {
  return (
    <Create title="Create room" redirect="show">
      <section className="room-form-page">
        <div className="room-detail-orb room-detail-orb--one" />
        <div className="room-detail-orb room-detail-orb--two" />

        <div className="room-form-header">
          <p className="room-detail-eyebrow">Room management</p>
          <h1>Create room</h1>
          <span>
            Add a new room that can be used when planning event sessions.
          </span>
        </div>

        <div className="room-form-shell">
          <SimpleForm toolbar={<RoomCreateToolbar />}>
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
    </Create>
  );
}