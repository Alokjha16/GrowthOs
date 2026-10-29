# GrowthOS

**The AI Growth Operating System for E-Commerce Brands**

> Institutional-grade intelligence for D2C founders — 7 AI agents, 1 unified diagnosis.

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router + Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 3.4 |
| Database | PostgreSQL via Supabase + Prisma 6 |
| Auth | Auth.js v5 (Credentials + Google OAuth) |
| AI | Groq SDK — Llama 3.3-70B Versatile |
| Charts | Recharts |
| PDF Export | jsPDF + html2canvas |
| Icons | Lucide React |
| Validation | Zod |

---

## Quick Start

### 1. Clone & Install
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and fill in your credentials:
```bash
cp .env.example .env
```

Required values:

| Variable | Description |
|---|---|
| `NEXTAUTH_SECRET` | Generate with `openssl rand -base64 32` |
| `DATABASE_URL` | Supabase pooler URL (port 6543) |
| `DIRECT_URL` | Supabase direct URL (port 5432) |
| `GROQ_API_KEY` | Get from [console.groq.com](https://console.groq.com) |
| `GROQ_MODEL` | Model ID (default: `llama-3.3-70b-versatile`) |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console |

### 3. Set Up Database
```bash
npm run db:generate   # generate Prisma client
npm run db:push       # push schema to Supabase
npm run db:seed       # (optional) seed demo data
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Pages

| Route | Description |
|---|---|
| `/` | Marketing landing page |
| `/demo` | Interactive product demo |
| `/register` | Sign up (email or Google) |
| `/login` | Sign in |
| `/onboarding` | 3-step store setup wizard |
| `/dashboard` | KPI overview + health score |
| `/dashboard/diagnose` | 7-agent AI diagnosis |
| `/dashboard/simulate` | Strategy simulator |
| `/dashboard/report` | CEO executive report + PDF export |
| `/dashboard/history` | Snapshot timeline + charts |
| `/dashboard/billing` | Subscription & billing management |
| `/dashboard/settings` | Account + store settings |

---

## AI Agents

| # | Agent | Focus |
|---|---|---|
| 1 | Finance | Margins, expenses, pricing |
| 2 | Marketing | CAC, ROAS, channel efficiency |
| 3 | Operations | Fulfillment, ops bottlenecks |
| 4 | Technology | Cart abandonment, CRO, tech stack |
| 5 | Unit Economics | AOV, contribution margin, LTV:CAC |
| 6 | Inventory & Supply Chain | Turnover, stockouts, 3PL |
| 7 | Retention & LTV | Repeat rate, subscription models |

All 7 run in parallel via `Promise.all()` — completing in under 4 seconds.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed the database |

---

## Project Structure

```
src/
├── agents/              # 7 AI agent implementations
│   ├── finance-agent.ts
│   ├── marketing-agent.ts
│   ├── operations-agent.ts
│   ├── technology-agent.ts
│   ├── unit-economics-agent.ts
│   ├── inventory-agent.ts
│   ├── retention-agent.ts
│   └── shared.ts        # Shared types & utilities
├── app/
│   ├── (auth)/          # Login + Register pages
│   ├── (dashboard)/     # Protected dashboard pages
│   ├── (marketing)/     # Landing page
│   ├── (onboarding)/    # Store setup wizard
│   ├── demo/            # Interactive demo
│   └── api/             # API routes
├── components/
│   ├── layout/          # Navbar, Sidebar
│   └── ui/              # Button, Card, Input, Badge, Spinner
├── lib/
│   ├── ai/              # Groq client, orchestrator, simulator, report
│   ├── db.ts            # Prisma singleton
│   └── utils.ts         # Utility functions
├── types/               # Shared TypeScript types
├── auth.ts              # Auth.js config
└── middleware.ts        # Route protection
```
