"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Camera, Send } from "lucide-react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { SupportCategory } from "@/data/contracts/support";

type FormState = "idle" | "loading" | "error";

export function TicketForm({ categories }: { categories: SupportCategory[] }) {
  const router = useRouter();
  const [state, setState] = useState<FormState>("idle");
  const [category, setCategory] = useState(categories[0]?.title ?? "Другое");
  const [message, setMessage] = useState("");
  const [urgent, setUrgent] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setError("");

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          kind: "help",
          message: `[${category}] ${urgent ? "Срочно: " : ""}${message}`,
          idempotencyKey: crypto.randomUUID(),
        }),
      });
      const payload = (await response.json()) as {
        error?: string;
        item?: { id: string };
      };
      if (!response.ok || !payload.item) {
        throw new Error(payload.error || "Не удалось отправить обращение");
      }
      router.push(`/tickets/${payload.item.id}`);
      router.refresh();
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Не удалось отправить обращение",
      );
      setState("error");
    }
  }

  return (
    <form className="ticket-form" onSubmit={submit}>
      <div className="ticket-form__header">
        <div>
          <p className="eyebrow">Не получилось самостоятельно?</p>
          <h2 id="ticket-form-title">Создать обращение</h2>
        </div>
        <span className="response-time">Ответим в течение 5 минут</span>
      </div>

      <div className="ticket-form__fields">
        <label>
          Что случилось
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {categories.map((item) => (
              <option key={item.id} value={item.title}>
                {item.title}
              </option>
            ))}
            <option value="Другое">Другое</option>
          </select>
        </label>
        <label>
          Опишите проблему
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Например: проектор включается, но не показывает изображение"
            minLength={3}
            maxLength={1800}
            required
          />
        </label>
      </div>

      <div className="ticket-form__footer">
        <label className="urgent-toggle">
          <input
            type="checkbox"
            checked={urgent}
            onChange={(event) => setUrgent(event.target.checked)}
          />
          <span>
            <strong>Это срочно</strong>
            <small>Есть риск для людей или имущества</small>
          </span>
        </label>
        <div className="ticket-form__actions">
          <span className="attachment-hint">
            <Camera aria-hidden size={18} /> Фото — следующим шагом
          </span>
          <Button type="submit" disabled={state === "loading"}>
            <Send aria-hidden size={18} />
            {state === "loading" ? "Отправляем…" : "Отправить"}
          </Button>
        </div>
      </div>
      {state === "error" && <Alert tone="danger">{error}</Alert>}
    </form>
  );
}
