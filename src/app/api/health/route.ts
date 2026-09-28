import { NextResponse } from "next/server";

import { getDatabaseUrl } from "@/lib/env";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    status: "ok",
    databaseConfigured: Boolean(getDatabaseUrl()),
    timestamp: new Date().toISOString(),
  });
}
