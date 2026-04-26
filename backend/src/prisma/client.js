// =============================================
// Prisma Client Singleton
// =============================================
// Prevents multiple Prisma Client instances in
// development due to hot-reloading.
//
// Prisma v7: Connection URL is passed via constructor,
// not env() in schema. Schema only declares provider.

const { PrismaClient } = require("../../generated/prisma");

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

/** @type {PrismaClient} */
let prisma;

const prismaOptions = {
  datasourceUrl: databaseUrl,
  log:
    process.env.NODE_ENV === "production"
      ? ["error", "warn"]
      : ["query", "error", "warn"],
};

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient(prismaOptions);
} else {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient(prismaOptions);
  }
  prisma = global.__prisma;
}

module.exports = prisma;
