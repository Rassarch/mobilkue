import { PrismaClient } from "../app/generated/prisma";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import mysql from "mysql2/promise"; // Pastikan sudah install mysql2

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const createPrismaClient = () => {
  // 1. Buat pool koneksi mysql2 secara manual agar lebih stabil
  const pool = mysql.createPool(process.env.DATABASE_URL!);
  
  // 2. Bungkus ke dalam adapter Prisma
  const adapter = new PrismaMariaDb(pool);

  // 3. Return client dengan adapter tersebut
  return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;