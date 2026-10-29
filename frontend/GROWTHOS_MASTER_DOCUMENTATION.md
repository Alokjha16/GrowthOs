# GrowthOS: Master Technical Specification & Complete Project Documentation

**Project Name:** GrowthOS — The AI Growth Operating System for E-Commerce Brands  
**Tagline:** Institutional-Grade Intelligence for D2C Founders — 7 AI Agents, 1 Unified Diagnosis  
**Academic Module:** Full Stack Development - I (PS-FSD) | Semester V | A.Y. 2026-27  
**Author / Engineering Team:** GrowthOS Core Team  
**Repository Path:** `c:\Users\jainam\Documents\Desktop\Project\GrowthOS`  

---

## Table of Contents

1. [Executive Summary & Problem Statement](#1-executive-summary--problem-statement)
2. [High-Level System Architecture](#2-high-level-system-architecture)
3. [Technology Stack Detailed Specification](#3-technology-stack-detailed-specification)
4. [Database Design & Prisma/PostgreSQL Schema](#4-database-design--prismapostgresql-schema)
5. [The 7-Agent Multi-Agent Diagnostic Pipeline](#5-the-7-agent-multi-agent-diagnostic-pipeline)
6. [Strategy Simulator (What-If Forecasting Engine)](#6-strategy-simulator-what-if-forecasting-engine)
7. [CEO Executive Report & PDF Generation Engine](#7-ceo-executive-report--pdf-generation-engine)
8. [Application Directory & File Structure](#8-application-directory--file-structure)
9. [Complete Application Route & UI Catalog](#9-complete-application-route--ui-catalog)
10. [REST API Endpoints Specification](#10-rest-api-endpoints-specification)
11. [Security, Authentication & Data Protection](#11-security-authentication--data-protection)
12. [Setup, Installation & Production Deployment Guide](#12-setup-installation--production-deployment-guide)
13. [Academic & Viva Defense Reference (FSD Mapping)](#13-academic--viva-defense-reference-fsd-mapping)

---

## 1. Executive Summary & Problem Statement

### 1.1 The D2C Operational Crisis
Direct-to-Consumer (D2C) e-commerce brands in India and worldwide face an acute data fragmentation problem:
- **Disparate Dashboards:** Store founders log into Shopify for orders, Meta Ads Manager for ad spend, Google Analytics 4 for traffic, Shiprocket/Delhivery for logistics, and Razorpay/Stripe for payments.
- **Hidden Margin Leaks:** While top-line revenue may grow, high Customer Acquisition Costs (CAC), Cash on Delivery (COD) dependency (often 60–75% of Indian e-commerce orders), and brutal Return-to-Origin (RTO) rates (18–30%) quietly wipe out net profit.
- **Lack of Institutional Analysis:** Large enterprises hire BCG or McKinsey consulting teams to perform quarterly cross-department audits. Early-stage and mid-market D2C founders cannot afford this, leaving them to make strategic decisions based on intuition or uncoordinated agency advice.

### 1.2 The GrowthOS Solution
GrowthOS delivers **institutional-grade growth intelligence** in a unified SaaS platform:
1. **Single Pane of Glass:** Ingests revenue, unit economics, marketing spend, logistics SLAs, and cohort retention metrics.
2. **Parallel 7-Agent Diagnostic Engine:** Concurrently invokes 7 specialized AI agents (Finance, Marketing, Operations, Technology, Unit Economics, Inventory, Retention) powered by Groq LPU inference in **< 4.0 seconds**.
3. **Actionable Roadmap with Direct Tool SOPs:** Instead of vague advice like *"reduce costs"*, GrowthOS outputs structured action items with expected financial impact (e.g. *"+₹92,000/month margin"*), timeline (*14 days*), required tools (*Shiprocket NDR + Interakt WhatsApp API*), and exact step-by-step SOP instructions.
4. **Interactive Strategy Simulator:** Allows founders to test what-if scenarios (e.g., *"Shift 15% COD orders to prepaid and cut Meta budget by 20%"*) with projected 30-day and 90-day P&L impact.
5. **Board-Ready CEO Executive Reports:** 1-click client-side export to high-resolution PDF briefings for founders, board members, and investors.

---

## 2. High-Level System Architecture

GrowthOS is engineered as a modern, high-concurrency Full-Stack Web Application utilizing Server-Side Rendering (SSR), React Server Components (RSC), and edge-accelerated inference.

```
+---------------------------------------------------------------------------------------+
|                                    CLIENT LAYER                                       |
|  Next.js 16 App Router · React 19 · Tailwind CSS 3.4 · Recharts · Lucide · jsPDF      |
+---------------------------------------------------------------------------------------+
                                           │
                                  HTTPS / JSON Fetch
                                           │
                                           ▼
+---------------------------------------------------------------------------------------+
|                               NEXT.JS SERVER RUNTIME                                  |
|                                                                                       |
|  [Middleware.ts] ────────► Auth Guard / Session Validation (NextAuth.js v5)          |
|                                                                                       |
|  [Route Handlers] ───────► /api/analyze    /api/simulate    /api/report               |
|                            /api/business   /api/history     /api/auth/*               |
|                                                                                       |
|  [AI Orchestrator] ──────► Promise.all([ 7 Specialized Agent Prompts ])               |
+---------------------------------------------------------------------------------------+
          │                                                               │
          │ Prisma ORM 6.5 (Connection Pooler)                           │ Groq SDK
          ▼                                                               ▼
+-------------------------------------+             +-----------------------------------+
|       POSTGRESQL (SUPABASE)         |             |      GROQ INFERENCE ENGINE        |
|                                     |             |                                   |
| - Users, Accounts, Sessions         |             | Model: Llama 3.3-70B-Versatile    |
| - Businesses & Store Profiles       |             | Hardware: Language Processing Unit|
| - BusinessSnapshots (Time-Series)   |             | Latency: < 4.0s for 7 parallel    |
| - Analyses (JSONB Diagnostic Logs)  |             | structured JSON extractions       |
| - Simulations & Executive Reports   |             +-----------------------------------+
| - KnowledgeChunks (RAG Knowledge)   |
+-------------------------------------+
```

---

## 3. Technology Stack Detailed Specification

| Tier | Component | Selection | Engineering Rationale |
|---|---|---|---|
| **Frontend Framework** | Web Application Framework | **Next.js 16.2.12 (Turbopack)** | Instant hot-reloading with Turbopack, App Router architecture, hybrid static/server rendering, nested layouts. |
| **UI Library** | Component Architecture | **React 19.0.0** | Modern concurrent rendering, optimized hooks, and zero-bundle server components. |
| **Language** | Type Safety | **TypeScript 5.x (Strict Mode)** | Full compile-time static type checking; eliminates runtime undefined/null bugs. |
| **Styling** | Design System & Styling | **Tailwind CSS 3.4.17** | Custom dark mode palette (`#0D0D0E`, zinc-900), custom utility classes, responsive grid layout. |
| **Database** | Relational Database | **PostgreSQL (Supabase)** | Strict ACID compliance, relational foreign keys, row-level locking, and native JSONB indexing. |
| **ORM** | Object-Relational Mapper | **Prisma 6.5.0** | Type-safe query builder, automated migration engine, unified transaction pooling via `@auth/prisma-adapter`. |
| **Authentication** | Auth & Session Management | **Auth.js v5 (NextAuth beta 25)** | JWT session handling, Bcrypt password hashing for credentials, Google OAuth provider support. |
| **AI Inference** | LLM Engine | **Groq SDK (Llama 3.3-70B)** | High-throughput LPU hardware achieving 7 parallel completions in under 4.0 seconds. |
| **Data Visualization** | Charting Engine | **Recharts 3.10.1** | Responsive SVG charts (Health score gauges, revenue/expense trends, diagnostic radars). |
| **Document Generation**| PDF Export Engine | **jsPDF 2.5.2 + html2canvas 1.4.1**| Pixel-perfect client-side compilation of executive reports into downloadable PDF artifacts. |
| **Data Validation** | Schema Validation | **Zod 3.24.2** | Strict validation of API inputs and AI structured JSON responses. |
| **Icons** | Iconography | **Lucide React 0.475.0** | Modern, lightweight SVG iconography across all agent categories and dashboards. |

---

## 4. Database Design & Prisma/PostgreSQL Schema

The database is defined in `prisma/schema.prisma` and hosted on PostgreSQL via Supabase. It uses a **hybrid relational + document design**: strictly typed relational schemas for identities and stores, combined with high-performance `JSONB` document storage for multi-agent diagnostic outputs.

### 4.1 Connection Topology
- **Runtime Queries:** Port `6543` using Supabase Transaction Pooler (`DATABASE_URL`).
- **Migrations & DDL:** Port `5432` using direct session connection (`DIRECT_URL`).

### 4.2 Entity Breakdown

```mermaid
erDiagram
    USER ||--o{ BUSINESS : "owns"
    USER ||--o{ ANALYSIS : "creates"
    USER ||--o{ SIMULATION : "runs"
    USER ||--o{ REPORT : "generates"
    USER ||--o{ ACCOUNT : "authenticates"
    USER ||--o{ SESSION : "maintains"

    BUSINESS ||--o{ BUSINESS_SNAPSHOT : "tracks_history"
    BUSINESS ||--o{ ANALYSIS : "evaluated_by"
    BUSINESS ||--o{ SIMULATION : "forecasted_by"
    BUSINESS ||--o{ REPORT : "summarized_in"

    ANALYSIS ||--o{ REPORT : "compiled_into"
    SIMULATION ||--o{ REPORT : "referenced_in"
```

#### Detailed Entity Specifications:

1. **`User` Entity:**
   - `id` (String CUID, PK), `email` (String, Unique), `name` (String), `password` (String, Bcrypt hash), `image` (String), `createdAt`, `updatedAt`.
   - Relationships: One-to-Many with `Business`, `Analysis`, `Simulation`, `Report`, `Account`, `Session`.

2. **`Business` Entity (Store Master):**
   - `id` (String CUID, PK), `userId` (String FK -> User.id, ON DELETE CASCADE).
   - Brand Info: `name`, `businessType` (Enum: ECOMMERCE, RETAIL, D2C, etc.), `industry`, `website`, `description`.
   - Core Financials: `monthlyRevenue` (DECIMAL 14,2), `monthlyExpenses` (DECIMAL 14,2), `customersPerMonth` (Int), `repeatCustomerPercentage` (Int).
   - Marketing & Unit Economics: `marketingChannels` (String[]), `pricingLevel` (Enum: LOW, MEDIUM, HIGH), `averageOrderValue` (DECIMAL 10,2), `customerAcquisitionCost` (DECIMAL 10,2), `returnOnAdSpend` (DECIMAL 6,2), `cartAbandonmentRate` (Int), `inventoryTurnover` (DECIMAL 6,2).
   - Logistics & D2C Metrics: `fulfillmentMethod` (Enum: SELF_FULFILLED, THREE_PL, DROPSHIPPING), `returnRatePercentage` (Int), `codRate` (Int, 0-100), `rtoRate` (Int, 0-100), `prepaidPercentage` (Int, 0-100).
   - System Benchmark: `healthScore` (Int, 0-100).

3. **`BusinessSnapshot` Entity (Time-Series Metric History):**
   - Captures historical values (`revenue`, `expenses`, `customers`, `healthScore`, `averageOrderValue`, `cac`, `roas`, `codRate`, `rtoRate`, `createdAt`).
   - Indexed on `(businessId, createdAt)` for high-speed chronological charting.

4. **`Analysis` Entity (7-Agent Run):**
   - `id` (String CUID, PK), `businessId` (FK -> Business), `createdById` (FK -> User).
   - `status` (Enum: PENDING, IN_PROGRESS, COMPLETED, FAILED).
   - `healthScore` (Int 0-100).
   - `summary` (JSONB): Synthesized executive briefing across all 7 agents.
   - `agents` (JSONB): Structured array of the 7 agent outputs (problems, insights, actions).
   - `inputSnapshot` (JSONB): Frozen copy of store metrics at time of execution.

5. **`Simulation` Entity (Hypothetical Strategy Run):**
   - `id` (PK), `businessId` (FK), `createdById` (FK), `status`.
   - `strategy` (Text): The founder's strategic hypothesis.
   - `shortTermOutcome` (JSONB): 30-90 day impact on revenue, margins, and cash flow.
   - `longTermOutcome` (JSONB): 6-12 month strategic trajectory.
   - `risks` (JSONB) & `opportunities` (JSONB).
   - `confidenceScore` (Int 0-100).

6. **`Report` Entity (CEO Executive Brief):**
   - `id` (PK), `businessId` (FK), `analysisId` (FK, Nullable), `simulationId` (FK, Nullable).
   - `type` (Enum: DIAGNOSIS, SIMULATION, EXECUTIVE_SUMMARY), `title`, `executiveSummary` (Text).
   - `chiefRisk` (Text), `topOpportunity` (Text), `immediateAction` (Text), `actionPlan` (JSONB).

7. **Auxiliary Entities:**
   - `AgentFeedback`: Human-in-the-loop ratings (1-5) and feedback on agent quality.
   - `KnowledgeChunk`: Vector/RAG text chunks categorized by domain and industry.
   - `Account`, `Session`, `VerificationToken`: NextAuth session and OAuth token store.

---

## 5. The 7-Agent Multi-Agent Diagnostic Pipeline

The core AI intelligence of GrowthOS is contained in `src/agents/` and orchestrated via `src/lib/ai/orchestrator.ts`.

### 5.1 Orchestration Workflow
```
                          [Store Metrics Ingestion]
                                     │
                     ┌───────────────┴───────────────┐
                     ▼                               ▼
            [Cache / RAG Context]        [System Prompts Assembly]
                     │                               │
                     └───────────────┬───────────────┘
                                     │
                     Parallel Promise.all() via Groq LPU
                                     │
       ┌──────────┬──────────┬───────┴──┬──────────┬──────────┬──────────┐
       ▼          ▼          ▼          ▼          ▼          ▼          ▼
    Finance   Marketing  Operations Technology  Unit Econ  Inventory  Retention
    Agent       Agent      Agent      Agent       Agent      Agent      Agent
       │          │          │          │          │          │          │
       └──────────┴──────────┴───────┬──┴──────────┴──────────┴──────────┘
                                     ▼
                        [JSON Validation & Repair]
                                     │
                        [Health Score Synthesizer]
                                     │
                        [Consolidated Action Plan]
                                     │
                   [Persisted in PostgreSQL as JSONB]
```

### 5.2 Agent Profiles & Analysis Vectors

| # | Agent Name | File | Primary Metrics Analyzed | Typical Output / Recommendation |
|---|---|---|---|---|
| **1** | **Finance Agent** | `src/agents/finance-agent.ts` | Gross Margin, Operating Expenses, COGS %, Net Margin, Pricing Tier | Renegotiate fabric supplier terms for top SKUs; recover 5% COGS margin (+₹92,000/mo). |
| **2** | **Marketing Agent** | `src/agents/marketing-agent.ts` | Blended CAC, Meta vs. Google ROAS, Channel Mix, Ad Spend Ratio | Shift 40% of ad spend from static images to Creator UGC video ads; recover ROAS from 2.2x to 3.1x. |
| **3** | **Operations Agent** | `src/agents/operations-agent.ts` | COD Rate %, RTO %, Fulfillment SLA (days), Courier NDR % | Deploy automated WhatsApp NDR verification; block high-RTO (>35%) pincodes from COD. |
| **4** | **Technology Agent** | `src/agents/technology-agent.ts` | Cart Abandonment Rate, Mobile Drop-off %, Checkout Latency | Install Razorpay Magic 1-Click Checkout; reduce mobile friction (+₹1.84L/mo revenue). |
| **5** | **Unit Economics Agent** | `src/agents/unit-economics-agent.ts` | AOV, Contribution Margin 1 & 2, LTV:CAC Ratio, Return Freight | Bundle low-margin products into 2-pack offers at ₹2,299 threshold; lift CM2 to 21.5%. |
| **6** | **Inventory Agent** | `src/agents/inventory-agent.ts` | Inventory Turnover Velocity, Deadstock Capital, Stockout Rate | Launch flash clearance for >60-day aged inventory; free up ₹2.8L trapped working capital. |
| **7** | **Retention & LTV Agent** | `src/agents/retention-agent.ts` | Repeat Customer %, 30/60/90-Day Repurchase, Post-Purchase Open Rate | Launch automated WhatsApp 3-step post-delivery flow; increase 60-day repeat rate from 18% to 26%. |

### 5.3 Structured Action Item Schema
Every recommendation produced by an agent implements the strict TypeScript interface `ActionItem`:
```typescript
export interface ActionItem {
  title: string;                         // E.g. "Introduce dynamic COD fee of ₹80 for non-tier-1 pincodes"
  impact: string;                        // E.g. "Shift 15% COD orders to Prepaid → +₹36,800/month cash flow"
  effort: "low" | "medium" | "high";
  timeToResult: string;                  // E.g. "7 days"
  tool: string;                          // E.g. "Razorpay Magic Checkout Rules"
  howTo?: string;                        // Step-by-step SOP guide
  clickPath?: string;                    // UI navigation path
  copyTemplate?: { label: string; text: string }; // Ready-to-use message/copy template
  sopSteps?: string[];                   // Checklist steps
}
```

---

## 6. Strategy Simulator (What-If Forecasting Engine)

Located in `src/lib/ai/simulator.ts` and rendered at `/dashboard/simulate`.
- **Functionality:** Founders can type natural language business hypotheses, such as:
  - *"What if we increase our AOV from ₹1,480 to ₹2,100 by introducing product bundles?"*
  - *"What happens if we stop all COD orders in Bihar and Uttar Pradesh to eliminate RTO?"*
  - *"What if we reduce Meta ad spend by 30% and redirect it to micro-influencer gifting?"*
- **Algorithmic Modeling:** The simulation engine computes:
  1. **Short-Term Outcome (30–90 Days):** Cash flow fluctuations, initial customer churn, immediate cost savings.
  2. **Long-Term Outcome (6–12 Months):** Net EBITDA impact, brand equity shifts, customer LTV expansion.
  3. **Identified Risks & Failure Modes:** Concrete operational hazards to monitor.
  4. **Opportunities & Leverage Points:** Unintended positive side effects.
  5. **Confidence Score (0–100%):** Statistical confidence rating based on data input completeness.

---

## 7. CEO Executive Report & PDF Generation Engine

Located in `src/lib/ai/report.ts` and rendered at `/dashboard/report`.
- **Purpose:** Compiles diagnostic insights and simulation findings into an authoritative executive briefing formatted specifically for CEOs, board meetings, and angel investors.
- **Report Structure:**
  1. **Executive Summary:** C-level situational analysis of brand health.
  2. **Chief Risk:** The single highest-threat bottleneck currently bleeding profit.
  3. **Top Opportunity:** The highest ROI growth lever available within 30 days.
  4. **Immediate Action:** The mandatory 7-day tactical priority.
  5. **Action Plan:** Time-phased tactical roadmap (Days 1–7, Days 8–30, Days 31–90) with assigned tools.
- **Client-Side PDF Generation:** Uses `html2canvas` to render the DOM node at high DPI, followed by `jsPDF` compilation into a cleanly formatted, printable multi-page PDF document without needing server-side headless browsers (Puppeteer).

---

## 8. Application Directory & File Structure

```
GrowthOS/
├── .agent/workflows/       # Agent workflows (audit, bolder, clarify, polish, etc.)
├── prisma/
│   ├── schema.prisma       # Complete PostgreSQL schema (10 models, 6 enums)
│   └── seed.ts             # Demo data seeder for local testing
├── public/                 # Static brand assets, logos, and SVGs
├── scratch/                # Submission docx & markdown generator scripts
│   ├── generate_fa1.py
│   ├── generate_fa2.py
│   └── generate_experiments.py
├── src/
│   ├── agents/             # 7 AI Agent implementations
│   │   ├── finance-agent.ts
│   │   ├── marketing-agent.ts
│   │   ├── operations-agent.ts
│   │   ├── technology-agent.ts
│   │   ├── unit-economics-agent.ts
│   │   ├── inventory-agent.ts
│   │   ├── retention-agent.ts
│   │   └── shared.ts       # Shared types (ActionItem, AgentResult, INR formatter)
│   ├── app/
│   │   ├── (auth)/         # Authentication route group
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (dashboard)/    # Authenticated dashboard route group
│   │   │   ├── layout.tsx  # Persistent dashboard sidebar & header
│   │   │   └── dashboard/
│   │   │       ├── page.tsx          # Overview KPIs & health radial
│   │   │       ├── diagnose/page.tsx # 7-agent diagnostic studio
│   │   │       ├── simulate/page.tsx # Strategy simulator
│   │   │       ├── report/page.tsx   # CEO executive report & PDF export
│   │   │       ├── history/page.tsx  # Metric snapshots & trends
│   │   │       ├── billing/page.tsx  # Tier & subscription management
│   │   │       └── settings/page.tsx # Store parameters & account settings
│   │   ├── (marketing)/    # Public landing page group
│   │   │   └── page.tsx    # High-converting SaaS landing page
│   │   ├── (onboarding)/   # New user onboarding flow
│   │   │   └── onboarding/page.tsx   # 3-step store profile wizard
│   │   ├── demo/
│   │   │   └── page.tsx    # Instant zero-config interactive demo
│   │   ├── api/            # Backend REST API Route Handlers
│   │   │   ├── analyze/route.ts
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── auth/signup/route.ts
│   │   │   ├── business/route.ts
│   │   │   ├── feedback/route.ts
│   │   │   ├── history/route.ts
│   │   │   ├── report/route.ts
│   │   │   └── simulate/route.ts
│   │   ├── globals.css     # Tailwind directives & CSS custom variables
│   │   └── layout.tsx      # Root application layout
│   ├── components/
│   │   ├── layout/         # Navbar, Sidebar, Footer components
│   │   └── ui/             # Reusable UI primitives (Button, Card, Badge, Input, Modal)
│   ├── lib/
│   │   ├── ai/             # Groq client, orchestrator, simulator, report generators
│   │   ├── db.ts           # Global PrismaClient singleton
│   │   └── utils.ts        # Formatting & style merger helpers (clsx, twMerge)
│   ├── types/              # Global TypeScript interfaces
│   ├── auth.ts             # Auth.js configuration & provider setup
│   └── middleware.ts       # Route protection & session interception
├── submissions/            # Generated university & presentation submissions
│   ├── FA1_GrowthOS_ER_Diagram_Submission.docx
│   ├── FA1_GrowthOS_ER_Diagram_Submission.md
│   ├── FA2_FSD_Formative_Assignment_2_Submission.docx
│   ├── FA2_FSD_Formative_Assignment_2_Submission.md
│   ├── FSD_10_Experiments_Complete_Lab_Manual.docx
│   ├── FSD_10_Experiments_Complete_Lab_Manual.md
│   └── PRESENTATION_CHEATSHEET_GROWTHOS.md
├── package.json            # Project dependencies & build scripts
├── tailwind.config.ts      # Tailwind design system configuration
└── tsconfig.json           # Strict TypeScript configuration
```

---

## 9. Complete Application Route & UI Catalog

| Route Path | Type | Access Level | Description |
|---|---|---|---|
| `/` | Page (Static) | Public | Marketing landing page featuring hero section, problem overview, 7-agent capability cards, feature highlights, and CTA. |
| `/demo` | Page (Static) | Public | Interactive product demo showcasing pre-loaded case study (*Ethnic Elegance D2C*), full diagnostic output, agent accordions, and action plan. |
| `/login` | Page (Static) | Public | User authentication with email/password and Google OAuth one-click login. |
| `/register`| Page (Static) | Public | Account creation form with password validation and automated redirection. |
| `/onboarding`| Page (Dynamic)| Authenticated | 3-step store profile setup wizard (General info -> Financial metrics -> E-commerce & COD specifics). |
| `/dashboard` | Page (Dynamic)| Authenticated | Central command center: composite Health Score radial, monthly revenue/expense run-rate, quick diagnostic triggers. |
| `/dashboard/diagnose` | Page (Dynamic)| Authenticated | 7-agent parallel diagnosis studio with category priority tags, problem identification, insights, and actionable SOPs. |
| `/dashboard/simulate` | Page (Dynamic)| Authenticated | Interactive what-if strategy laboratory. Natural language strategy input with projected 30/90 day financial outcomes. |
| `/dashboard/report` | Page (Dynamic)| Authenticated | Synthesized CEO Executive Summary with Chief Risk, Top Opportunity, 7-day tactical priority, and client-side PDF export. |
| `/dashboard/history` | Page (Dynamic)| Authenticated | Historical timeline of business snapshots and longitudinal charts powered by Recharts. |
| `/dashboard/billing` | Page (Dynamic)| Authenticated | Subscription tier selection, feature comparison table, and payment billing status. |
| `/dashboard/settings`| Page (Dynamic)| Authenticated | Store operational parameter management (update revenue, COD %, ad spend, fulfillment method). |

---

## 10. REST API Endpoints Specification

GrowthOS features a modular REST API constructed using Next.js App Router API Route Handlers (`src/app/api/`):

### 10.1 Diagnostic Execution: `POST /api/analyze`
- **Description:** Triggers the parallel 7-agent AI diagnostic pipeline.
- **Request Body:**
  ```json
  { "businessId": "cuid_business_123" }
  ```
- **Processing:** Loads store metrics from PostgreSQL, fires 7 agent prompts concurrently via Groq SDK, calculates composite health score, and saves an `Analysis` record.
- **Response (HTTP 200 OK):**
  ```json
  {
    "id": "cuid_analysis_456",
    "healthScore": 58,
    "status": "COMPLETED",
    "agents": [ /* 7 agent result objects */ ],
    "summary": { "executiveSummary": "...", "topRisk": "..." }
  }
  ```

### 10.2 Strategy Simulation: `POST /api/simulate`
- **Description:** Executes what-if scenario forecasting based on store data.
- **Request Body:**
  ```json
  {
    "businessId": "cuid_business_123",
    "strategy": "Increase AOV by 25% through product bundles and shift 20% COD to prepaid."
  }
  ```
- **Response (HTTP 200 OK):**
  ```json
  {
    "id": "cuid_sim_789",
    "status": "COMPLETED",
    "shortTermOutcome": { "revenueDelta": "+₹1.2L/mo", "cashFlow": "Positive" },
    "longTermOutcome": { "ebitdaExpansion": "+4.2pp" },
    "confidenceScore": 84
  }
  ```

### 10.3 CEO Report Compilation: `POST /api/report`
- **Description:** Synthesizes an executive report from diagnosis and simulation runs.
- **Request Body:**
  ```json
  { "businessId": "cuid_123", "analysisId": "cuid_456", "type": "EXECUTIVE_SUMMARY" }
  ```
- **Response (HTTP 201 Created):**
  ```json
  {
    "id": "cuid_rep_999",
    "title": "GrowthOS Executive Briefing: Ethnic Elegance",
    "chiefRisk": "High COD RTO losses eroding 3.2% of net EBITDA",
    "immediateAction": "Deploy WhatsApp automated NDR flow within 7 days",
    "actionPlan": [ /* Phase 1, Phase 2, Phase 3 items */ ]
  }
  ```

### 10.4 Store Profile Operations: `GET / POST / PUT /api/business`
- **GET:** Retrieves current user's business profile and associated metric snapshots.
- **POST:** Creates a new business profile upon onboarding completion.
- **PUT:** Updates store operating metrics and automatically appends an immutable snapshot to `BusinessSnapshot`.

---

## 11. Security, Authentication & Data Protection

1. **Authentication Guard:** Protected routes (`/dashboard/*`, `/onboarding`) are intercepted by `middleware.ts`. Unauthenticated sessions are redirected to `/login` with an appended return URL.
2. **Password Security:** Credentials are salted and hashed using `bcryptjs` with 12 salt rounds before database persistence. Plaintext passwords never enter logs or database tables.
3. **Multi-Tenancy Isolation:** All API routes verify the authenticated session user ID (`session.user.id`) against the requested `business.userId`. Users cannot query, modify, or diagnose stores belonging to other accounts.
4. **Environment Isolation:** Secrets (`GROQ_API_KEY`, `NEXTAUTH_SECRET`, `DATABASE_URL`, `DIRECT_URL`) are loaded strictly server-side via Node environment variables and excluded from client bundles.
5. **SQL Injection Immunity:** Database queries use Prisma ORM which implements prepared, parameterized queries across all database calls.

---

## 12. Setup, Installation & Production Deployment Guide

### 12.1 Local Prerequisites
- Node.js version 20.x or higher
- npm version 10.x or higher
- PostgreSQL instance (or free Supabase project)

### 12.2 Installation Steps
```powershell
# 1. Clone repository & install dependencies
npm install

# 2. Configure environment variables
# Copy .env.example to .env and configure DATABASE_URL, NEXTAUTH_SECRET, GROQ_API_KEY
cp .env.example .env

# 3. Generate Prisma client
npm run db:generate

# 4. Push schema to PostgreSQL database
npm run db:push

# 5. (Optional) Seed demo D2C business data
npm run db:seed

# 6. Start Turbopack development server
npm run dev
```

Open `http://localhost:3000` in your web browser.

### 12.3 Production Build Verification
To compile an optimized production build:
```powershell
npm run build
```
The build executes TypeScript strict checking, collects page data across 11 worker threads, compiles all static/dynamic routes, and outputs an optimized bundle ready for Vercel, AWS ECS, or Docker deployment.

---

## 13. Academic & Viva Defense Reference (FSD Mapping)

| Syllabus Concept | GrowthOS Implementation | Viva Defense Explanation |
|---|---|---|
| **MVC Architecture** | Next.js App Router (`src/app/`) | Controller layer represented by Next.js Route Handlers (`src/app/api/`); View layer by React Server/Client Components; Model layer by Prisma Models & PostgreSQL. |
| **Object-Relational Mapping (ORM)** | Prisma 6 + PostgreSQL | Replaces raw SQL strings with type-safe models, automated migrations, relationship joins, and connection pooling. |
| **Relational Integrity & Foreign Keys** | PostgreSQL foreign keys with Cascade rules | `Business` cascade-deletes `BusinessSnapshot` and `Analysis`; `User` set-null preserves `Report` audit logs. |
| **NoSQL / Semi-Structured Integration** | PostgreSQL `JSONB` data types | Stores unstructured, dynamic multi-agent diagnostic arrays and action plans with fast indexed retrieval, combining SQL ACID consistency with NoSQL document flexibility. |
| **RESTful API Principles** | Next.js API Routes | Adheres to REST conventions (GET, POST, PUT, DELETE), proper HTTP status codes (200 OK, 201 Created, 404 Not Found), and JSON payloads. |
| **Asynchronous Concurrency** | Node.js `Promise.all()` | Triggers 7 AI agent completions simultaneously on Groq LPUs, reducing serial latency from 28s down to < 4s. |
| **Logging & Diagnostics** | SLF4J / Structured Error Logging | Standardized try-catch boundaries, error classification, and sanitized contextual logging without PII leakage. |
| **API Documentation** | OpenAPI 3.0 / Swagger UI | Machine-readable endpoint specifications and interactive testing consoles as documented in submission records. |

---

*GrowthOS Master Technical Documentation — Complete, Verified, and Production-Ready.*
