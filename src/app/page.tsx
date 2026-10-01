import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Mail,
  MessageCircle,
  MessagesSquare,
  Phone,
  PlayCircle,
  Send,
  Ticket,
} from "lucide-react";

import { AppShell } from "@/components/domingo/app-shell";
import { SupportIcon } from "@/components/domingo/support-icon";
import { SupportSearch } from "@/components/domingo/support-search";
import { TicketDialog } from "@/components/domingo/ticket-dialog";
import type { SupportContact } from "@/data/contracts/support";
import { fixtureSupportRepository } from "@/data/repositories/fixture-support-repository";
import { requirePageSession } from "@/lib/auth/server-session";

export const dynamic = "force-dynamic";

function ContactIcon({ kind }: { kind: SupportContact["kind"] }) {
  if (kind === "phone") return <Phone aria-hidden size={22} />;
  if (kind === "telegram") return <Send aria-hidden size={22} />;
  if (kind === "email") return <Mail aria-hidden size={22} />;
  if (kind === "max") return <MessagesSquare aria-hidden size={22} />;
  return <MessageCircle aria-hidden size={22} />;
}

export default async function Home() {
  await requirePageSession();
  const [contacts, categories, instructions] = await Promise.all([
    fixtureSupportRepository.listContacts(),
    fixtureSupportRepository.listCategories(),
    fixtureSupportRepository.listInstructions(),
  ]);
  const featured = instructions.filter((instruction) => instruction.featured);

  return (
    <AppShell>
      <section className="support-hero">
        <div className="support-hero__copy">
          <p className="eyebrow">Служба заботы · на связи круглосуточно</p>
          <h1>Помощь рядом</h1>
          <p>
            Быстрые инструкции по дому и понятный способ позвать человека, если
            что-то пошло не так.
          </p>
          <Link className="inline-link" href="/tickets">
            <Ticket aria-hidden size={18} /> Мои обращения
            <ArrowRight aria-hidden size={17} />
          </Link>
        </div>
      </section>

      <section className="contact-section" aria-labelledby="contact-title">
        <div className="section-heading section-heading--compact">
          <div>
            <p className="eyebrow">Нужен человек прямо сейчас?</p>
            <h2 id="contact-title">Связаться со службой заботы</h2>
          </div>
          <span className="demo-label">Демо-каналы</span>
        </div>
        <div className="contact-grid">
          {contacts.map((contact) => (
            <a className="contact-card" href={contact.href} key={contact.id}>
              <span
                className={`contact-card__icon contact-card__icon--${contact.kind}`}
              >
                <ContactIcon kind={contact.kind} />
              </span>
              <span>
                <strong>{contact.label}</strong>
                <small>{contact.description}</small>
              </span>
              <ArrowRight aria-hidden size={18} />
            </a>
          ))}
          <TicketDialog categories={categories} triggerVariant="contact" />
        </div>
        <p className="contact-note">
          При запахе гари, дыма или угрозе безопасности сначала выйдите из дома,
          затем позвоните 112 и в службу заботы.
        </p>
      </section>

      <section className="section" aria-labelledby="popular-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Чаще всего помогает за пару минут</p>
            <h2 id="popular-title">С чего начать</h2>
          </div>
          <span className="status-badge">Короткие инструкции</span>
        </div>
        <div className="featured-help-grid">
          {featured.map((instruction) => (
            <Link
              className="featured-help-card"
              href={`/instructions/${instruction.slug}`}
              key={instruction.slug}
            >
              <div className="featured-help-card__visual">
                <Image
                  src={instruction.media.src}
                  alt={instruction.media.alt}
                  fill
                  unoptimized
                  sizes="(max-width: 760px) 50vw, 25vw"
                />
                <span className="media-pill">
                  {instruction.media.kind === "video" ? (
                    <PlayCircle aria-hidden size={16} />
                  ) : null}
                  {instruction.media.label}
                </span>
              </div>
              <div className="featured-help-card__body">
                <span className="support-icon">
                  <SupportIcon name={instruction.icon} />
                </span>
                <h3>{instruction.shortTitle}</h3>
                <span className="read-time">
                  <Clock3 aria-hidden size={15} /> {instruction.durationMinutes}{" "}
                  мин
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="categories-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Все вопросы по дому</p>
            <h2 id="categories-title">Выберите категорию</h2>
          </div>
        </div>
        <SupportSearch categories={categories} instructions={instructions} />
      </section>

      <nav className="mobile-dock" aria-label="Быстрая навигация">
        <Link href="/">
          <MessageCircle aria-hidden size={20} />
          Помощь
        </Link>
        <TicketDialog categories={categories} triggerVariant="dock" />
        <Link href="/tickets">
          <Ticket aria-hidden size={20} />
          Обращения
        </Link>
      </nav>
    </AppShell>
  );
}
