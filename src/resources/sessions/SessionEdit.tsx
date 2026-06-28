import {
  DateTimeInput,
  Edit,
  NumberInput,
  ReferenceInput,
  required,
  SaveButton,
  SelectInput,
  SimpleForm,
  TextInput,
  Toolbar,
  useRecordContext,
} from "react-admin";

import "./SessionForm.css";

function SessionEditToolbar() {
  return (
    <Toolbar className="session-form-toolbar">
      <SaveButton label="Save changes" />
    </Toolbar>
  );
}

function SessionEditTitle() {
  const record = useRecordContext();

  return (
    <span>
      Edit session
      {record?.title ? ` · ${record.title}` : ""}
    </span>
  );
}

export function SessionEdit() {
  return (
    <Edit title={<SessionEditTitle />} redirect="show">
      <section className="session-form-page">
        <div className="session-detail-orb session-detail-orb--one" />
        <div className="session-detail-orb session-detail-orb--two" />

        <div className="session-form-header">
          <p className="session-detail-eyebrow">Session management</p>
          <h1>Edit session</h1>
          <span>
            Update the schedule, room, event, capacity and session information.
          </span>
        </div>

        <div className="session-form-shell">
          <SimpleForm toolbar={<SessionEditToolbar />}>
            <div className="session-form-grid">
              <section className="session-form-panel session-form-panel--large">
                <p className="session-panel-title">Main information</p>

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
                  minRows={5}
                  fullWidth
                />

                <div className="session-form-two-columns">
                  <TextInput
                    source="type"
                    label="Type"
                    validate={required()}
                    fullWidth
                  />

                  <NumberInput source="capacity" label="Capacity" fullWidth />
                </div>

                <TextInput
                  source="image"
                  label="Image URL"
                  fullWidth
                  helperText="Example: /images/sessions/session-name.jpg"
                />
              </section>

              <section className="session-form-panel">
                <p className="session-panel-title">Planning</p>

                <DateTimeInput
                  source="startTime"
                  label="Start time"
                  validate={required()}
                  fullWidth
                />

                <DateTimeInput
                  source="endTime"
                  label="End time"
                  validate={required()}
                  fullWidth
                />
              </section>

              <section className="session-form-panel">
                <p className="session-panel-title">Relations</p>

                <ReferenceInput source="eventId" reference="events">
                  <SelectInput
                    optionText="title"
                    label="Event"
                    validate={required()}
                    fullWidth
                  />
                </ReferenceInput>

                <ReferenceInput source="roomId" reference="rooms">
                  <SelectInput optionText="name" label="Room" fullWidth />
                </ReferenceInput>
              </section>
            </div>
          </SimpleForm>
        </div>
      </section>
    </Edit>
  );
}