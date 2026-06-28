import {
  FunctionField,
  Show,
  SimpleShowLayout,
  TextField,
  UrlField,
} from "react-admin";
import { Avatar, Box } from "@mui/material";

type SpeakerRecord = {
  id?: string | number;
  name?: string;
  role?: string;
  specialty?: string;
  company?: string;
  bio?: string;
  photo?: string;
  initials?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  day?: string;
  sessionType?: string;
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

export function SpeakerShow() {
  return (
    <Show title="Speaker details">
      <SimpleShowLayout>
        <FunctionField
          label="Profile"
          render={(record?: SpeakerRecord) => (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                src={record?.photo || undefined}
                alt={record?.name || "Speaker"}
                sx={{
                  width: 72,
                  height: 72,
                  bgcolor: "#7c3aed",
                  color: "#ffffff",
                  fontSize: 22,
                  fontWeight: 800,
                }}
              >
                {!record?.photo ? getInitials(record) : null}
              </Avatar>
            </Box>
          )}
        />

        <TextField source="id" label="ID" />
        <TextField source="name" label="Name" />
        <TextField source="role" label="Role" />
        <TextField source="specialty" label="Specialty" />
        <TextField source="company" label="Company" />
        <TextField source="bio" label="Bio" />
        <TextField source="photo" label="Photo URL" />
        <TextField source="initials" label="Initials" />

        <UrlField source="linkedin" label="LinkedIn" />
        <UrlField source="twitter" label="Twitter" />
        <UrlField source="website" label="Website" />

        <TextField source="day" label="Day" />
        <TextField source="sessionType" label="Session type" />
      </SimpleShowLayout>
    </Show>
  );
}
