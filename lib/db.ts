import { env } from "@/env";
import { drizzle } from "drizzle-orm/node-postgres";
import {
  pgTable,
  serial,
  varchar,
  integer,
  text,
  timestamp,
  date,
} from "drizzle-orm/pg-core";

export const db = drizzle(env.DATABASE_URL);

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  discord_id: varchar("discord_id", { length: 32 }).notNull(),
  username: varchar("username", { length: 64 }).notNull(),
  avatar_url: text("avatar_url"),
  favorite_language_id: integer("favorite_language_id"),
  created_at: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
});

// Series table
export const series = pgTable("series", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  release_year: integer("release_year"),
  created_at: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
});

// Set table
export const sets = pgTable("sets", {
  id: serial("id").primaryKey(),
  series_id: integer("series_id").notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  code: varchar("code", { length: 32 }).notNull(),
  release_date: date("release_date"),
  total_cards: integer("total_cards"),
  created_at: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
});

// Card table
export const cards = pgTable("cards", {
  id: serial("id").primaryKey(),
  set_id: integer("set_id").notNull(),
  number: varchar("number", { length: 32 }).notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  rarity: varchar("rarity", { length: 32 }),
  card_type: varchar("card_type", { length: 32 }),
  created_at: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
});

// // Language table
// export const languages = pgTable("languages", {
//   id: serial("id").primaryKey(),
//   code: varchar("code", { length: 8 }).notNull(),
//   name: varchar("name", { length: 64 }).notNull(),
// });

// // Variant table
// export const variants = pgTable("variants", {
//   id: serial("id").primaryKey(),
//   name: varchar("name", { length: 64 }).notNull(),
//   description: text("description"),
// });

// // Condition table
// export const conditions = pgTable("conditions", {
//   id: serial("id").primaryKey(),
//   name: varchar("name", { length: 64 }).notNull(),
//   abbreviation: varchar("abbreviation", { length: 16 }),
//   description: text("description"),
// });

// UserCard table
export const userCards = pgTable("user_cards", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull(),
  card_id: integer("card_id").notNull(),
  language_id: integer("language_id").notNull(),
  variant_id: integer("variant_id").notNull(),
  condition_id: integer("condition_id").notNull(),
  quantity: integer("quantity").notNull(),
  notes: text("notes"),
  created_at: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" })
    .notNull()
    .defaultNow(),
});

// // UserCollectingSet table
// export const userCollectingSets = pgTable("user_collecting_sets", {
//   id: serial("id").primaryKey(),
//   user_id: integer("user_id").notNull(),
//   set_id: integer("set_id").notNull(),
//   created_at: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
// });
