import { defaultDarkTheme, type RaThemeOptions } from "react-admin";

export const eventSyncTheme: RaThemeOptions = {
  ...defaultDarkTheme,

  palette: {
    ...defaultDarkTheme.palette,
    mode: "dark",

    primary: {
      main: "#7c3aed",
      light: "#a855f7",
      dark: "#5b21b6",
      contrastText: "#ffffff",
    },

    secondary: {
      main: "#a855f7",
      light: "#c084fc",
      dark: "#7e22ce",
      contrastText: "#ffffff",
    },

    background: {
      default: "#06101f",
      paper: "#0d1526",
    },

    text: {
      primary: "#ffffff",
      secondary: "rgba(255,255,255,0.65)",
    },
  },

  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },

  components: {
    ...defaultDarkTheme.components,

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#0d1526",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "none",
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#06101f",
          borderRight: "1px solid rgba(255,255,255,0.08)",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#0d1526",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "16px",
          boxShadow: "0 18px 45px rgba(0,0,0,0.25)",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          textTransform: "none",
          fontWeight: 700,
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
};