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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// User credentials database (temporary, in-memory)
const users = [
  // Mitarbeiter (user)
  { id: 1, username: 'gio', password: 'gio', role: 'user' },
  { id: 2, username: 'claudio', password: 'claudio', role: 'user' },
  { id: 3, username: 'gerrik', password: 'gerrik', role: 'user' },
  { id: 4, username: 'martin', password: 'martin', role: 'user' },
  // Admin (geschäftsleitung)
  { id: 5, username: 'cristian', password: 'cristian', role: 'admin' },
  { id: 6, username: 'debby', password: 'debby', role: 'admin' },
];

// Simple token generator (Base64 encoded)
function generateToken(user: typeof users[0]): string {
  const tokenData = { id: user.id, username: user.username, role: user.role };
  return Buffer.from(JSON.stringify(tokenData)).toString('base64');
}

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

  app.post("/api/auth/login", (req, res) => {
    console.log('📝 Login attempt:', req.body);
    const { username, password } = req.body;

    // Find user
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
      console.log('❌ User not found:', username);
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    }

    console.log('✅ User found:', user.username);

    // Generate token
    const token = generateToken(user);

    const response = {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };

    console.log('📤 Sending response:', response);
    res.json(response);
  });

  /* -------------------------
     User Endpoints
  -------------------------- */

  app.get("/api/users", (_req, res) => {
    // Return all users without passwords
    const userList = users.map(u => ({
      id: u.id,
      username: u.username,
      role: u.role
    }));
    res.json(userList);
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
