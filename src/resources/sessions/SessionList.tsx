import {
  BooleanField,
  Datagrid,
  DateField,
  DeleteButton,
  EditButton,
  List,
  NumberField,
  ShowButton,
  TextField,
} from "react-admin";

export const SessionList = () => (
  <List title="Sessions">
    <Datagrid rowClick="show">
      <TextField source="id" label="ID" />
      <TextField source="title" label="Title" />
      <TextField source="type" label="Type" />
      <TextField source="eventTitle" label="Event" />
      <TextField source="roomName" label="Room" />
      <DateField source="startTime" label="Start time" showTime />
      <DateField source="endTime" label="End time" showTime />
      <NumberField source="capacity" label="Capacity" />
      <BooleanField source="live" label="Live" />
      <ShowButton />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);