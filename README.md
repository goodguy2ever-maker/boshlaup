# BoshlaUp — IDEA LAUNCHPAD 🚀

> **Платформа №1 в Узбекистане для запуска, валидации и продвижения IT-стартапов.**  
> Создавайте продукты, находите первых бета-тестеров, собирайте честный фидбек и баг-репорты.

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-teal?logo=prisma)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-emerald?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)

---

## 💡 О проекте

**BoshlaUp** — это независимый региональный запускной хаб в стиле Product Hunt и Y Combinator, созданный специально для IT-экосистемы Узбекистана.

### Основные возможности

- 🚀 **Быстрая публикация проектов (Wizard `/submit`)**:
  - Пошаговый запуск MVP за 3 минуты.
  - Выбор целевого региона (Ташкент, Самарканд, Бухара, Фергана, Андижан, Наманган, Весь Узбекистан, Global).
  - Умный парсинг контактов фаундера: автоматическое определение `@username`, `t.me/...` и телефонных номеров `+998...`.
  - Только реальные логотипы (без фейковых баннеров).

- 🧪 **Мотивация бета-тестеров**:
  - Офферы и бонусы от фаундеров первым пользователям (скидки, пожизненный доступ, VIP-статусы).
  - Структурированный трекинг обратной связи: разделение на «Идея», «Баг», «Похвала», «Вопрос» с управлением статусами («В работе», «Решено»).

- 📊 **Аналитический дашборд администратора (`/admin`)**:
  - Строгий доступ только для администратора (`@nazarov_df`, Telegram ID `5463769569`).
  - Метрики реального времени: всего пользователей, стартапов, апвоутов, кликов по сайтам.
  - Графики процентного распределения по стадиям развития (Идея, MVP, Первые продажи) и регионам.
  - Рейтинги вовлеченности: топ проектов по кликам перехода (CTR), апвоутам и активности обсуждений.
  - Полный реестр проектов с поиском и фильтрами.

- 🤖 **Интеграция с Telegram**:
  - Вход без паролей по 6-значному PIN-коду через Telegram-бота (`@boshlaupbot`).
  - Автоматический автопостинг каждого нового стартапа в канал (`@boshlaup`) с фотографией и кнопками действий.
  - Серверный вебхук (`/api/telegram/webhook`) для работы на Vercel без отдельного сервера.

- 🌐 **SEO & Geo-оптимизация**:
  - Динамическая серверная генерация метатегов `generateMetadata` для каждого стартапа.
  - Динамический генератор карточек соцсетей (`/api/og`) с превью высокого разрешения (1200×630px).
  - Микроразметка Schema.org (`SoftwareApplication` / `Organization` / `WebSite`) для Google и Yandex.
  - Географические метатеги (`geo.region`, `geo.placename`, `geo.position`, `ICBM`).
  - Автоматические `robots.txt` и `sitemap.xml`.

- 🛡️ **Безопасность (Security)**:
  - Security Headers в `next.config.js` (`X-Frame-Options: SAMEORIGIN`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`).
  - Rate Limiting скользящего окна (`lib/rate-limit.ts`) для защиты от накрутки кликов, спама апвоутов и частых публикаций.
  - Санитизация входящих данных (`lib/sanitize.ts`, защита от XSS).

---

## 🛠 Стек технологий

- **Фреймворк**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Язык**: [TypeScript](https://www.typescriptlang.org/)
- **Стилизация**: [Tailwind CSS](https://tailwindcss.com/)
- **Иконки**: [Lucide React](https://lucide.dev/)
- **База данных**: [Supabase (Cloud PostgreSQL)](https://supabase.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Интеграция**: Telegram Bot API, Telegram Webhook

---

## 🚀 Быстрый старт

### 1. Клонирование репозитория
```bash
git clone https://github.com/goodguy2ever-maker/boshlaup.git
cd boshlaup
```

### 2. Установка зависимостей
```bash
npm install
```

### 3. Переменные окружения
Создайте файл `.env` на основе шаблона `.env.example`:
```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Supabase PostgreSQL (Connection Pooling)
DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Telegram Bot
TELEGRAM_BOT_TOKEN="9073543052:AAFj4tmSOUWaMXaOexSU9A2uB79DpNi-xTg"
TELEGRAM_CHANNEL_ID="@boshlaup"
```

### 4. Накат схемы базы данных
```bash
npx prisma generate
npx prisma db push
```

### 5. Запуск в режиме разработки
```bash
npm run dev
```
Откройте [http://localhost:3000](http://localhost:3000) в браузере.

---

## 🚢 Деплой на Vercel

1. Импортируйте репозиторий `goodguy2ever-maker/boshlaup` на [vercel.com](https://vercel.com).
2. Задайте переменные окружения (`DATABASE_URL`, `DIRECT_URL`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHANNEL_ID`, `NEXT_PUBLIC_APP_URL`).
3. Нажмите **Deploy**.

После деплоя привяжите Telegram Webhook:
```bash
curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<YOUR-VERCEL-DOMAIN>/api/telegram/webhook"
```

---

## 📄 Лицензия

Распространяется под лицензией MIT. Подробности в файле LICENSE.
BoshlaUp — Сделано для стартап-сообщества Узбекистана.
