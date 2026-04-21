import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const createPrismaClient = () => {
  const adapter = new PrismaMariaDb({
    host: process.env.TIDB_HOST || "gateway01.ap-southeast-1.prod.aws.tidbcloud.com",
    port: Number(process.env.TIDB_PORT || 4000),
    user: process.env.TIDB_USER || "2PVtTjBcgFUDZjP.root",
    password: process.env.TIDB_PASSWORD || "UqHh33Gnjn5EN4LS",
    database: process.env.TIDB_DATABASE || "test",
    ssl: { rejectUnauthorized: true },
  });

  return new PrismaClient({
    adapter,
    log: ["error", "warn"],
  });
};

// Gunakan Proxy untuk inisialisasi malas (lazy initialization).
// Ini mencegah crash saat fase "collecting configuration" di Vercel.
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = createPrismaClient();
    }
    const value = (globalForPrisma.prisma as any)[prop];
    if (typeof value === 'function') {
      return value.bind(globalForPrisma.prisma);
    }
    return value;
  }
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;