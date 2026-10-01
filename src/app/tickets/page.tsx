import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock3, Plus, Ticket } from "lucide-react";

import { AppShell } from "@/components/domingo/app-shell";
import type { SupportTicket } from "@/data/contracts/support";
import {
  getSupportTicketStatusLabel,
  guestRequestToSupportTicket,
} from "@/data/support-ticket";
import { fixtureSupportRepository } from "@/data/repositories/fixture-support-repository";
import { guestRequestRepository } from "@/data/repositories/postgres-guest-request-repository";
import { requirePageSession } from "@/lib/auth/server-session";
import { getDatabaseUrl } from "@/lib/env";

export const dynamic = "force-dynamic";

function formatCreatedAt(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Astrakhan",
  }).format(new Date(value));
}

export default async function TicketsPage() {
  await requirePageSession();
  const demoTickets = await fixtureSupportRepository.listDemoTickets();
  let liveTickets: SupportTicket[] = [];

  if (getDatabaseUrl()) {
    try {
      liveTickets = (await guestRequestRepository.listRecent(20)).map(
        guestRequestToSupportTicket,
      );
    } catch {
      liveTickets = [];
    }
  }

  const tickets = [...liveTickets, ...demoTickets];

  return (
    <AppShell>
      <div className="page-back-row">
        <Link className="back-link" href="/">
          <ArrowLeft aria-hidden size={18} /> Помощь
        </Link>
      </div>
      <section className="tickets-hero">
        <div>
          <p className="eyebrow">Служба заботы</p>
          <h1>Мои обращения</h1>
          <p>Следите за статусом и временем прибытия специалиста.</p>
        </div>
        <Link className="button button--primary" href="/#ticket-form">
          <Plus aria-hidden size={18} /> Новое обращение
        </Link>
      </section>

      <section className="tickets-section" aria-label="Список обращений">
        <div className="tickets-summary">
          <span>
            <Ticket aria-hidden size={18} /> {tickets.length} обращения
          </span>
          {liveTickets.length === 0 ? (
            <span className="demo-label">Показаны демо-статусы</span>
          ) : null}
        </div>
        <div className="ticket-list">
          {tickets.map((ticket) => (
            <Link
              className="ticket-card"
              href={`/tickets/${ticket.id}`}
              key={ticket.id}
            >
              <div className="ticket-card__topline">
                <span
                  className={`ticket-status ticket-status--${ticket.status}`}
                >
                  {getSupportTicketStatusLabel(ticket.status)}
                </span>
                <time dateTime={ticket.createdAt}>
                  {formatCreatedAt(ticket.createdAt)}
                </time>
              </div>
              <div className="ticket-card__body">
                <div>
                  <span className="ticket-card__category">
                    {ticket.category}
                  </span>
                  <h2>{ticket.title}</h2>
                  <p>
                    <Clock3 aria-hidden size={17} /> {ticket.eta}
                  </p>
                </div>
                <ArrowRight
                  aria-hidden
                  className="ticket-card__arrow"
                  size={22}
                />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
