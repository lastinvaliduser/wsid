import * as dotenv from "dotenv";
import * as fs from "fs";
import { defineConfig } from "prisma/config";

// Load .env.local first (Next.js convention), then fall back to .env
// This ensures Prisma CLI commands (migrate, studio) use the same credentials as the app
if (fs.existsSync(".env.local")) {
  dotenv.config({ path: ".env.local" });
} else {
  dotenv.config();
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Neon: use the non-pooling URL for migrations (pooled URL blocks DDL)
    // Vercel+Neon integration injects DATABASE_URL_UNPOOLED automatically
    // For local dev, DATABASE_URL and DATABASE_URL_UNPOOLED can be the same
    url: process.env["DATABASE_URL_UNPOOLED"] ?? process.env["DATABASE_URL"],
  },
});
