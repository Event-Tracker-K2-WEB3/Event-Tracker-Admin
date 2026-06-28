import type { ReactNode } from "react";
import {
  AppBar,
  CheckForApplicationUpdate,
  Layout,
  MenuItemLink,
  TitlePortal,
  useLogout,
} from "react-admin";
import { Box, Typography } from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import EventIcon from "@mui/icons-material/Event";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import GroupsIcon from "@mui/icons-material/Groups";
import ViewAgendaIcon from "@mui/icons-material/ViewAgenda";
import LogoutIcon from "@mui/icons-material/Logout";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import "./AdminLayout.css";

function AdminAppBar() {
  return (
    <AppBar color="primary" className="admin-topbar">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          gap: 2,
        }}
      >
        <Typography
          variant="h6"
          color="inherit"
          sx={{
            flex: 1,
            fontWeight: 800,
            letterSpacing: "-0.03em",
          }}
        >
          <div className="admin-topbar-brand">
            <div className="admin-topbar-logo">
              <AutoAwesomeIcon fontSize="small" />
            </div>

            <span>EventSync Admin</span>
          </div>
        </Typography>

        <TitlePortal />
      </Box>
    </AppBar>
  );
}

function AdminMenu() {
  const logout = useLogout();

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-glow admin-sidebar-glow--top" />
      <div className="admin-sidebar-glow admin-sidebar-glow--bottom" />

      <nav className="admin-sidebar-nav">
        <MenuItemLink
          to="/"
          primaryText="Dashboard"
          leftIcon={<DashboardIcon />}
          className="admin-sidebar-link"
        />

        <MenuItemLink
          to="/events"
          primaryText="Events"
          leftIcon={<EventIcon />}
          className="admin-sidebar-link"
        />

        <MenuItemLink
          to="/rooms"
          primaryText="Rooms"
          leftIcon={<MeetingRoomIcon />}
          className="admin-sidebar-link"
        />

        <MenuItemLink
          to="/speakers"
          primaryText="Speakers"
          leftIcon={<GroupsIcon />}
          className="admin-sidebar-link"
        />

        <MenuItemLink
          to="/sessions"
          primaryText="Sessions"
          leftIcon={<ViewAgendaIcon />}
          className="admin-sidebar-link"
        />
      </nav>

      <button
        type="button"
        className="admin-sidebar-logout"
        onClick={() => logout()}
      >
        <LogoutIcon fontSize="small" />
        <span>Sign out</span>
      </button>
    </aside>
  );
}

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Layout appBar={AdminAppBar} menu={AdminMenu}>
      {children}
      <CheckForApplicationUpdate />
    </Layout>
  );
}