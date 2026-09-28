# Domingo Guest Lab

Универсальный мобильный веб-шаблон для трёх конкурсных команд. Он открывается
по обычной ссылке на iPhone и Android, не зависит от Telegram и не задаёт
продуктовую идею заранее.

Внутри уже есть дизайн-система Domingo, страница компонентов, одинаковые
тестовые данные, серверный слой заявок, короткий PIN и проверки для GitHub
Actions. Рабочие базы, платежи, реальные сообщения и персональные данные сюда
не подключаются.

Версия конкурсной основы и контрольные суммы зафиксированы в
`STARTER-MANIFEST.json`. Перед сессией все три репозитория создаются из одного
тега `competition-starter-v1`.

## Быстрый старт

Нужен Node.js 24 (версия зафиксирована в `.nvmrc`) и отдельная PostgreSQL-база
команды в Neon.

```powershell
npm ci
Copy-Item .env.example .env.local
npm run secrets:generate
```

Команда генерации выведет значения для `.env.local`. Укажи также
`DATABASE_URL`, уникальный `TEAM_SLUG` и поставь
`DEMO_WRITES_ENABLED=true` только в основном demo deployment команды.

```powershell
npm run db:migrate
npm run dev
```

Открой `http://localhost:3000/access`. Каталог компонентов находится на
`/components` после входа.

## Где что лежит

- `src/components/ui` — кнопки, карточки и базовые состояния;
- `src/components/domingo` — композиционные компоненты Domingo;
- `src/app/globals.css` — токены, адаптивная сетка и состояния;
- `src/data/contracts` — Zod-контракты и интерфейсы репозиториев;
- `src/data/fixtures` — общие тестовые дома, услуги, инструкции, бронь и отдых;
- `src/data/repositories` — переключаемые источники данных;
- `src/app/api/requests` — серверное сохранение и чтение тестовых заявок;
- `db/migrations` — схема PostgreSQL;
- `tests` — contract, unit и mobile/desktop smoke tests.

Экран не должен импортировать fixture напрямую: получай данные через
репозиторий. Так конкурсный интерфейс позже можно перенести на рабочий источник
без полной переделки.

## Команды

```text
npm run dev            локальная разработка
npm run verify         lint + TypeScript + unit tests + production build
npm run test:e2e       mobile WebKit и desktop Chromium smoke
npm run format         форматирование
npm run db:migrate     применить схему в выбранной тестовой базе
npm run db:reset-demo  удалить только заявки текущего TEAM_SLUG
```

Сброс специально требует явного подтверждения:

```powershell
$env:RESET_DEMO_DATA = "yes"
npm run db:reset-demo
Remove-Item Env:RESET_DEMO_DATA
```

## Публикация

Конкурсные репозитории приватные и принадлежат GitHub-организации. Бесплатный
Vercel Hobby не умеет автоматически публиковать такие репозитории, поэтому на
конкурсе используем Vercel CLI. GitHub Actions по-прежнему проверяет каждый
push, но публикацию запускаем отдельно после зелёной проверки.

В первый раз свяжи локальную копию с уже созданным проектом команды и явно
задай Next.js preset:

```powershell
npx vercel link --yes --project guest-app-<team> --scope domingo-dacha
npx vercel project update guest-app-<team> --framework nextjs --yes --scope domingo-dacha
```

`<team>` — `nina`, `misha` или `valeria`. После изменений обнови постоянную
ссылку одной командой из корня репозитория:

```powershell
npx vercel deploy --prod --yes --scope domingo-dacha
```

Переменные из `.env.example` уже настроены в Vercel Production. У каждой
команды отдельная Neon-база, свой `TEAM_SLUG`, PIN и серверные секреты;
`DEMO_WRITES_ENABLED=true` включён только для production. Если команда создаёт
Preview вручную, запись там нужно оставить выключенной.

Автодеплой из `main` можно включить позже после перехода Vercel-команды на Pro
или изменения модели владения репозиториями.

PIN не хранится открытым текстом. `APP_PIN_HASH` и `APP_PIN_SALT` создаются
через `npm run secrets:generate`; сессия подписывается `SESSION_SECRET` и живёт
12 часов. Попытки входа ограничиваются на сервере и записываются только как
HMAC-псевдоним, без сохранения IP.

## Изоляция команд

У каждой команды должны быть свой репозиторий/Vercel project, свой Neon project,
свой `TEAM_SLUG`, PIN и секреты. Таблицы дополнительно фильтруются по
`team_slug`, но это второй рубеж, а не замена отдельной базе.

## Что намеренно не сделано

Нет полноценной авторизации, админки, PWA/offline, production-интеграций и
реальных отправок. Это конкурсная основа, которую можно безопасно разобрать на
полезные решения и перенести в основной Domingo Next.
