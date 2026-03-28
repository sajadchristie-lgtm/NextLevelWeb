import type { NextFunction, Request, Response } from "express";
import { config } from "../config.js";
import { verifyAdminToken } from "../lib/auth.js";
import { verifyAdminAccessToken } from "../lib/auth.js";

function getCookieValue(request: Request, name: string) {
  const cookieHeader = request.headers.cookie;

  if (!cookieHeader) {
    return null;
  }

  const entries = cookieHeader.split(";");

  for (const entry of entries) {
    const [rawName, ...rawValue] = entry.trim().split("=");
    if (rawName === name) {
      return decodeURIComponent(rawValue.join("="));
    }
  }

  return null;
}

export function hasAdminAccess(request: Request) {
  const token = getCookieValue(request, config.adminAccessCookieName);

  if (!token) {
    return false;
  }

  try {
    const payload = verifyAdminAccessToken(token);
    return payload.scope === "admin-access";
  } catch {
    return false;
  }
}

export function requireAdminAccess(request: Request, response: Response, next: NextFunction) {
  if (!hasAdminAccess(request)) {
    response.status(403).json({ message: "Private admin access required." });
    return;
  }

  next();
}

export function requireAdmin(request: Request, response: Response, next: NextFunction) {
  const header = request.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    response.status(401).json({ message: "Authentication required." });
    return;
  }

  try {
    response.locals.auth = verifyAdminToken(token);
    next();
  } catch {
    response.status(401).json({ message: "Invalid or expired token." });
  }
}
