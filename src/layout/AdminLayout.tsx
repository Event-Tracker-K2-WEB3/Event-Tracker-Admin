import type { ReactNode } from "react";
import {
  Layout,
  AppBar,
  TitlePortal,
  CheckForApplicationUpdate,
} from "react-admin";
import { Box, Typography } from "@mui/material";

function AdminAppBar() {
  return (
    <AppBar color="primary">
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
          <div className="logo" style={{ display: "flex", alignItems: "center" }}>
            <img src="public/logo-event-tracker.png" alt=""
              style={{
                height: "1.5em",
                marginRight: "0.5em",
              }}
            />
            <span>
              EventSync Admin
            </span>
          </div>
        </Typography>

        <TitlePortal />
      </Box>
    </AppBar>
  );
}

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Layout appBar={AdminAppBar}>
      {children}
      <CheckForApplicationUpdate />
    </Layout>
  );
}