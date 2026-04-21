import { PrismaClient } from "@prisma/client";
import { PrismaTiDBServerless } from "./tidb-adapter";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const createPrismaClient = () => {
  // Use DATABASE_URL in mysql:// format — the custom adapter parses it
  // and connects via HTTPS (not TCP), which works on Vercel serverless.
  const url = process.env.DATABASE_URL
    || "mysql://2PVtTjBcgFUDZjP.root:UqHh33Gnjn5EN4LS@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test";

  const adapter = new PrismaTiDBServerless({ url });

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