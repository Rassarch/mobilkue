import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const createPrismaClient = () => {
  const url = process.env.DATABASE_URL;

  // 1. Jika URL tidak ada (misal saat build), gunakan client standar tanpa adapter 
  // agar tidak crash saat "collecting page configuration".
  if (!url) {
    return new PrismaClient();
  }
  
  // 2. Inisialisasi adapter langsung dengan URL database (Prisma 7)
  const adapter = new PrismaMariaDb(url);
  
  // 3. Return client dengan adapter tersebut
  return new PrismaClient({ adapter });
};


export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;