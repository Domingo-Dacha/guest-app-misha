import { AppShell } from "@/components/domingo/app-shell";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requirePageSession } from "@/lib/auth/server-session";
import { DialogDemo } from "./dialog-demo";

export const dynamic = "force-dynamic";

export default async function ComponentsPage() {
  await requirePageSession();
  return (
    <AppShell>
      <section className="hero hero--compact">
        <p className="eyebrow">Domingo UI</p>
        <h1>Компоненты шаблона</h1>
        <p>
          Копируйте сценарии, а не стили: используйте готовые роли и состояния.
        </p>
      </section>
      <section className="section component-stack">
        <Card>
          <p className="eyebrow">Кнопки</p>
          <h2>Четыре роли</h2>
          <div className="component-row">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button disabled>Disabled</Button>
          </div>
        </Card>
        <Card>
          <p className="eyebrow">Поля</p>
          <h2>Подписи и состояния</h2>
          <div className="form-grid">
            <label>
              Имя гостя
              <input placeholder="Например, Анна" />
            </label>
            <label>
              Тема
              <select defaultValue="question">
                <option value="question">Вопрос</option>
                <option value="service">Услуга</option>
              </select>
            </label>
            <label className="field-error">
              Поле с ошибкой
              <input defaultValue="Некорректное значение" aria-invalid="true" />
              <span>Проверьте значение</span>
            </label>
            <label>
              Недоступное поле
              <input disabled value="Недоступно" readOnly />
            </label>
          </div>
        </Card>
        <Card>
          <p className="eyebrow">Системные сообщения</p>
          <h2>Статусы</h2>
          <div className="component-stack component-stack--small">
            <Alert>Нейтральная подсказка без тревоги.</Alert>
            <Alert tone="success">Данные сохранены.</Alert>
            <Alert tone="warning">Нужно проверить условия.</Alert>
            <Alert tone="danger">Не удалось загрузить данные.</Alert>
          </div>
        </Card>
        <Card>
          <p className="eyebrow">Loading и empty</p>
          <h2>Состояния экрана</h2>
          <div className="state-grid">
            <div className="skeleton-card" aria-label="Загрузка">
              <span />
              <span />
              <span />
            </div>
            <div className="empty-state">
              <strong>Пока ничего нет</strong>
              <p>После первого действия здесь появится результат.</p>
            </div>
          </div>
        </Card>
        <Card>
          <p className="eyebrow">Dialog / bottom sheet</p>
          <h2>Подтверждение</h2>
          <DialogDemo />
        </Card>
      </section>
    </AppShell>
  );
}
