import axios from "axios";
import { auth } from "@/firebaseConfig";

const API_BASE_URL = "https://fea1e175ddbd.ngrok-free.app";

async function getAuthToken() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No authenticated user found");
  }

  return await user.getIdToken(true);
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;

    if (user) {
      const token = await user.getIdToken(true);
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


export async function getCurrentUser() {
  try {
    const response = await api.get("/auth/user/me/");
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}
