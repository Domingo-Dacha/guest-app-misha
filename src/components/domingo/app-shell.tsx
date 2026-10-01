import Link from "next/link";
import type { ReactNode } from "react";

import { DomingoLogo } from "@/components/domingo/logo";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link href="/" aria-label="На главную">
          <DomingoLogo />
        </Link>
        <nav aria-label="Основная навигация">
          <Link href="/">Помощь</Link>
          <Link href="/tickets">Мои обращения</Link>
        </nav>
      </header>
      <main>{children}</main>
      <footer>Domingo Дача · служба заботы · тестовое окружение</footer>
    </div>
  );
}
