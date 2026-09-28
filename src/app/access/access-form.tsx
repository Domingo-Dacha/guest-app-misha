"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function AccessForm() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/access", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error || "Не удалось войти");
      router.push("/");
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Не удалось войти");
      setLoading(false);
    }
  }

  return (
    <form className="access-form" onSubmit={submit}>
      <label htmlFor="pin">PIN команды</label>
      <input
        id="pin"
        name="pin"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]{6}"
        maxLength={6}
        placeholder="••••••"
        value={pin}
        onChange={(event) =>
          setPin(event.target.value.replace(/\D/g, "").slice(0, 6))
        }
        required
        autoFocus
      />
      <p className="field-help">Шесть цифр. PIN выдаёт лидер команды.</p>
      {error && <Alert tone="danger">{error}</Alert>}
      <Button type="submit" disabled={pin.length !== 6 || loading}>
        {loading ? "Проверяем…" : "Открыть приложение"}
      </Button>
    </form>
  );
}
