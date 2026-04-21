import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const diagnostics: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    env: {
      DATABASE_URL: process.env.DATABASE_URL ? "✅ (hidden)" : "❌ MISSING",
    },
  };

  try {
    const { PrismaTiDBServerless } = await import("@/lib/tidb-adapter");
    const { PrismaClient } = await import("@prisma/client");

    const url = process.env.DATABASE_URL
      || "mysql://2PVtTjBcgFUDZjP.root:UqHh33Gnjn5EN4LS@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test";

    const adapter = new PrismaTiDBServerless({ url });
    const prisma = new PrismaClient({ adapter });

    const carCount = await prisma.car.count();
    await prisma.$disconnect();

    diagnostics.database = {
      status: "✅ Connected via HTTPS",
      carCount,
    };
  } catch (error: unknown) {
    const err = error as Error & { code?: string; errno?: number; cause?: Error };
    diagnostics.database = {
      status: "❌ Failed",
      message: err.message,
      code: err.code,
      errno: err.errno,
      cause: err.cause?.message,
      stack: err.stack?.split("\n").slice(0, 8),
    };
  }

  return NextResponse.json(diagnostics, { status: 200 });
}
