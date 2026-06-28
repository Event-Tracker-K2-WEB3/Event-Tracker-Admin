import { Create, SimpleForm, TextInput, DateTimeInput, required } from "react-admin";

export const EventCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="title" label="Title" validate={required()} fullWidth />
            <TextInput source="description" label="Description" multiline rows={4} fullWidth />
            <DateTimeInput source="startDate" label="Start Date" validate={required()} fullWidth defaultValue={new Date().toISOString()}/>
            <DateTimeInput source="endDate" label="End Date" validate={required()} fullWidth  defaultValue={new Date().toISOString()}/>
            <TextInput source="location" label="Location" validate={required()} fullWidth />
        </SimpleForm>
    </Create>
);