import { useEffect, useState } from "react";
import { Box, Card, CardContent, CircularProgress, Typography } from "@mui/material";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

type DashboardStats = {
  totalEvents: number;
  totalSessions: number;
  totalSpeakers: number;
  liveSessions: number;
};

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    totalSessions: 0,
    totalSpeakers: 0,
    liveSessions: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/about/stats`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error loading dashboard stats");
        }

        return response.json();
      })
      .then((data) => {
        setStats({
          totalEvents: data.totalEvents ?? 0,
          totalSessions: data.totalSessions ?? 0,
          totalSpeakers: data.totalSpeakers ?? 0,
          liveSessions: data.liveSessions ?? 0,
        });
      })
      .catch((error) => {
        console.error("Error loading dashboard stats", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const statCards = [
    {
      label: "Total events",
      value: stats.totalEvents,
    },
    {
      label: "Total sessions",
      value: stats.totalSessions,
    },
    {
      label: "Total speakers",
      value: stats.totalSpeakers,
    },
    {
      label: "Live sessions",
      value: stats.liveSessions,
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800}>
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

        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Manage events, rooms, speakers, and sessions from one dashboard.
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <CircularProgress size={24} />
          <Typography color="text.secondary">Loading dashboard...</Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 3,
          }}
        >
          {statCards.map((card) => (
            <Card key={card.label}>
              <CardContent>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={600}
                >
                  {card.label}
                </Typography>

                <Typography variant="h4" fontWeight={800} sx={{ mt: 1 }}>
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}