import { Admin, Resource, ListGuesser } from "react-admin";
import EventIcon from "@mui/icons-material/Event";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import ViewTimelineIcon from "@mui/icons-material/ViewTimeline";
import { authProvider } from "./auth/authProvider";
import { dataProvider } from "./dataProvider/dataProvider";
import { AdminDashboard } from "./layout/AdminDashboard";
import { AdminLayout } from "./layout/AdminLayout";
import { eventSyncTheme } from "./theme";

export const App = () => (
  <Admin
    dataProvider={dataProvider}
    dashboard={AdminDashboard}
    authProvider={authProvider}
    layout={AdminLayout}
    theme={eventSyncTheme}
  >
    <Resource name="events" list={ListGuesser} icon={EventIcon} />
    <Resource name="rooms" list={ListGuesser} icon={MeetingRoomIcon} />
    <Resource name="speakers" list={ListGuesser} icon={RecordVoiceOverIcon} />
    <Resource name="sessions" list={ListGuesser} icon={ViewTimelineIcon} />
  </Admin>
);