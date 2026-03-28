import dotenv from "dotenv";
import path from "node:path";

dotenv.config();

export const config = {
  port: Number(process.env.SERVER_PORT ?? 4000),
  jwtSecret: process.env.JWT_SECRET ?? "change-this-in-production",
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  adminAccessCode: process.env.ADMIN_ACCESS_CODE ?? "change-this-private-access-code",
  adminAccessCookieName: "admin_access",
  uploadsDir: path.resolve(process.env.UPLOADS_DIR ?? path.resolve(process.cwd(), "uploads")),
  isProduction: process.env.NODE_ENV === "production"
};
