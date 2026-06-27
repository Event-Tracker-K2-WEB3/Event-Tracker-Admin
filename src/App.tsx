import { Admin, Resource} from "react-admin";
import EventIcon from "@mui/icons-material/Event";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import ViewTimelineIcon from "@mui/icons-material/ViewTimeline";

import { authProvider } from "./auth/authProvider";
import { dataProvider } from "./dataProvider/dataProvider";
import { AdminDashboard } from "./layout/AdminDashboard";
import { AdminLayout } from "./layout/AdminLayout";
import { eventSyncTheme } from "./theme";

import { EventList } from "./resources/events/EventList";
import { EventCreate } from "./resources/events/EventCreate";
import { EventEdit } from "./resources/events/EventEdit";

import { RoomList } from "./resources/rooms/RoomList";
import { RoomCreate } from "./resources/rooms/RoomCreate";
import { RoomEdit } from "./resources/rooms/RoomEdit";


import { SpeakerList } from "./resources/speakers/SpeakerList";
import { SpeakerCreate } from "./resources/speakers/SpeakerCreate";
import { SpeakerEdit } from "./resources/speakers/SpeakerEdit";
import { SpeakerShow } from "./resources/speakers/SpeakerShow";

import { SessionList } from "./resources/sessions/SessionList";
import { SessionCreate } from "./resources/sessions/SessionCreate";
import { SessionEdit } from "./resources/sessions/SessionEdit";
import { SessionShow } from "./resources/sessions/SessionShow";
import { CustomLoginPage } from "./auth/CustomLoginPage";

export const App = () => (
    <Admin
        loginPage={CustomLoginPage}
        dataProvider={dataProvider}
        dashboard={AdminDashboard}
        authProvider={authProvider}
        layout={AdminLayout}
        theme={eventSyncTheme}
    >
        <Resource name="events" list={EventList} create={EventCreate} edit={EventEdit} icon={EventIcon} />

        <Resource name="rooms" list={RoomList} create={RoomCreate} edit={RoomEdit} icon={MeetingRoomIcon} />

        <Resource
            name="speakers"
            list={SpeakerList}
            create={SpeakerCreate}
            edit={SpeakerEdit}
            show={SpeakerShow}
            icon={RecordVoiceOverIcon}
        />

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