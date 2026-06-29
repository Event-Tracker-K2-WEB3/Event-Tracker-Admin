import {
  Edit,
  required,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar,
  useRecordContext,
} from "react-admin";

import "./SpeakerForm.css";

function SpeakerEditToolbar() {
  return (
    <Toolbar className="speaker-form-toolbar">
      <SaveButton label="Save changes" />
    </Toolbar>
  );
}

function SpeakerEditTitle() {
  const record = useRecordContext();

  return (
    <span>
      Edit speaker
      {record?.name ? ` · ${record.name}` : ""}
    </span>
  );
}

export function SpeakerEdit() {
  return (
    <Edit title={<SpeakerEditTitle />} redirect="show">
      <section className="speaker-form-page">
        <div className="speaker-detail-orb speaker-detail-orb--one" />
        <div className="speaker-detail-orb speaker-detail-orb--two" />

        <div className="speaker-form-header">
          <p className="speaker-detail-eyebrow">Speaker management</p>
          <h1>Edit speaker</h1>
          <span>
            Update the speaker profile, public links, and professional
            information.
          </span>
        </div>

        <div className="speaker-form-shell">
          <SimpleForm toolbar={<SpeakerEditToolbar />}>
            <div className="speaker-form-grid">
              <section className="speaker-form-panel speaker-form-panel--large">
                <p className="speaker-panel-title">Main information</p>

                <div className="speaker-form-two-columns">
                  <TextInput
                    source="name"
                    label="Full name"
                    validate={required()}
                    fullWidth
                  />

                  <TextInput
                    source="initials"
                    label="Initials"
                    validate={required()}
                    fullWidth
                  />
                </div>

                <div className="speaker-form-two-columns">
                  <TextInput
                    source="role"
                    label="Role"
                    validate={required()}
                    fullWidth
                  />

                  <TextInput
                    source="company"
                    label="Company"
                    validate={required()}
                    fullWidth
                  />
                </div>

                <TextInput
                  source="specialty"
                  label="Specialty"
                  validate={required()}
                  fullWidth
                />

                <TextInput
                  source="bio"
                  label="Biography"
                  multiline
                  minRows={5}
                  fullWidth
                />
              </section>

              <section className="speaker-form-panel">
                <p className="speaker-panel-title">Media</p>

                <TextInput
                  source="photo"
                  label="Photo URL"
                  fullWidth
                  helperText="Example: /images/speakers/name.jpg"
                />

                <TextInput source="day" label="Day" fullWidth />

                <TextInput
                  source="sessionType"
                  label="Session type"
                  fullWidth
                />
              </section>

              <section className="speaker-form-panel">
                <p className="speaker-panel-title">External links</p>

                <TextInput source="linkedin" label="LinkedIn" fullWidth />
                <TextInput source="twitter" label="Twitter" fullWidth />
                <TextInput source="website" label="Website" fullWidth />
              </section>
            </div>
          </SimpleForm>
        </div>
      </section>
    </Edit>
  );
}