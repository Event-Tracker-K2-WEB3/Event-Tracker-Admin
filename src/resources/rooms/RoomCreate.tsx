import { Create, SimpleForm, TextInput, required } from "react-admin";

export const RoomCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="name" label="Name" validate={required()} fullWidth />
        </SimpleForm>
    </Create>
);