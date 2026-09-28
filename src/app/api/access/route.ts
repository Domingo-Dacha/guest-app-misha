import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { verifyPin } from "@/lib/auth/pin";
import {
  clearPinFailures,
  isPinBlocked,
  recordPinFailure,
} from "@/lib/auth/rate-limit";
import {
  createSessionToken,
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
} from "@/lib/auth/token";
import { getTeamSlug } from "@/lib/env";

export const runtime = "nodejs";

const inputSchema = z.object({ pin: z.string().regex(/^\d{6}$/) });

export async function POST(request: Request) {
  const salt = process.env.APP_PIN_SALT;
  const expectedHash = process.env.APP_PIN_HASH;
  const sessionSecret = process.env.SESSION_SECRET;
  if (!salt || !expectedHash || !sessionSecret || !process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "Доступ пока не настроен", code: "ACCESS_NOT_CONFIGURED" },
      { status: 503 },
    );
  }

  try {
    if (await isPinBlocked(request)) {
      return NextResponse.json(
        { error: "Слишком много попыток. Попробуйте позже." },
        { status: 429 },
      );
    }

    const parsed = inputSchema.safeParse(await request.json());
    const valid = parsed.success
      ? await verifyPin(parsed.data.pin, salt, expectedHash)
      : false;
    if (!valid) {
      await recordPinFailure(request);
      return NextResponse.json({ error: "Неверный PIN" }, { status: 401 });
    }

    await clearPinFailures(request);
    const token = createSessionToken(getTeamSlug(), sessionSecret);
    (await cookies()).set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_TTL_SECONDS,
      priority: "high",
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Не удалось проверить PIN. Попробуйте ещё раз." },
      { status: 503 },
    );
  }
}
