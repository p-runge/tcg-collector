import { env } from "@/env";
import { drizzle } from "drizzle-orm/node-postgres";
import {
  date,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const db = drizzle(env.DATABASE_URL);

/**
 * --------------------------------
 * Enums
 * --------------------------------
 */

export const rarityEnum = pgEnum("rarity", [
  "Common",
  "Uncommon",
  "Rare",
  "Ultra Rare",
  "None",
  "Secret Rare",
  "One Diamond",
  "Illustration rare",
  "Two Diamond",
  "Rare Holo",
  "Holo Rare",
  "Double rare",
  "Holo Rare V",
  "Shiny rare",
  "Three Diamond",
  "Two Star",
  "Special illustration rare",
  "One Star",
  "Holo Rare VMAX",
  "Four Diamond",
  "One Shiny",
  "Hyper rare",
  "Rare Holo LV.X",
  "ACE SPEC Rare",
  "Holo Rare VSTAR",
  "Two Shiny",
  "Rare PRIME",
  "Classic Collection",
  "LEGEND",
  "Three Star",
  "Radiant Rare",
  "Crown",
  "Shiny Ultra Rare",
  "Shiny rare V",
  "Amazing Rare",
  "Shiny rare VMAX",
  "Full Art Trainer",
  "Black White Rare",
  "Mega Hyper Rare",
]);

export const conditionEnum = pgEnum("condition", [
  "Mint",
  "Near Mint",
  "Excellent",
  "Good",
  "Light Played",
  "Played",
  "Poor",
]);

export const variantEnum = pgEnum("variant", [
  "Unlimited",
  "1st Edition",
  "Shadowless",
  "1st Edition Shadowless",
  "Reverse Holo",
]);

export const languageEnum = pgEnum("language", [
  "en",
  "fr",
  "de",
  "it",
  "es",
  "pt",
  "jp",
  "ko",
  "zh",
  "ru",
]);

/**
 * --------------------------------
 * Core data fetched from external APIs
 * -------------------------------
 */

// Set table
export const setsTable = pgTable("sets", {
  id: varchar("id", { length: 16 }).primaryKey(),
  created_at: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" })
    .notNull()
    .defaultNow(),
  name: varchar("name", { length: 128 }).notNull(),
  logo: text("logo"),
  symbol: varchar("symbol", { length: 128 }),
  releaseDate: date("release_date").notNull(),
  total: integer("total").notNull(),
  totalWithSecretRares: integer("total_with_secret_rares").notNull(),
  series: varchar("series", { length: 128 }).notNull(),
});

// Card table
export const cardsTable = pgTable("cards", {
  id: varchar("id", { length: 16 }).primaryKey(),
  created_at: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" })
    .notNull()
    .defaultNow(),
  name: varchar("name", { length: 128 }).notNull(),
  number: varchar("number", { length: 32 }).notNull(),
  rarity: rarityEnum(),
  imageSmall: text("image_small").notNull(),
  imageLarge: text("image_large").notNull(),
  setId: varchar("set_id", { length: 16 })
    .notNull()
    .references(() => setsTable.id),
});

/**
 * --------------------------------
 * User data
 * -------------------------------
 */

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().default(crypto.randomUUID()),
  discord_id: varchar("discord_id", { length: 32 }).notNull(),
  username: varchar("username", { length: 64 }).notNull(),
  avatar_url: text("avatar_url"),
  favorite_language: languageEnum(),
  created_at: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
});

export const userCardsTable = pgTable("user_cards", {
  id: uuid("id").primaryKey().default(crypto.randomUUID()),
  user_id: uuid("user_id").notNull(),
  card_id: uuid("card_id").notNull(),
  language: languageEnum(),
  variant: variantEnum(),
  condition: conditionEnum(),
  notes: text("notes"),
  created_at: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" })
    .notNull()
    .defaultNow(),
});

export const collectionsTable = pgTable("collections", {
  id: uuid("id").primaryKey().default(crypto.randomUUID()),
  created_at: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" })
    .notNull()
    .defaultNow(),
  name: varchar("name", { length: 128 }).notNull(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => usersTable.id),
});

export const collectionCardsTable = pgTable("collection_cards", {
  id: uuid("id").primaryKey().default(crypto.randomUUID()),
  created_at: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" })
    .notNull()
    .defaultNow(),
  collection_id: uuid("collection_id")
    .notNull()
    .references(() => collectionsTable.id),
  card_id: varchar("id", { length: 16 })
    .notNull()
    .references(() => cardsTable.id),
  user_card_id: uuid("user_card_id").references(() => userCardsTable.id),
});
