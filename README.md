# IZO PLUS — Penaplast Zavodi

Premium, production-quality website for **IZO PLUS / PENAPLAST ZAVODI** — an EPS
(penaplast) manufacturing factory in Uzbekistan.

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** (dark/light themes, default dark, persisted in `localStorage`)
- **Framer Motion** (scroll reveals, timeline, modals, micro-interactions)
- **Three.js / React Three Fiber / drei** (interactive 3D EPS block with
  procedural bead texture + instanced bead cluster, rotate/drag/zoom)

## Features

- Trilingual UI: O‘zbek (default), Русский, English — persisted locally
- Product catalogue (Oq / Qora / Maydalangan penaplast) with:
  - density selector 7–20 kg/m³ with **live price updates**
    (32 / 40 / 50 / 62 / 67 / 71 / 79 / 87 $ per m³)
  - thickness selector 1–60 cm (hard cap 60 cm)
  - crushed penaplast fixed at **$0.70 / kg**
- Full-text search (Ctrl+K / mobile search icon) by name, density, thickness
- Instant filters (category, density, thickness)
- Product detail modal → configuration transfers into the order form
- Order system: validated form (UZ phone format) → `POST /api/order` →
  **server-side Telegram Bot API** delivery (token & chat id from env vars,
  never exposed to the client). Graceful errors with retry on failure.
- 6-stage animated production line, 3D experience, why/applications/about/contact
- Sticky mobile order button, floating glass navbar, zero horizontal overflow
  down to 320px, `prefers-reduced-motion` respected

## Telegram setup

```bash
cp .env.local.example .env.local
# then fill in:
# TELEGRAM_BOT_TOKEN=123456:ABC...   (from @BotFather)
# TELEGRAM_CHAT_ID=@penaplast_uz     (or a numeric chat id)
```

If the env vars are missing, the API responds `503 telegram_not_configured`
and the UI shows a clear error with a direct-Telegram fallback — it never
pretends an order was delivered.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```
