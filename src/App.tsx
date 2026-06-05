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
<<<<<<< HEAD
import { SessionList } from "./resources/sessions/SessionList";
import { SessionCreate } from "./resources/sessions/SessionCreate";
import { SessionEdit } from "./resources/sessions/SessionEdit";
import { SessionShow } from "./resources/sessions/SessionShow";
=======
import { SpeakerList } from "./resources/speakers/SpeakerList";
import { SpeakerCreate } from "./resources/speakers/SpeakerCreate";
import { SpeakerEdit } from "./resources/speakers/SpeakerEdit";
import { SpeakerShow } from "./resources/speakers/SpeakerShow";
>>>>>>> f9695410a8ebbd9c352fed4feb89d99fc6f8a76a

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
<<<<<<< HEAD
    <Resource name="speakers" list={ListGuesser} icon={RecordVoiceOverIcon} />
    <Resource
      name="sessions"
      list={SessionList}
      create={SessionCreate}
      edit={SessionEdit}
      show={SessionShow}
      icon={ViewTimelineIcon}
    />
=======
    <Resource name="speakers"
              list={SpeakerList}
              create={SpeakerCreate}
              edit={SpeakerEdit}
              show={SpeakerShow}
              icon={RecordVoiceOverIcon}
    />
    <Resource name="sessions" list={ListGuesser} icon={ViewTimelineIcon} />
>>>>>>> f9695410a8ebbd9c352fed4feb89d99fc6f8a76a
  </Admin>
);