import { NextResponse } from "next/server";

import { createGuestRequestSchema } from "@/data/contracts/guest-request";
import { guestRequestRepository } from "@/data/repositories/postgres-guest-request-repository";
import { hasValidSession } from "@/lib/auth/server-session";
import { demoWritesEnabled, getDatabaseUrl } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function authorize() {
  return (await hasValidSession())
    ? null
    : NextResponse.json({ error: "Нужен PIN" }, { status: 401 });
}

export async function GET() {
  const denied = await authorize();
  if (denied) return denied;
  if (!getDatabaseUrl()) {
    return NextResponse.json(
      { error: "База заявок не настроена", items: [] },
      { status: 503 },
    );
  }
  try {
    return NextResponse.json({
      items: await guestRequestRepository.listRecent(20),
    });
  } catch {
    return NextResponse.json(
      { error: "Не удалось загрузить заявки" },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  const denied = await authorize();
  if (denied) return denied;
  if (!demoWritesEnabled()) {
    return NextResponse.json(
      { error: "В этом preview сохранение выключено" },
      { status: 403 },
    );
  }
  if (!getDatabaseUrl()) {
    return NextResponse.json(
      { error: "База заявок не настроена" },
      { status: 503 },
    );
  }

  const parsed = createGuestRequestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Проверьте поля заявки",
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }
  try {
    const item = await guestRequestRepository.create(parsed.data);
    return NextResponse.json({ item }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Не удалось сохранить заявку" },
      { status: 503 },
    );
  }
}
