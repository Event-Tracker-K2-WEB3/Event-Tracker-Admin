import {
  DateTimeInput,
  Edit,
  required,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar,
  useRecordContext,
} from "react-admin";

import "./EventForm.css";

function EventEditToolbar() {
  return (
    <Toolbar className="event-form-toolbar">
      <SaveButton label="Save changes" />
    </Toolbar>
  );
}

function EventEditTitle() {
  const record = useRecordContext();

  return (
    <span>
      Edit event
      {record?.title ? ` · ${record.title}` : ""}
    </span>
  );
}

export function EventEdit() {
  return (
    <Edit title={<EventEditTitle />} redirect="list">
      <section className="event-form-page">
        <div className="event-detail-orb event-detail-orb--one" />
        <div className="event-detail-orb event-detail-orb--two" />

        <div className="event-form-header">
          <p className="event-detail-eyebrow">Event management</p>
          <h1>Edit event</h1>
          <span>
            Update the event public information, dates and location.
          </span>
        </div>

        <div className="event-form-shell">
          <SimpleForm toolbar={<EventEditToolbar />}>
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
    </Edit>
  );
}