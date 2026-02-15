import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import type { Request } from "express";
import { parse as parseCookieHeader } from "cookie";
import { COOKIE_NAME } from "@shared/const";
import { User } from "../drizzle/schema";
import * as db from "./db";

const SALT_ROUNDS = 10;
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
);
const TOKEN_EXPIRATION = "7d";

export type SessionPayload = {
  userId: number;
  username: string;
  role: string;
};

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare a plain text password with a hashed password
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Create a JWT session token
 */
export async function createSessionToken(user: User): Promise<string> {
  const payload: SessionPayload = {
    userId: user.id,
    username: user.username,
    role: user.role,
  };

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRATION)
    .sign(JWT_SECRET);
}

/**
 * Verify and decode a JWT session token
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Extract session token from request (cookie or Authorization header)
 */
function extractToken(req: Request): string | null {
  // Try cookie first
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    const cookies = parseCookieHeader(cookieHeader);
    if (cookies[COOKIE_NAME]) {
      return cookies[COOKIE_NAME];
    }
  }

  // Try Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  return null;
}

/**
 * Authenticate a request and return the user if valid
 */
export async function authenticateRequest(req: Request): Promise<User | null> {
  const token = extractToken(req);
  if (!token) {
    return null;
  }

  const payload = await verifySessionToken(token);
  if (!payload) {
    return null;
  }

  // Fetch user from database to ensure they still exist and get latest data
  const user = await db.getUserById(payload.userId);
  return user || null;
}

/**
 * Authenticate user by username and password
 */
export async function authenticateUser(
  username: string,
  password: string
): Promise<User | null> {
  const user = await db.getUserByUsername(username);
  if (!user) {
    return null;
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    return null;
  }

  // Update last signed in
  await db.updateLastSignedIn(user.id);

  return user;
}
