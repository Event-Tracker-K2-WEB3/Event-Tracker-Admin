import { Edit, SimpleForm, TextInput, required } from "react-admin";

export function SpeakerEdit() {
  return (
    <Edit title="Edit speaker">
      <SimpleForm>
        <TextInput source="name" label="Name" validate={required()} fullWidth />
        <TextInput source="role" label="Role" validate={required()} fullWidth />
        <TextInput source="specialty" label="Specialty" fullWidth />
        <TextInput source="company" label="Company" fullWidth />

        <TextInput source="bio" label="Bio" multiline rows={5} fullWidth />

        <TextInput source="photo" label="Photo URL" fullWidth />
        <TextInput source="initials" label="Initials" fullWidth />

        <TextInput source="linkedin" label="LinkedIn" fullWidth />
        <TextInput source="twitter" label="Twitter" fullWidth />
        <TextInput source="website" label="Website" fullWidth />

        <TextInput source="day" label="Day" fullWidth />
        <TextInput source="sessionType" label="Session type" fullWidth />
      </SimpleForm>
    </Edit>
  );
}
