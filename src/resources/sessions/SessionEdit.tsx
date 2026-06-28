import {
  DateTimeInput,
  Edit,
  NumberInput,
  ReferenceInput,
  required,
  SelectInput,
  SimpleForm,
  TextInput,
  useRecordContext,
} from "react-admin";

const sessionTypeChoices = [
  { id: "Conference", name: "Conference" },
  { id: "Workshop", name: "Workshop" },
  { id: "Panel", name: "Panel" },
  { id: "Q&A", name: "Q&A" },
];

const SessionTitle = () => {
  const record = useRecordContext();

  return <span>{record ? `Edit session: ${record.title}` : "Edit session"}</span>;
};

export const SessionEdit = () => (
  <Edit title={<SessionTitle />} redirect="list">
    <SimpleForm>
      <TextInput source="title" label="Title" validate={required()} fullWidth />

      <TextInput
        source="description"
        label="Description"
        multiline
        minRows={4}
        fullWidth
      />

      <SelectInput
        source="type"
        label="Type"
        choices={sessionTypeChoices}
        validate={required()}
      />

      <DateTimeInput
        source="startTime"
        label="Start time"
        validate={required()}
      />

      <DateTimeInput
        source="endTime"
        label="End time"
        validate={required()}
      />

      <NumberInput source="capacity" label="Capacity" />

      <TextInput source="image" label="Image path" fullWidth />

      <ReferenceInput source="eventId" reference="events" label="Event">
        <SelectInput optionText="title" validate={required()} />
      </ReferenceInput>

      <ReferenceInput source="roomId" reference="rooms" label="Room">
        <SelectInput optionText="name" validate={required()} />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
);