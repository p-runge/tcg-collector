import { defineConfig } from "drizzle-kit";
import { env } from "./env";

export default defineConfig({
  out: "./drizzle",
  schema: "./lib/db/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
