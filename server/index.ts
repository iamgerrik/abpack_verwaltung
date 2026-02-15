import "dotenv/config";
import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

import { appRouter } from "./routers";
import { createContext } from "./_core/context";
import { authenticateUser, createSessionToken } from "./auth";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import * as db from "./db";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  /* -------------------------
     Global Middleware
  -------------------------- */

  app.use(helmet());

  app.use(
    cors({
      origin: "http://localhost:5173", // Vite Dev
      credentials: true,
    })
  );

  app.use(express.json());
  app.use(cookieParser());

  /* -------------------------
     Health Check
  -------------------------- */
  
  app.get("/api/health", (_req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
  });

  /* -------------------------
     Auth Endpoints
  -------------------------- */

  app.post("/api/auth/login", async (req, res) => {
    console.log('📝 Login attempt:', req.body?.username);
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username und Passwort erforderlich' });
    }

    try {
      const user = await authenticateUser(username, password);
      
      if (!user) {
        console.log('❌ Invalid credentials:', username);
        return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
      }

      console.log('✅ User authenticated:', user.username);

      // Create JWT token
      const token = await createSessionToken(user);

      // Set cookie
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      const response = {
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      };

      console.log('📤 Login successful:', user.username);
      res.json(response);
    } catch (error) {
      console.error('❌ Login error:', error);
      res.status(500).json({ error: 'Anmeldung fehlgeschlagen' });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    const cookieOptions = getSessionCookieOptions(req);
    res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    res.json({ success: true });
  });

  /* -------------------------
     User Endpoints
  -------------------------- */

  app.get("/api/users", async (_req, res) => {
    try {
      const users = await db.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error('❌ Failed to get users:', error);
      res.status(500).json({ error: 'Failed to get users' });
    }
  });

  /* -------------------------
     tRPC API
  -------------------------- */

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
      onError({ error, path }) {
        console.error(`❌ tRPC error on ${path}:`, error);
      },
    })
  );

  /* -------------------------
     Static Frontend
  -------------------------- */

  // Only serve static files in production
  if (process.env.NODE_ENV === "production") {
    const staticPath = path.resolve(__dirname, "public");
    app.use(express.static(staticPath));

    // Catch-all for SPA routing in production
    app.get("*", (_req, res) => {
      res.sendFile(path.join(staticPath, "index.html"));
    });
  } else {
    console.log('Development mode: Static files disabled, API-only server');
  }

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
