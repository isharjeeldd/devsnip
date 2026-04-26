// Prisma 7: driver adapter is required — PrismaClient no longer bundles a query engine.
// Import from the generated output path, not "@prisma/client".
// DATABASE_URL = Neon pooled connection string (app runtime, high concurrency).
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

function makePrismaClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });
  return new PrismaClient({ adapter });
}

type PrismaClientSingleton = ReturnType<typeof makePrismaClient>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? makePrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
