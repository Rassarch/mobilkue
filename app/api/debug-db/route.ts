import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const diagnostics: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    env: {
      TIDB_HOST: process.env.TIDB_HOST ? "✅ set" : "❌ MISSING",
      TIDB_PORT: process.env.TIDB_PORT ? "✅ set" : "❌ MISSING",
      TIDB_USER: process.env.TIDB_USER ? "✅ set" : "❌ MISSING",
      TIDB_PASSWORD: process.env.TIDB_PASSWORD ? "✅ (hidden)" : "❌ MISSING",
      TIDB_DATABASE: process.env.TIDB_DATABASE ? "✅ set" : "❌ MISSING",
      DATABASE_URL: process.env.DATABASE_URL ? "✅ (hidden)" : "❌ MISSING",
    },
  };

  try {
    const { PrismaMariaDb } = await import("@prisma/adapter-mariadb");
    const { PrismaClient } = await import("@prisma/client");

    const adapter = new PrismaMariaDb({
      host: process.env.TIDB_HOST || "gateway01.ap-southeast-1.prod.aws.tidbcloud.com",
      port: Number(process.env.TIDB_PORT || 4000),
      user: process.env.TIDB_USER || "2PVtTjBcgFUDZjP.root",
      password: process.env.TIDB_PASSWORD || "UqHh33Gnjn5EN4LS",
      database: process.env.TIDB_DATABASE || "test",
      ssl: { rejectUnauthorized: true },
    });

    const prisma = new PrismaClient({ adapter });

    const carCount = await prisma.car.count();
    await prisma.$disconnect();

    diagnostics.database = {
      status: "✅ Connected",
      carCount,
    };
  } catch (error: unknown) {
    const err = error as Error & { code?: string; errno?: number };
    diagnostics.database = {
      status: "❌ Failed",
      message: err.message,
      code: err.code,
      errno: err.errno,
      stack: err.stack?.split("\n").slice(0, 5),
    };
  }

  return NextResponse.json(diagnostics, { status: 200 });
}
