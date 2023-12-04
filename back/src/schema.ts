import {
  serial,
  pgTable,
  varchar,
  text,
  date,
  integer,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 256 }).unique(),
  createdAt: date("created_at").defaultNow(),
});

export const sessions = pgTable("sessions", {
  token: varchar("token", { length: 256 }).primaryKey(),
  userId: integer("user_id").references(() => users.id),
  createdAt: date("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  messageContent: text("message_content"),
  userId: integer("user_id").references(() => users.id),
  createdAt: date("created_at").defaultNow(),
});

export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).unique(),
  userId: integer("user_id").references(() => users.id),
  createdAt: date("created_at").defaultNow(),
});
