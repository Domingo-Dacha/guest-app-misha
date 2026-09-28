"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="error-page">
      <p className="eyebrow">Что-то пошло не так</p>
      <h1>Не удалось открыть экран</h1>
      <p>
        Попробуйте ещё раз. Если ошибка повторится, покажите её лидеру команды.
      </p>
      <Button onClick={reset}>Повторить</Button>
    </main>
  );
}
