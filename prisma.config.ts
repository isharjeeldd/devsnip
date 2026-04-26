// Prisma 7: datasource url moves out of schema.prisma and lives here.
// Migrations must use a direct (non-pooled) Neon connection — PgBouncer
// transaction-mode pooling does not support the DDL Prisma migrate requires.
// Load .env first, then .env.local so local overrides win.
import { config } from "dotenv";
config();
config({ path: ".env.local" });

import { defineConfig } from "prisma/config";

// Derive the direct URL from the pooled URL if DIRECT_URL is not explicitly set.
// Neon pooled hostname:  ep-xxx.pooler.region.aws.neon.tech
// Neon direct hostname:  ep-xxx.region.aws.neon.tech  (remove ".pooler")
function resolveDirectUrl(): string {
  const direct = process.env.DIRECT_URL;
  if (direct) return direct;

  const pooled = process.env.DATABASE_URL;
  if (!pooled) throw new Error("DATABASE_URL is not set.");

  return pooled.replace(".pooler.", ".");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: resolveDirectUrl(),
  },
});
