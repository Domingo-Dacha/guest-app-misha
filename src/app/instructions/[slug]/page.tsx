import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Clock3,
  MessageCircle,
  Phone,
  PlayCircle,
} from "lucide-react";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/domingo/app-shell";
import { SupportIcon } from "@/components/domingo/support-icon";
import { fixtureSupportRepository } from "@/data/repositories/fixture-support-repository";
import { requirePageSession } from "@/lib/auth/server-session";

export const dynamic = "force-dynamic";

export default async function InstructionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requirePageSession();
  const { slug } = await params;
  const instruction = await fixtureSupportRepository.getInstruction(slug);
  if (!instruction) notFound();

  const related = (await fixtureSupportRepository.listInstructions())
    .filter(
      (item) =>
        item.categoryId === instruction.categoryId &&
        item.slug !== instruction.slug,
    )
    .slice(0, 2);

  return (
    <AppShell>
      <div className="page-back-row">
        <Link className="back-link" href="/">
          <ArrowLeft aria-hidden size={18} /> Все инструкции
        </Link>
        <span className="read-time">
          <Clock3 aria-hidden size={15} /> {instruction.durationMinutes} мин
        </span>
      </div>

      <article className="instruction-page">
        <div className="instruction-page__intro">
          <span className="support-icon support-icon--large">
            <SupportIcon name={instruction.icon} />
          </span>
          <p className="eyebrow">Пошаговая инструкция</p>
          <h1>{instruction.title}</h1>
          <p>{instruction.summary}</p>
        </div>

        <div className="instruction-media">
          <Image
            src={instruction.media.src}
            alt={instruction.media.alt}
            fill
            priority
            unoptimized
            sizes="(max-width: 760px) 100vw, 900px"
          />
          <span className="instruction-media__label">
            {instruction.media.kind === "video" ? (
              <PlayCircle aria-hidden size={22} />
            ) : null}
            {instruction.media.label}
          </span>
        </div>

        <div className="instruction-layout">
          <section className="instruction-steps" aria-labelledby="steps-title">
            <p className="eyebrow">Делайте по порядку</p>
            <h2 id="steps-title">Всего {instruction.steps.length} шага</h2>
            <ol>
              {instruction.steps.map((step, index) => (
                <li key={step.title}>
                  <span>{index + 1}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            {instruction.note ? (
              <div className="safety-note">
                <strong>Важно</strong>
                <p>{instruction.note}</p>
              </div>
            ) : null}
          </section>

          <aside className="support-aside">
            <p className="eyebrow">Не получилось?</p>
            <h2>Мы поможем</h2>
            <p>
              Не тратьте отпуск на борьбу с техникой. Пришлите описание —
              разберёмся удалённо или назначим специалиста.
            </p>
            <div className="support-aside__actions">
              <Link className="button button--primary" href="/#ticket-form">
                <MessageCircle aria-hidden size={18} /> Создать обращение
              </Link>
              <Link className="button button--secondary" href="/#ticket-form">
                <Phone aria-hidden size={18} /> Позвонить
              </Link>
            </div>
          </aside>
        </div>
      </article>

      {related.length > 0 ? (
        <section className="section" aria-labelledby="related-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Может пригодиться</p>
              <h2 id="related-title">Похожие инструкции</h2>
            </div>
          </div>
          <div className="related-grid">
            {related.map((item) => (
              <Link
                className="related-card"
                href={`/instructions/${item.slug}`}
                key={item.slug}
              >
                <span className="support-icon">
                  <SupportIcon name={item.icon} />
                </span>
                <div>
                  <strong>{item.shortTitle}</strong>
                  <small>{item.summary}</small>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </AppShell>
  );
}
