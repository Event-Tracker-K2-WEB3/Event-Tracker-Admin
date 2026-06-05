import { Admin, Resource, ListGuesser } from "react-admin";
import EventIcon from "@mui/icons-material/Event";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import ViewTimelineIcon from "@mui/icons-material/ViewTimeline";

import { dataProvider } from "./dataProvider/dataProvider";
import { AdminDashboard } from "./layout/AdminDashboard";
import { AdminLayout } from "./layout/AdminLayout";
import { eventSyncTheme } from "./theme";
import { SessionList } from "./resources/sessions/SessionList";
import { SessionCreate } from "./resources/sessions/SessionCreate";
import { SessionEdit } from "./resources/sessions/SessionEdit";
import { SessionShow } from "./resources/sessions/SessionShow";

export const App = () => (
  <Admin
    dataProvider={dataProvider}
    dashboard={AdminDashboard}
    layout={AdminLayout}
    theme={eventSyncTheme}
  >
    <Resource name="events" list={ListGuesser} icon={EventIcon} />
    <Resource name="rooms" list={ListGuesser} icon={MeetingRoomIcon} />
    <Resource name="speakers" list={ListGuesser} icon={RecordVoiceOverIcon} />
    <Resource
      name="sessions"
      list={SessionList}
      create={SessionCreate}
      edit={SessionEdit}
      show={SessionShow}
      icon={ViewTimelineIcon}
    />
  </Admin>
);