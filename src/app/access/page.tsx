import { redirect } from "next/navigation";
import { DomingoLogo } from "@/components/domingo/logo";
import { hasValidSession } from "@/lib/auth/server-session";
import { AccessForm } from "./access-form";

export default async function AccessPage() {
  if (await hasValidSession()) redirect("/");
  return (
    <main className="access-page">
      <section className="access-card">
        <DomingoLogo />
        <div>
          <p className="eyebrow">Закрытое тестовое окружение</p>
          <h1>Введите PIN команды</h1>
          <p>
            Здесь только вымышленные данные. Не вводите контакты реальных
            гостей.
          </p>
        </div>
        <AccessForm />
      </section>
    </main>
  );
}
