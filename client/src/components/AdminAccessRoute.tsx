import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { checkAdminAccess } from "../lib/api";
import { buildAdminPath } from "../lib/admin";

export function AdminAccessRoute({ children }: PropsWithChildren) {
  const location = useLocation();
  const [unlocked, setUnlocked] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;

    checkAdminAccess()
      .then((payload) => {
        if (active) {
          setUnlocked(payload.unlocked);
        }
      })
      .catch(() => {
        if (active) {
          setUnlocked(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  if (unlocked === null) {
    return <div className="container-shell py-10 text-sm text-slate-500">Checking admin access...</div>;
  }

  if (!unlocked) {
    return <Navigate to={buildAdminPath("/access")} replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
