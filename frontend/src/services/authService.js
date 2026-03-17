import { apiRequest } from "./api";
import { clearSession, saveSession, setUser } from "./session";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase";

export const logout = () => {
  clearSession();
};

export const register = async (payload) => {
  return apiRequest("/auth/register", {
    method: "POST",
    body: payload,
    auth: false,
  });
};

export const login = async (payload) => {
  const data = await apiRequest("/auth/login", {
    method: "POST",
    body: payload,
    auth: false,
  });

  saveSession(data.token, data.user);
  return data;
};

export const googleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();

    const data = await apiRequest("/auth/google", {
      method: "POST",
      body: { token: idToken },
      auth: false,
    });

    saveSession(data.token, data.user);
    return data;
  } catch (error) {
    console.error("Google login error:", error);
    throw new Error(error.message || "Failed to authenticate with Google");
  }
};

export const getProfile = async () => {
  const profile = await apiRequest("/auth/profile");
  if (profile) setUser(profile);
  return profile;
};
