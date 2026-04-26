import { config } from "dotenv";
config();
config({ path: ".env.local" });

import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Testing database connection...\n");

  // ── Connection ────────────────────────────────────────────────────────────
  await prisma.$queryRaw`SELECT 1`;
  console.log("✓ Connected to Neon PostgreSQL");

  // ── System ItemTypes ──────────────────────────────────────────────────────
  const itemTypes = await prisma.itemType.findMany({
    where: { isSystem: true },
    orderBy: { name: "asc" },
  });
  console.log(`\n✓ System ItemTypes (${itemTypes.length}):`);
  for (const t of itemTypes) {
    console.log(`    ${t.color}  ${t.icon.padEnd(12)}  ${t.name}`);
  }

  // ── Demo user ─────────────────────────────────────────────────────────────
  const user = await prisma.user.findUnique({
    where: { email: "demo@devstash.io" },
  });
  if (!user) throw new Error("Demo user not found — did you run the seed?");
  console.log(`\n✓ Demo user:`);
  console.log(`    email=${user.email}  name=${user.name}  isPro=${user.isPro}`);
  console.log(`    password=${user.password ? "hashed ✓" : "missing ✗"}  emailVerified=${user.emailVerified?.toISOString() ?? "null"}`);

  // ── Collections + item counts ─────────────────────────────────────────────
  const collections = await prisma.collection.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
    include: {
      items: {
        include: { item: { include: { itemType: true } } },
      },
    },
  });
  console.log(`\n✓ Collections (${collections.length}):`);
  for (const col of collections) {
    console.log(`    "${col.name}" — ${col.items.length} item(s)`);
    for (const { item } of col.items) {
      const label = item.url ?? item.title;
      console.log(`        [${item.itemType.name}] ${label}`);
    }
  }

  // ── Total row counts ──────────────────────────────────────────────────────
  const [users, items, itemCollections, tags] = await Promise.all([
    prisma.user.count(),
    prisma.item.count(),
    prisma.itemCollection.count(),
    prisma.tag.count(),
  ]);
  console.log(`\n✓ Row counts:`);
  console.log(`    users=${users}  items=${items}  itemCollections=${itemCollections}  tags=${tags}`);

  console.log("\nAll checks passed.");
}

main()
  .catch((e) => {
    console.error("Database test failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
