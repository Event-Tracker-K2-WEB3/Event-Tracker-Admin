import {
  Create,
  DateTimeInput,
  required,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar,
} from "react-admin";

import "./EventForm.css";

function EventCreateToolbar() {
  return (
    <Toolbar className="event-form-toolbar">
      <SaveButton label="Create event" />
    </Toolbar>
  );
}

export function EventCreate() {
  return (
    <Create title="Create event" redirect="list">
      <section className="event-form-page">
        <div className="event-detail-orb event-detail-orb--one" />
        <div className="event-detail-orb event-detail-orb--two" />

        <div className="event-form-header">
          <p className="event-detail-eyebrow">Event management</p>
          <h1>Create event</h1>
          <span>
            Add a new event with its public information, dates and location.
          </span>
        </div>

        <div className="event-form-shell">
          <SimpleForm toolbar={<EventCreateToolbar />}>
            <div className="event-form-grid">
              <section className="event-form-panel event-form-panel--large">
                <p className="event-panel-title">Main information</p>

                <TextInput
                  source="title"
                  label="Title"
                  validate={required()}
                  fullWidth
                />

                <TextInput
                  source="description"
                  label="Description"
                  multiline
                  minRows={6}
                  fullWidth
                />

                <TextInput
                  source="location"
                  label="Location"
                  validate={required()}
                  fullWidth
                />
              </section>

              <section className="event-form-panel">
                <p className="event-panel-title">Schedule</p>

                <DateTimeInput
                  source="startDate"
                  label="Start date"
                  validate={required()}
                  fullWidth
                />

                <DateTimeInput
                  source="endDate"
                  label="End date"
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