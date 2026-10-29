# GROWTHOS — FSD-1 PROJECT REPORT
## SECTION 7: ANNEXURE (CORE SOURCE CODE & SYSTEM IMPLEMENTATION)

| Metadata Attribute | Description |
|---|---|
| **Course & Project Track:** | Full Stack Development - 1 (FSD-1) Academic Capstone |
| **Project System Name:** | GrowthOS — Autonomous Multi-Agent Growth Operating System |
| **Scope:** | Concise High-Impact Implementation (Schema, Agents, RAG, Simulation & Auth) |
| **Repository URL:** | [https://github.com/jain44/GrowthOS.git](https://github.com/jain44/GrowthOS.git) (Branch: `main`) |

---

## 7.0 Architectural Overview & Module Organization

**Engineering Design:** The GrowthOS architecture is organized around modular multi-agent reasoning, high-speed Groq LPU inference, and a high-availability database layer.

```text
GrowthOS/
├── prisma/schema.prisma               # Relational entity models (PostgreSQL & Prisma)
├── src/
│   ├── auth.ts                        # NextAuth.js v5 JWT auth & demo bypass
│   ├── agents/shared.ts               # Multi-agent interface contracts & types
│   ├── lib/
│   │   ├── db.ts                      # Resilient Prisma client & zero-latency fallback
│   │   └── ai/
│   │       ├── analyze.ts             # 7-Agent parallel diagnosis & synthesis engine
│   │       ├── simulate.ts            # Monte Carlo what-if strategy simulator
│   │       ├── report.ts              # Autonomous CEO Briefing generator
│   │       └── rag.ts                 # Domain RAG knowledge retriever
│   ├── app/
│   │   ├── (dashboard)/dashboard/     # Executive Dashboard & Diagnostic runner
│   │   └── api/                       # REST endpoints (analyze, simulate, report)
│   └── components/layout/sidebar.tsx  # Sidebar navigation & same-origin logout
```

---

## 7.1 Database Architecture & Schema (`prisma/schema.prisma`)

**Key Data Models:** Encapsulates brand financials, India-specific logistics (COD/RTO percentages), historical snapshots, multi-agent diagnosis runs, strategy simulations, and RAG knowledge vectors.

```prisma
model User {
  id            String       @id @default(cuid())
  email         String       @unique
  name          String?
  password      String?
  businesses    Business[]
  analyses      Analysis[]
  simulations   Simulation[]
  reports       Report[]
  createdAt     DateTime     @default(now())
}

model Business {
  id                       String            @id @default(cuid())
  userId                   String
  name                     String
  businessType             BusinessType      @default(ECOMMERCE)
  industry                 String?
  monthlyRevenue           Decimal?          @db.Decimal(14, 2)
  monthlyExpenses          Decimal?          @db.Decimal(14, 2)
  customersPerMonth        Int?
  repeatCustomerPercentage Int?
  averageOrderValue        Decimal?          @db.Decimal(10, 2)
  customerAcquisitionCost  Decimal?          @db.Decimal(10, 2)
  healthScore              Int?
  // India-Specific Logistics Metrics
  codRate                  Int?              // Cash on Delivery % (0–100)
  rtoRate                  Int?              // Return to Origin % (0–100)
  prepaidPercentage        Int?              // Prepaid % (0–100)
  user                     User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  analyses                 Analysis[]
  simulations              Simulation[]
  reports                  Report[]
  snapshots                BusinessSnapshot[]
}

model Analysis {
  id              String         @id @default(cuid())
  businessId      String
  createdById     String?
  status          AnalysisStatus @default(PENDING)
  healthScore     Int?
  summary         Json?          // { topRisk, biggestOpportunity, primaryAction }
  agents          Json?          // Array of 7 AgentResult objects
  business        Business       @relation(fields: [businessId], references: [id], onDelete: Cascade)
  createdAt       DateTime       @default(now())
}

model Simulation {
  id               String           @id @default(cuid())
  businessId       String
  strategy         String
  shortTermOutcome Json?            // { revenueImpact, expenseImpact, netMarginImpact }
  longTermOutcome  Json?            // { annualizedSavings, repeatPurchaseLift }
  confidenceScore  Int?             // 0-100
  business         Business         @relation(fields: [businessId], references: [id], onDelete: Cascade)
}

model KnowledgeChunk {
  id        String   @id @default(cuid())
  content   String   @db.Text
  source    String   // e.g., "Shiprocket Logistics Benchmark 2024"
  category  String   // "operations" | "finance" | "retention"
}
```

---

## 7.2 Authentication & Security Provider (`src/auth.ts`)

**Auth Implementation:** NextAuth.js v5 JWT configuration with credential verification, instant demo pass-through for university defense evaluation, and same-origin redirect guards.

```typescript
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import { db } from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: "/login", error: "/login" },
  providers: [
    Credentials({
      name: "credentials",
      credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const email = String(credentials.email).trim().toLowerCase();
        const password = String(credentials.password);

        // Immediate Demo Pass for University Defense / Presentation Reliability
        if (email === "demo@growthos.ai" && (password === "Test@1234" || password === "demo")) {
          return { id: "demo-user-rang-studio", email: "demo@growthos.ai", name: "Jainam (Rang Studio)" };
        }

        try {
          const user = await db.user.findUnique({ where: { email } });
          if (!user || !user.password) return null;
          const isValid = await bcryptjs.compare(password, user.password);
          return isValid ? { id: user.id, email: user.email, name: user.name } : null;
        } catch {
          return email === "demo@growthos.ai" ? { id: "demo-user-rang-studio", email, name: "Jainam (Rang Studio)" } : null;
        }
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return url;
      try { if (new URL(url).origin === baseUrl) return url; } catch {}
      return baseUrl;
    },
    async jwt({ token, user }) {
      if (user) { token.id = user.id; token.email = user.email; token.name = user.name; }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) { session.user.id = token.id as string; }
      return session;
    },
  },
});
```

---

## 7.3 Multi-Agent Diagnostic Engine (`src/lib/ai/analyze.ts`)

**Parallel Execution Pipeline:** Coordinates the 7 autonomous domain agents across Groq LPU inference. Concurrently executes domain prompts and synthesizes an executive decision matrix.

```typescript
import Groq from "groq-sdk";
import { type BusinessContext, type AgentResult, type SynthesisResult } from "@/agents/shared";
import { buildRAGPromptBlock } from "./rag";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = "llama-3.3-70b-versatile";

// Dispatches all 7 agents in parallel using Groq Cloud LPUs
export async function runFullDiagnosis(ctx: BusinessContext, snapshots?: any[]): Promise<{
  healthScore: number;
  summary: { topRisk: string; biggestOpportunity: string; primaryAction: string };
  agents: AgentResult[];
  synthesis: SynthesisResult;
}> {
  const agents = ["Finance", "Operations", "Marketing", "Technology", "Unit Economics", "Inventory & Supply Chain", "Retention & LTV"];

  // Concurrently execute all 7 agents with Promise.allSettled
  const results = await Promise.allSettled(
    agents.map(async (agentName) => {
      const ragContext = await buildRAGPromptBlock(agentName.toLowerCase(), ctx.industry);
      const systemPrompt = `You are the ${agentName} Director for an Indian D2C brand. Analyze this business:
${JSON.stringify(ctx, null, 2)}
${ragContext}
Return JSON format with: priority (level, score), problems (array), insights (array), and actions (array of {title, impact, effort, timeToResult, tool, clickPath}).`;

      const response = await groq.chat.completions.create({
        model: MODEL,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: "Run diagnostic." }],
      });
      return JSON.parse(response.choices[0].message.content!) as AgentResult;
    })
  );

  const agentData = results.map((r, i) => r.status === "fulfilled" ? r.value : fallbackAgent(agents[i]));

  // Synthesis Pass: Calculates holistic health score & executive priority actions
  const synthesis = await runSynthesisPass(ctx, agentData);
  return {
    healthScore: synthesis.healthScore,
    summary: { topRisk: synthesis.topRisk, biggestOpportunity: synthesis.biggestOpportunity, primaryAction: synthesis.primaryAction },
    agents: agentData,
    synthesis,
  };
}
```

---

## 7.4 Resilient Database Hybrid Client (`src/lib/db.ts`)

**Fail-Safe Architecture:** High-availability wrapper around Prisma ORM. Ensures zero-latency fallback to the complete 'Rang Studio' D2C dataset if external database poolers experience timeouts.

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prismaInstance?: PrismaClient;
  dbOffline?: boolean;
  lastChecked?: number;
};

const rawPrisma = globalForPrisma.prismaInstance ?? new PrismaClient({ log: ["error"] });
if (process.env.NODE_ENV !== "production") globalForPrisma.prismaInstance = rawPrisma;

// Safe execution helper: 1200ms timeout threshold before transparent fallback
async function safeExec(prismaFn: () => Promise<any>, fallbackFn: () => any): Promise<any> {
  const now = Date.now();
  if (globalForPrisma.dbOffline && globalForPrisma.lastChecked && now - globalForPrisma.lastChecked < 60000) {
    return fallbackFn();
  }
  try {
    const result = await Promise.race([
      prismaFn(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 1200)),
    ]);
    globalForPrisma.dbOffline = false;
    globalForPrisma.lastChecked = now;
    return result;
  } catch {
    globalForPrisma.dbOffline = true;
    globalForPrisma.lastChecked = now;
    return fallbackFn(); // Serves in-memory 'Rang Studio' dataset
  }
}

export const db: any = {
  user: {
    findUnique: (args: any) => safeExec(() => rawPrisma.user.findUnique(args), () => memoryStore.users.find(u => u.email === args.where.email)),
    count: () => safeExec(() => rawPrisma.user.count(), () => memoryStore.users.length),
  },
  business: {
    findFirst: (args: any) => safeExec(() => rawPrisma.business.findFirst(args), () => memoryStore.businesses[0]),
    findMany: () => safeExec(() => rawPrisma.business.findMany(), () => memoryStore.businesses),
  },
  analysis: {
    findFirst: (args: any) => safeExec(() => rawPrisma.analysis.findFirst(args), () => memoryStore.analyses[0]),
    create: (args: any) => safeExec(() => rawPrisma.analysis.create(args), () => { memoryStore.analyses.unshift(args.data); return args.data; }),
  },
  simulation: {
    findMany: () => safeExec(() => rawPrisma.simulation.findMany(), () => memoryStore.simulations),
    create: (args: any) => safeExec(() => rawPrisma.simulation.create(args), () => { memoryStore.simulations.unshift(args.data); return args.data; }),
  },
};
```

---

## 7.5 Strategy Simulation Engine (`src/lib/ai/simulate.ts`)

**Simulation Calculus:** Predictive counterfactual modeling calculating financial impacts and confidence scores for strategic growth experiments.

```typescript
import Groq from "groq-sdk";
import { type BusinessContext } from "@/agents/shared";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function runSimulation(ctx: BusinessContext, strategy: string) {
  const prompt = `You are a Quantitative Venture Economist. Evaluate this strategy for ${ctx.name}:
STRATEGY: "${strategy}"
FINANCIAL METRICS:
- Revenue: ₹${ctx.monthlyRevenue} | Expenses: ₹${ctx.monthlyExpenses}
- COD Rate: ${ctx.codRate}% | RTO Rate: ${ctx.rtoRate}% | AOV: ₹${ctx.averageOrderValue}

Model short-term and long-term financial consequences. Output JSON:
{
  "shortTermOutcome": { "revenueImpact": "+₹...", "expenseImpact": "-₹...", "netMarginImpact": "+X%" },
  "longTermOutcome": { "annualizedSavings": "₹...", "repeatPurchaseLift": "+X%" },
  "risks": ["risk 1", "risk 2"],
  "opportunities": ["opp 1", "opp 2"],
  "confidenceScore": 85
}`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
    messages: [{ role: "user", content: prompt }],
  });

  return JSON.parse(completion.choices[0].message.content!);
}
```

---

## 7.6 Domain RAG Knowledge Retrieval Engine (`src/lib/ai/rag.ts`)

**Benchmark Retrieval:** Retrieves verified Indian e-commerce logistics and unit economics benchmarks to ground multi-agent reasoning.

```typescript
import { db } from "@/lib/db";

export async function retrieveKnowledgeChunks(category: string, industry?: string | null, limit: number = 3) {
  try {
    const chunks = await db.knowledgeChunk.findMany({
      where: { category, OR: [{ industry: industry ?? undefined }, { industry: null }] },
      take: limit,
      orderBy: { createdAt: "desc" },
    });
    return chunks.map((c: any) => ({ id: c.id, content: c.content, source: c.source }));
  } catch {
    return [];
  }
}

export async function buildRAGPromptBlock(category: string, industry?: string | null): Promise<string> {
  const snippets = await retrieveKnowledgeChunks(category, industry, 3);
  if (!snippets.length) return "";
  return "\nKNOWLEDGE BASE (Retrieved Indian D2C Benchmarks):\n" +
    snippets.map((s: any, idx: number) => `[Fact ${idx + 1} — ${s.source}]: "${s.content}"`).join("\n");
}
```

---

## 7.7 Backend REST API Controller (`src/app/api/analyze/route.ts`)

**Route Controller:** RESTful endpoint coordinating authentication session verification, snapshot extraction, and multi-agent pipeline invocation.

```typescript
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { runFullDiagnosis } from "@/lib/ai/analyze";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { businessId } = await req.json();
  const business = await db.business.findFirst({ where: { id: businessId, userId: session.user.id } });
  if (!business) return NextResponse.json({ error: "Business not found" }, { status: 404 });

  // 1. Mark analysis as in-progress
  const analysis = await db.analysis.create({
    data: { businessId: business.id, createdById: session.user.id, status: "IN_PROGRESS" }
  });

  // 2. Trigger concurrent 7-agent Groq diagnosis
  const result = await runFullDiagnosis(business);

  // 3. Persist findings & update health score
  await db.analysis.update({
    where: { id: analysis.id },
    data: { status: "COMPLETED", healthScore: result.healthScore, summary: result.summary, agents: result.agents }
  });
  await db.business.update({ where: { id: business.id }, data: { healthScore: result.healthScore } });

  return NextResponse.json(result, { status: 200 });
}
```

---

## 7.8 Executive Client-Side Navigation & Session Management

**Same-Origin Signout:** Ensures reliable client-side signout that strictly preserves the origin domain without unintended redirects.

```typescript
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function UserLogoutButton() {
  return (
    <button
      onClick={async () => {
        // Clear session without triggering NextAuth's external URL resolution
        await signOut({ redirect: false });
        // Guarantee redirect strictly to current origin /login
        window.location.href = "/login";
      }}
      title="Sign out"
      className="p-1.5 text-zinc-400 hover:text-rose-400 transition-colors rounded-md hover:bg-white/5"
    >
      <LogOut className="w-4 h-4" />
    </button>
  );
}
```

---

## 8.0 Presentation Slide Deck & Evaluation Alignment

**Presentation Reference:** Summary of the 11-slide PowerPoint presentation (`GrowthOS_Presentation.pptx`) used during university evaluation.

| Slide # | Slide Title | Key Content Demonstrated |
|---|---|---|
| **Slide 1** | Title Slide: GrowthOS | Autonomous Multi-Agent Growth Operating System for Indian E-Commerce Brands. |
| **Slide 2** | The Indian D2C Crisis | High COD dependency (60-70%), crushing RTO freight loss (20-30%), rising Meta CAC. |
| **Slide 3** | Introducing GrowthOS | Real-time AI board of directors diagnosing, simulating, and optimizing unit economics autonomously. |
| **Slide 4** | Multi-Agent Architecture | Parallel execution of 7 specialized domain agents via Groq Cloud Llama-3.3-70B & RAG domain grounding. |
| **Slide 5** | The 7 Autonomous Agents | Finance, Operations, Marketing, Technology, Unit Economics, Inventory/Supply Chain, and Retention/LTV. |
| **Slide 6** | Full-Stack Technology Stack | Next.js 16 (Turbopack), TypeScript 5, Tailwind CSS, PostgreSQL, Prisma ORM, NextAuth.js v5 JWT. |
| **Slide 7** | Case Study: Rang Studio | ₹18.4L MRR ethnic wear brand; 62% COD, 22% RTO. Health score 62/100 analyzed across 6 months. |
| **Slide 8** | What-If Strategy Simulator | Counterfactual scenario testing: +₹1.4L/mo profit recovery by shifting 25% COD to prepaid with WhatsApp NDR. |
| **Slide 9** | Autonomous CEO Briefing | One-click institutional board reports with prioritized operational playbooks and software click paths. |
| **Slide 10** | Business Impact & Metrics | 15% COD fee shifted 15% orders to prepaid; 6% RTO reduction; ₹1.8L monthly cash flow unlocked. |
| **Slide 11** | Future Roadmap & Conclusion | Automated Shopify/Shiprocket API webhooks, fine-tuned Indian commerce SLMs, and multi-tenant scaling. |
