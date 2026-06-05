import {
    List,
    Datagrid,
    TextField,
    DateField,
    EditButton,
    DeleteButton,
    TextInput,
    DateInput,
} from "react-admin";

const EventFilters = [
    <TextInput source="q" label="Search" alwaysOn />,
    <DateInput source="date" label="Date" />,
    <TextInput source="location" label="Location" />,
];

export const EventList = () => (
    <List filters={EventFilters}>
        <Datagrid rowClick="edit">
            <TextField source="title" label="Title" />
            <TextField source="description" label="Description" />
            <DateField source="startDate" label="Start Date" showTime />
            <DateField source="endDate" label="End Date" showTime />
            <TextField source="location" label="Location" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);