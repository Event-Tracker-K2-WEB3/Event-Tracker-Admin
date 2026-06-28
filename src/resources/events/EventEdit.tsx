import { Edit, SimpleForm, TextInput, DateTimeInput, required } from "react-admin";

export const EventEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="title" label="Title" validate={required()} fullWidth />
            <TextInput source="description" label="Description" multiline rows={4} fullWidth />
            <DateTimeInput source="startDate" label="Start Date" validate={required()} fullWidth />
            <DateTimeInput source="endDate" label="End Date" validate={required()} fullWidth />
            <TextInput source="location" label="Location" validate={required()} fullWidth />
        </SimpleForm>
    </Edit>
);