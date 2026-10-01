"use client";

import { MessageCircle, Send, Ticket, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { TicketForm } from "@/components/domingo/ticket-form";
import type { SupportCategory } from "@/data/contracts/support";

type TicketDialogProps = {
  categories: SupportCategory[];
  defaultCategory?: string;
  descriptionHint?: string;
  contextLabel?: string;
  triggerLabel?: string;
  triggerVariant?: "contact" | "primary" | "dock";
};

export function TicketDialog({
  categories,
  defaultCategory,
  descriptionHint,
  contextLabel,
  triggerLabel = "Создать обращение",
  triggerVariant = "primary",
}: TicketDialogProps) {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setReady(true), 0);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        className={
          triggerVariant === "contact"
            ? "contact-card contact-card--ticket"
            : triggerVariant === "dock"
              ? "mobile-dock__action"
              : "button button--primary"
        }
        disabled={!ready}
        onClick={() => setOpen(true)}
        type="button"
      >
        {triggerVariant === "contact" ? (
          <>
            <span className="contact-card__icon contact-card__icon--ticket">
              <Ticket aria-hidden size={22} />
            </span>
            <span>
              <strong>{triggerLabel}</strong>
              <small>Опишу проблему в форме</small>
            </span>
            <Send aria-hidden size={18} />
          </>
        ) : (
          <>
            <MessageCircle aria-hidden size={18} /> {triggerLabel}
          </>
        )}
      </button>

      {ready && open
        ? createPortal(
            <div
              className="ticket-dialog"
              onMouseDown={() => setOpen(false)}
              role="presentation"
            >
              <section
                aria-labelledby="ticket-form-title"
                aria-modal="true"
                className="ticket-dialog__panel"
                onMouseDown={(event) => event.stopPropagation()}
                role="dialog"
              >
                <button
                  aria-label="Закрыть форму"
                  className="ticket-dialog__close"
                  onClick={() => setOpen(false)}
                  type="button"
                >
                  <X aria-hidden size={22} />
                </button>
                <TicketForm
                  categories={categories}
                  defaultCategory={defaultCategory}
                  descriptionHint={descriptionHint}
                  contextLabel={contextLabel}
                />
              </section>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
