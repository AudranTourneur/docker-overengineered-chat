// src/server.ts
import express2 from "express";

// src/common/env.ts
import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();
var envSchema = z.object({
  WEB_PORT: z.string().min(1),
  POSTGRES_URL: z.string().min(1),
  PROMETHEUS_PORT: z.string().min(1),
  MINIO_ACCESS_KEY: z.string().min(1),
  MINIO_SECRET_KEY: z.string().min(1),
  MINIO_HOST: z.string().min(1),
  MINIO_PORT: z.string().min(1),
});
var GlobalEnv = envSchema.parse(process.env);

// src/common/logger.ts
import winston from "winston";
var GlobalLogger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "back" },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" })
  ]
});
if (process.env.NODE_ENV !== "production") {
  GlobalLogger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// src/trpc.ts
import { initTRPC } from "@trpc/server";
import superjson from "superjson";

// src/common/metrics.ts
import Prometheus from "prom-client";
import express from "express";
var collectDefaultMetrics = Prometheus.collectDefaultMetrics;
var prefix = "app_";
var route_request_duration_seconds = new Prometheus.Histogram({
  name: prefix + "route_request_duration_seconds",
  help: "Duration of requests to the server in seconds",
  labelNames: ["path"]
});
var database_query_duration_seconds = new Prometheus.Histogram({
  name: prefix + "route_query_duration_seconds",
  help: "Duration of queries to the database in seconds",
  labelNames: ["type", "entity"]
});
async function startMetricsServer() {
  const app2 = express();
  const port2 = Number(GlobalEnv.PROMETHEUS_PORT);
  app2.get("/metrics", async (_req, res) => {
    console.log("Metrics requested");
    Prometheus.register.clear();
    collectDefaultMetrics({ prefix });
    Prometheus.register.registerMetric(route_request_duration_seconds);
    res.set("Content-Type", Prometheus.register.contentType);
    res.end(await Prometheus.register.metrics());
  });
  app2.listen(port2, () => {
    console.log(`Metrics server listening at http://localhost:${port2}/metrics`);
  });
}

// src/trpc.ts
var createContext = () => ({});
var t = initTRPC.create({
  transformer: superjson
});
var loggerMiddleware = t.middleware(async (opts) => {
  console.log(opts.input);
  const start = Date.now();
  const result = await opts.next();
  const durationMs = Date.now() - start;
  const meta = { path: opts.path, type: opts.type, durationMs };
  result.ok ? console.log("OK request timing:", meta) : console.error("Non-OK request timing", meta);
  route_request_duration_seconds.observe({ path: opts.path }, durationMs / 1e3);
  return result;
});
var baseProcedure = t.procedure;
var publicProcedure = baseProcedure.use(loggerMiddleware);
var router = t.router;

// src/router.ts
import * as trpcExpress from "@trpc/server/adapters/express";

// src/procedures/getChatMessages.ts
import { eq } from "drizzle-orm";

// src/common/database.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
var queryClient = postgres(GlobalEnv.POSTGRES_URL);
var db = drizzle(queryClient);
var GlobalDatabaseClient = db;

// src/schema.ts
import {
  serial,
  pgTable,
  varchar,
  text,
  integer,
  timestamp
} from "drizzle-orm/pg-core";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 256 }).unique(),
  createdAt: timestamp("created_at").defaultNow()
});
var sessions = pgTable("sessions", {
  token: varchar("token", { length: 256 }).primaryKey(),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow()
});
var messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  messageContent: text("message_content"),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow()
});
var files = pgTable("files", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).unique(),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow()
});

// src/procedures/getChatMessages.ts
async function getChatMessages() {
  const chatMessages = await GlobalDatabaseClient.select().from(messages).innerJoin(users, eq(messages.userId, users.id)).orderBy(messages.createdAt).limit(100);
  const chatMessagesWithUsername = chatMessages.map((chatMessage) => {
    if (!chatMessage.users)
      throw new Error("chatMessage.users is null");
    if (!chatMessage.messages)
      throw new Error("chatMessage.users is null");
    return {
      id: chatMessage.users.id,
      messageContent: chatMessage.messages.messageContent,
      createdAt: chatMessage.messages.createdAt,
      username: chatMessage.users.username
    };
  });
  return chatMessagesWithUsername;
}

// src/router.ts
import { z as z3 } from "zod";

// src/common/auth.ts
import crypto from "crypto";
import { uniqueNamesGenerator, adjectives, colors, animals } from "unique-names-generator";
import { eq as eq2 } from "drizzle-orm";
async function createUser() {
  const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] });
  const [user] = await GlobalDatabaseClient.insert(users).values({
    username: randomName
  }).returning();
  if (!user || !user.username) {
    throw new Error("User not created");
  }
  const token = await createSession(user.id);
  return {
    id: user.id,
    username: user.username,
    token
  };
}
function generateCryptographicRandomToken() {
  return crypto.randomBytes(128).toString("hex");
}
async function createSession(userId) {
  const token = generateCryptographicRandomToken();
  await GlobalDatabaseClient.insert(sessions).values({
    token,
    userId
  });
  return token;
}
async function resolveSessionTokenIntoUserOrCreateUser(token) {
  if (!token) {
    console.log("Token null");
    return await createUser();
  }
  const userSessions = await GlobalDatabaseClient.select().from(sessions).where(eq2(sessions.token, token)).innerJoin(users, eq2(sessions.userId, users.id));
  if (userSessions.length === 0) {
    console.log("Token not found");
    return await createUser();
  }
  console.log("userSession", userSessions);
  const userSession = userSessions[0];
  return {
    id: userSession.users.id,
    username: userSession.users.username || "",
    token
  };
}
async function resolveSessionTokenIntoUserOrFail(token) {
  if (!token) {
    throw new Error("Token null");
  }
  const userSessions = await GlobalDatabaseClient.select().from(sessions).where(eq2(sessions.token, token)).innerJoin(users, eq2(sessions.userId, users.id));
  if (userSessions.length === 0) {
    throw new Error("Token not found");
  }
  const userSession = userSessions[0];
  return {
    id: userSession.users.id,
    username: userSession.users.username || "",
    token
  };
}

// src/procedures/registerOrLogin.ts
async function registerOrLogin(token) {
  return await resolveSessionTokenIntoUserOrCreateUser(token);
}

// src/procedures/sendChatMessage.ts
import { z as z2 } from "zod";
var sendChatMessageSchema = z2.object({
  token: z2.string(),
  messageContent: z2.string()
});
async function sendChatMessage(input) {
  console.log("sendChatMessage", input);
  const user = await resolveSessionTokenIntoUserOrFail(input.token);
  console.log("user", user);
  await GlobalDatabaseClient.insert(messages).values({
    messageContent: input.messageContent,
    userId: user.id,
    createdAt: /* @__PURE__ */ new Date()
  });
  return await getChatMessages();
}

// src/router.ts
var appRouter = createRouter();
async function initAllRoute(app2) {
  app2.use(
    "/api/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext
    })
  );
  startMetricsServer();
}
function createRouter() {
  return router({
    registerOrLogin: publicProcedure.input(z3.string().nullable()).mutation(async (req) => {
      return await registerOrLogin(req.input);
    }),
    getChatMessages: publicProcedure.query(async () => {
      return await getChatMessages();
    }),
    sendChatMessage: publicProcedure.input(sendChatMessageSchema).mutation(async (req) => {
      return await sendChatMessage(req.input);
    })
  });
}

// src/server.ts
var app = express2();
initAllRoute(app);
var port = Number(GlobalEnv.WEB_PORT);
app.listen(port);
GlobalLogger.info(`Back-end application started on port ${port}`);
//# sourceMappingURL=out.js.map
