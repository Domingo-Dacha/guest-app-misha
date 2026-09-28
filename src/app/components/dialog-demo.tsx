"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DialogDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Открыть диалог
      </Button>
      {open && (
        <div
          className="dialog-backdrop"
          role="presentation"
          onMouseDown={() => setOpen(false)}
        >
          <section
            className="dialog-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className="icon-button"
              onClick={() => setOpen(false)}
              aria-label="Закрыть"
            >
              <X size={20} />
            </button>
            <p className="eyebrow">Пример компонента</p>
            <h2 id="dialog-title">Подтвердить действие?</h2>
            <p>На телефоне этот блок превращается в удобный нижний лист.</p>
            <div className="dialog-actions">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Отмена
              </Button>
              <Button onClick={() => setOpen(false)}>Подтвердить</Button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
