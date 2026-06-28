import type { AuthProvider } from "react-admin";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

type LoginResponse = {
  token: string;
  type: string;
  id: number;
  email: string;
  fullName: string;
  role: string;
};

export const authProvider: AuthProvider = {
  login: async ({ username, email, password }) => {
    const loginEmail = email || username;

    if (!loginEmail || !password) {
      throw new Error("Email and password are required");
    }

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: loginEmail,
        password,
      }),
    });

    if (!response.ok) {
      throw new Error("Invalid email or password");
    }

    const data: LoginResponse = await response.json();

    localStorage.setItem("eventsync_admin_token", data.token);
    localStorage.setItem(
      "eventsync_admin_user",
      JSON.stringify({
        id: data.id,
        email: data.email,
        fullName: data.fullName,
        role: data.role,
      })
    );
  },

  logout: async () => {
    localStorage.removeItem("eventsync_admin_token");
    localStorage.removeItem("eventsync_admin_user");
  },

  checkAuth: async () => {
    const token = localStorage.getItem("eventsync_admin_token");

    if (!token) {
      throw new Error("Not authenticated");
    }
  },

  checkError: async (error) => {
    const status = error.status || error.response?.status;

    if (status === 401 || status === 403) {
      localStorage.removeItem("eventsync_admin_token");
      localStorage.removeItem("eventsync_admin_user");

      throw new Error("Session expired");
    }
  },

  getIdentity: async () => {
    const savedUser = localStorage.getItem("eventsync_admin_user");

    if (!savedUser) {
      throw new Error("User not found");
    }

    const user = JSON.parse(savedUser);

    return {
      id: user.id,
      fullName: user.fullName || user.email,
      avatar: undefined,
    };
  },

  getPermissions: async () => {
    const savedUser = localStorage.getItem("eventsync_admin_user");

    if (!savedUser) {
      return null;
    }

    const user = JSON.parse(savedUser);

    return user.role;
  },
};