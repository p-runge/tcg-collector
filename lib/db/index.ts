import { env } from "@/env";
import { drizzle } from "drizzle-orm/node-postgres";
import {
  date,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const db = drizzle(env.DATABASE_URL);

// User table
export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey(),
  discord_id: varchar("discord_id", { length: 32 }).notNull(),
  username: varchar("username", { length: 64 }).notNull(),
  avatar_url: text("avatar_url"),
  favorite_language_id: uuid("favorite_language_id"),
  created_at: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
});

// Series table
export const seriesTable = pgTable("series", {
  id: uuid("id").primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  release_year: integer("release_year"),
  created_at: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
});

// Set table
export const setsTable = pgTable("sets", {
  id: uuid("id").primaryKey(),
  created_at: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" })
    .notNull()
    .defaultNow(),
  name: varchar("name", { length: 128 }).notNull(),
  logo: text("logo"),
  symbol: varchar("symbol", { length: 32 }),
  releaseDate: date("release_date").notNull(),
  total: integer("total").notNull(),
  totalWithSecretRares: integer("total_with_secret_rares").notNull(),
  series_id: uuid("series_id")
    // .notNull()
    .references(() => seriesTable.id),
});

// Card table
export const cardsTable = pgTable("cards", {
  id: uuid("id").primaryKey(),
  set_id: uuid("set_id")
    .notNull()
    .references(() => setsTable.id),
  number: varchar("number", { length: 32 }).notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  rarity: varchar("rarity", { length: 32 }),
  card_type: varchar("card_type", { length: 32 }),
  created_at: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
});

// // Language table
// export const languagesTable = pgTable("languages", {
//   id: uuid("id").primaryKey(),
//   code: varchar("code", { length: 8 }).notNull(),
//   name: varchar("name", { length: 64 }).notNull(),
// });

// // Variant table
// export const variantsTable = pgTable("variants", {
//   id: uuid("id").primaryKey(),
//   name: varchar("name", { length: 64 }).notNull(),
//   description: text("description"),
// });

// // Condition table
// export const conditionsTable = pgTable("conditions", {
//   id: uuid("id").primaryKey(),
//   name: varchar("name", { length: 64 }).notNull(),
//   abbreviation: varchar("abbreviation", { length: 16 }),
//   description: text("description"),
// });

// UserCard table
export const userCardsTable = pgTable("user_cards", {
  id: uuid("id").primaryKey(),
  user_id: uuid("user_id").notNull(),
  card_id: uuid("card_id").notNull(),
  language_id: uuid("language_id").notNull(),
  variant_id: uuid("variant_id").notNull(),
  condition_id: uuid("condition_id").notNull(),
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
// export const userCollectingSetsTable = pgTable("user_collecting_sets", {
//   id: uuid("id").primaryKey(),
//   user_id: uuid("user_id").notNull(),
//   set_id: uuid("set_id").notNull(),
//   created_at: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
// });
