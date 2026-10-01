"use client";

import { ArrowRight, Search, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { SupportIcon } from "@/components/domingo/support-icon";
import type {
  SupportCategory,
  SupportInstruction,
} from "@/data/contracts/support";

export function SupportSearch({
  categories,
  instructions,
}: {
  categories: SupportCategory[];
  instructions: SupportInstruction[];
}) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase("ru");

  const results = useMemo(
    () =>
      categories
        .map((category) => {
          const categoryInstructions = instructions.filter(
            (instruction) => instruction.categoryId === category.id,
          );
          if (!normalizedQuery) {
            return { category, instructions: categoryInstructions };
          }

          const categoryMatches = `${category.title} ${category.description}`
            .toLocaleLowerCase("ru")
            .includes(normalizedQuery);
          const matchingInstructions = categoryInstructions.filter(
            (instruction) =>
              `${instruction.title} ${instruction.shortTitle} ${instruction.summary} ${instruction.steps.map((step) => `${step.title} ${step.text}`).join(" ")}`
                .toLocaleLowerCase("ru")
                .includes(normalizedQuery),
          );

          return categoryMatches || matchingInstructions.length > 0
            ? {
                category,
                instructions: categoryMatches
                  ? categoryInstructions
                  : matchingInstructions,
              }
            : null;
        })
        .filter((item): item is NonNullable<typeof item> => item !== null),
    [categories, instructions, normalizedQuery],
  );

  return (
    <>
      <label className="support-search">
        <Search aria-hidden size={20} />
        <span className="sr-only">Поиск по инструкциям и категориям</span>
        <input
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Поиск: Wi-Fi, камин, горячая вода…"
          type="search"
          value={query}
        />
        {query ? (
          <button
            aria-label="Очистить поиск"
            onClick={() => setQuery("")}
            type="button"
          >
            <X aria-hidden size={18} />
          </button>
        ) : null}
      </label>

      {results.length > 0 ? (
        <div className="category-grid">
          {results.map(({ category, instructions: categoryInstructions }) => (
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
          ))}
        </div>
      ) : (
        <div className="support-search__empty">
          <strong>Ничего не нашли</strong>
          <p>Попробуй короткий запрос или создай обращение — разберёмся.</p>
        </div>
      )}
    </>
  );
}
