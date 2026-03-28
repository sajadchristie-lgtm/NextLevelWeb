import jwt from "jsonwebtoken";
import { config } from "../config.js";

export type AuthTokenPayload = {
  sub: string;
  email: string;
  role: string;
};

type AccessTokenPayload = {
  scope: "admin-access";
};

export function signAdminToken(payload: AuthTokenPayload) {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: "7d" });
}

export function verifyAdminToken(token: string) {
  return jwt.verify(token, config.jwtSecret) as AuthTokenPayload;
}

export function signAdminAccessToken() {
  return jwt.sign({ scope: "admin-access" } satisfies AccessTokenPayload, config.jwtSecret, {
    expiresIn: "7d"
  });
}

export function verifyAdminAccessToken(token: string) {
  return jwt.verify(token, config.jwtSecret) as AccessTokenPayload;
}
