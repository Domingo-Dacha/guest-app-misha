import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  MessageCircle,
  Phone,
  PlayCircle,
  Send,
  Ticket,
} from "lucide-react";

import { AppShell } from "@/components/domingo/app-shell";
import { SupportIcon } from "@/components/domingo/support-icon";
import { TicketForm } from "@/components/domingo/ticket-form";
import type { SupportContact } from "@/data/contracts/support";
import { fixtureSupportRepository } from "@/data/repositories/fixture-support-repository";
import { requirePageSession } from "@/lib/auth/server-session";

export const dynamic = "force-dynamic";

function ContactIcon({ kind }: { kind: SupportContact["kind"] }) {
  if (kind === "phone") return <Phone aria-hidden size={22} />;
  if (kind === "telegram") return <Send aria-hidden size={22} />;
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
        <div className="care-pulse" aria-label="Служба заботы доступна">
          <span className="care-pulse__dot" />
          <div>
            <strong>Мы на связи</strong>
            <small>Среднее время ответа — 5 минут</small>
          </div>
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
        </div>
        <p className="contact-note">
          При запахе гари, дыма или угрозе безопасности сначала выйдите из дома,
          затем звоните в службу заботы.
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
        <div className="category-grid">
          {categories.map((category) => {
            const categoryInstructions = instructions.filter(
              (instruction) => instruction.categoryId === category.id,
            );
            return (
              <article className="category-card" key={category.id}>
                <div className="category-card__heading">
                  <span className="support-icon support-icon--large">
                    <SupportIcon name={category.icon} />
                  </span>
                  <div>
                    <h3>{category.title}</h3>
                    <p>{category.description}</p>
                  </div>
                </div>
                {categoryInstructions.length > 0 ? (
                  <ul>
                    {categoryInstructions.map((instruction) => (
                      <li key={instruction.slug}>
                        <Link href={`/instructions/${instruction.slug}`}>
                          {instruction.shortTitle}
                          <ArrowRight aria-hidden size={16} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="category-card__empty">
                    Инструкции добавим на следующем шаге
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section
        className="section ticket-form-section"
        id="ticket-form"
        aria-labelledby="ticket-form-title"
      >
        <TicketForm categories={categories} />
      </section>

      <nav className="mobile-dock" aria-label="Быстрая навигация">
        <Link href="/">
          <MessageCircle aria-hidden size={20} />
          Помощь
        </Link>
        <a href="#ticket-form">
          <Send aria-hidden size={20} />
          Написать
        </a>
        <Link href="/tickets">
          <Ticket aria-hidden size={20} />
          Обращения
        </Link>
      </nav>
    </AppShell>
  );
}
