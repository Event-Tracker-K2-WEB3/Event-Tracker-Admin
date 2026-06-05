import {
  BooleanField,
  DateField,
  FunctionField,
  NumberField,
  Show,
  SimpleShowLayout,
  TextField,
  useRecordContext,
} from "react-admin";

const SpeakersField = () => {
  const record = useRecordContext();

  if (!record?.speakers || record.speakers.length === 0) {
    return <span>No speakers assigned</span>;
  }

  return (
    <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
      {record.speakers.map((speaker: any) => (
        <li key={speaker.id}>
          {speaker.name} — {speaker.role}
        </li>
      ))}
    </ul>
  );
};

export const SessionShow = () => (
  <Show title="Session details">
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <TextField source="title" label="Title" />
      <TextField source="description" label="Description" />
      <TextField source="type" label="Type" />
      <TextField source="eventTitle" label="Event" />
      <TextField source="roomName" label="Room" />
      <DateField source="startTime" label="Start time" showTime />
      <DateField source="endTime" label="End time" showTime />
      <NumberField source="capacity" label="Capacity" />
      <TextField source="image" label="Image" />
      <BooleanField source="live" label="Live" />

      <FunctionField label="Speakers" render={() => <SpeakersField />} />
    </SimpleShowLayout>
  </Show>
);