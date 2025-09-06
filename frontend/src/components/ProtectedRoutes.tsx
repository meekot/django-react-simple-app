import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants";
import { apiClient, ApiError } from "@/api";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState<boolean>();

  useEffect(() => {
    auth().catch(() => setIsAuthorized(false));
  });

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);

    try {
      const res = await apiClient.fetchJson<{ access: string }>(
        "/api/token/refresh/",
        {
          body: {
            refresh: refreshToken,
          },
        },
      );

      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(error);
        setIsAuthorized(false);
      }
      throw error;
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);

    if (!token) {
      setIsAuthorized(false);

      return;
    }

    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;

    if (tokenExpiration && tokenExpiration < now) {
      await refreshToken();
    } else {
      setIsAuthorized(true);
    }
  };

  if (isAuthorized === undefined) {
    return <div>Loading ..</div>;
  }

  return isAuthorized ? children : <Navigate to="/login" />;
}
