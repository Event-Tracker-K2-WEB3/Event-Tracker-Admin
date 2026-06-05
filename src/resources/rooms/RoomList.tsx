import { List, Datagrid, TextField, EditButton, DeleteButton } from "react-admin";

export const RoomList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" label="ID" />
            <TextField source="name" label="Name" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);