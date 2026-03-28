import type { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { buildAdminPath } from "../lib/admin";
import { getAuthToken } from "../lib/auth";

export function ProtectedRoute({ children }: PropsWithChildren) {
  const token = getAuthToken();
  const location = useLocation();

  if (!token) {
    return <Navigate to={buildAdminPath("/login")} replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
