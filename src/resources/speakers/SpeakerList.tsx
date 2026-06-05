import {
  Datagrid,
  DeleteButton,
  EditButton,
  FunctionField,
  List,
  ShowButton,
  TextField,
} from "react-admin";
import { Avatar, Box } from "@mui/material";

type SpeakerRecord = {
  id?: string | number;
  name?: string;
  role?: string;
  specialty?: string;
  company?: string;
  photo?: string;
  initials?: string;
};

function getInitials(record?: SpeakerRecord) {
  if (record?.initials) {
    return record.initials;
  }

  if (!record?.name) {
    return "?";
  }

  return record.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

function SpeakerAvatarField() {
  return (
    <FunctionField
      label="Profile"
      render={(record?: SpeakerRecord) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            src={record?.photo || undefined}
            alt={record?.name || "Speaker"}
            sx={{
              width: 42,
              height: 42,
              bgcolor: "#7c3aed",
              color: "#ffffff",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            {!record?.photo ? getInitials(record) : null}
          </Avatar>
        </Box>
      )}
    />
  );
}

export function SpeakerList() {
  return (
    <List title="Speakers">
      <Datagrid rowClick="show">
        <SpeakerAvatarField />
        <TextField source="name" label="Name" />
        <TextField source="role" label="Role" />
        <TextField source="specialty" label="Specialty" />
        <TextField source="company" label="Company" />
        <ShowButton />
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  );
}
