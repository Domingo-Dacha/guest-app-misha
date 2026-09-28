"use client";

import { useEffect, useState } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { GuestRequest } from "@/data/contracts/guest-request";

type RequestState = "idle" | "loading" | "success" | "error";

export function RequestDemo() {
  const [state, setState] = useState<RequestState>("idle");
  const [message, setMessage] = useState(
    "Подскажите, можно ли заказать завтрак к 09:00?",
  );
  const [items, setItems] = useState<GuestRequest[]>([]);
  const [error, setError] = useState("");

  async function fetchItems() {
    const response = await fetch("/api/requests", { cache: "no-store" });
    if (!response.ok) return [];
    const payload = (await response.json()) as { items: GuestRequest[] };
    return payload.items;
  }

  useEffect(() => {
    let active = true;
    void fetchItems().then((loadedItems) => {
      if (active) setItems(loadedItems);
    });
    return () => {
      active = false;
    };
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setError("");
    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          kind: "question",
          guestName: "Тестовый гость",
          message,
          idempotencyKey: crypto.randomUUID(),
        }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok)
        throw new Error(payload.error || "Не удалось сохранить заявку");
      setState("success");
      setItems(await fetchItems());
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Неизвестная ошибка");
      setState("error");
    }
  }

  return (
    <div className="request-demo">
      <form onSubmit={submit}>
        <label htmlFor="request-message">Сообщение</label>
        <textarea
          id="request-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          minLength={3}
          maxLength={2000}
          required
        />
        <Button type="submit" disabled={state === "loading"}>
          {state === "loading" ? "Сохраняем…" : "Сохранить тестовую заявку"}
        </Button>
      </form>
      {state === "success" && (
        <Alert tone="success">Заявка сохранена на сервере.</Alert>
      )}
      {state === "error" && <Alert tone="danger">{error}</Alert>}
      <div className="request-list">
        <h3>Последние заявки</h3>
        {items.length === 0 ? (
          <p className="muted">После подключения БД заявки появятся здесь.</p>
        ) : (
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                <span>{item.message}</span>
                <time dateTime={item.createdAt}>
                  {new Intl.DateTimeFormat("ru-RU", {
                    dateStyle: "short",
                    timeStyle: "short",
                  }).format(new Date(item.createdAt))}
                </time>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
