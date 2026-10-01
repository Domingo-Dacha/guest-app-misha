import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Clock3,
  MessageCircle,
  Phone,
  UserRoundCheck,
} from "lucide-react";
import { notFound } from "next/navigation";
import { z } from "zod";

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

async function getTicket(id: string): Promise<SupportTicket | null> {
  const demoTicket = await fixtureSupportRepository.getDemoTicket(id);
  if (demoTicket) return demoTicket;
  if (!z.uuid().safeParse(id).success || !getDatabaseUrl()) return null;

  try {
    const request = await guestRequestRepository.getById(id);
    return request ? guestRequestToSupportTicket(request) : null;
  } catch {
    return null;
  }
}

export default async function TicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePageSession();
  const { id } = await params;
  const ticket = await getTicket(id);
  if (!ticket) notFound();

  return (
    <AppShell>
      <div className="page-back-row">
        <Link className="back-link" href="/tickets">
          <ArrowLeft aria-hidden size={18} /> Все обращения
        </Link>
        <span className={`ticket-status ticket-status--${ticket.status}`}>
          {getSupportTicketStatusLabel(ticket.status)}
        </span>
      </div>

      <article className="ticket-detail">
        <header className="ticket-detail__header">
          <p className="eyebrow">{ticket.category}</p>
          <h1>{ticket.title}</h1>
          <div className="ticket-detail__meta">
            <div>
              <Clock3 aria-hidden size={20} />
              <span>
                <small>Ожидаемое время</small>
                <strong>{ticket.eta}</strong>
              </span>
            </div>
            <div>
              {ticket.assigneeImage ? (
                <Image
                  className="ticket-assignee__photo"
                  src={ticket.assigneeImage}
                  alt="Фото назначенного специалиста"
                  width={48}
                  height={48}
                  unoptimized
                />
              ) : (
                <UserRoundCheck aria-hidden size={20} />
              )}
              <span>
                <small>Исполнитель</small>
                <strong>{ticket.assignedTo ?? "Подбираем специалиста"}</strong>
              </span>
            </div>
          </div>
        </header>

        <section className="ticket-timeline" aria-labelledby="timeline-title">
          <p className="eyebrow">Обновления в реальном времени</p>
          <h2 id="timeline-title">Что происходит с обращением</h2>
          <ol>
            {ticket.updates.map((update) => (
              <li
                className={update.completed ? "is-complete" : ""}
                key={update.title}
              >
                <span className="ticket-timeline__marker" />
                <div>
                  <span className="ticket-timeline__time">{update.time}</span>
                  <h3>{update.title}</h3>
                  <p>{update.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <aside className="ticket-contact">
          <div>
            <p className="eyebrow">Нужно что-то уточнить?</p>
            <h2>Связаться по обращению</h2>
          </div>
          <div>
            <Link className="button button--secondary" href="/#contact-title">
              <MessageCircle aria-hidden size={18} /> Написать
            </Link>
            <Link className="button button--primary" href="/#contact-title">
              <Phone aria-hidden size={18} /> Позвонить
            </Link>
          </div>
        </aside>
      </article>
    </AppShell>
  );
}
