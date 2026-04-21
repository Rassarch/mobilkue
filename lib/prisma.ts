import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const createPrismaClient = () => {
  // 1. Inisialisasi adapter langsung dengan URL database (Prisma 7)
  const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
  
  // 2. Return client dengan adapter tersebut
  return new PrismaClient({ adapter });
};


export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;