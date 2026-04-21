import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const createPrismaClient = () => {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error("DATABASE_URL is missing. Please check your environment variables.");
  }
  
  const adapter = new PrismaMariaDb(url);
  return new PrismaClient({ adapter });
};

// Gunakan Proxy untuk inisialisasi malas (lazy initialization).
// Ini mencegah crash saat fase "collecting configuration" di Vercel
// karena client hanya akan dibuat saat pertama kali properti prisma diakses.
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