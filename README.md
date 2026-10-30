# GrowthOS — Full Stack D2C E-commerce Intelligence Platform

> **Full Stack Development (FSD) Course Submission**  
> Architecture: Next.js Frontend + Spring Boot Java REST Backend + PostgreSQL / JPA + Swagger OpenAPI

---

## 📁 Repository Structure

```
GrowthOS-Project/
├── frontend/             # Next.js 15, React, Tailwind CSS, TypeScript (Port 3000)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
└── backend/              # Java 21+, Spring Boot 3.3.5, Maven, JPA, Swagger (Port 8080)
    ├── src/main/java/com/tcet/growthos/
    │   ├── config/       (CORS & Swagger OpenAPI Config)
    │   ├── controller/   (Store Management, 7-Agent Diagnosis, Levers Simulator, Health)
    │   ├── model/        (JPA Entities: Business, DiagnosisReport, Simulation)
    │   ├── repository/   (Spring Data JPA Repositories)
    │   └── service/      (Multi-Agent Diagnosis Logic & Simulation Engines)
    ├── src/main/resources/application.properties
    └── pom.xml
```

---

## 🚀 How to Run the Project

### 1. Run the Spring Boot Backend (Port 8080)
Open a terminal in the `backend/` directory:
```powershell
cd backend
mvn spring-boot:run
```
- **Backend API Base**: `http://localhost:8080`
- **Interactive Swagger UI**: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- **H2 Database Web Console**: [http://localhost:8080/h2-console](http://localhost:8080/h2-console) (`jdbc:h2:mem:growthosdb`, User: `sa`, password: blank)

### 2. Run the Next.js Frontend (Port 3000)
Open another terminal in the `frontend/` directory:
```powershell
cd frontend
npm install
npm run dev
```
- **Frontend URL**: `http://localhost:3000`

---

## 🔌 Core Spring Boot REST APIs

| Category | Endpoint | Method | Description |
|---|---|---|---|
| **System** | `/api/health` | `GET` | Service & JPA Database connectivity check |
| **Stores / Brands** | `/api/businesses` | `GET` | List all stores (Filter by `?industry=...` or `?keyword=...`) |
| | `/api/businesses/{id}` | `GET` | Fetch store financial metrics & health score |
| | `/api/businesses` | `POST` | Onboard / register a new store |
| | `/api/businesses/{id}` | `PUT` | Update store metrics |
| | `/api/businesses/{id}` | `DELETE` | Remove a store |
| **7-Agent Diagnostics**| `/api/diagnose/{businessId}` | `POST` | Executes 7-agent diagnosis (Finance, Marketing, Ops, Tech, Unit Econ, Inventory, Retention) |
| | `/api/diagnose/{businessId}/report` | `GET` | Retrieve the latest diagnostic report |
| **Growth Simulator** | `/api/simulate/{businessId}` | `POST` | What-if scenario simulator (COD reduction, UPI incentives, ROAS targets) |
| | `/api/simulate/{businessId}/history`| `GET` | Retrieve simulation history for a store |

---

## ⚡ GrowthOS Autopilot Engine (Phase 1 Foundation)

GrowthOS is transitioning from passive diagnostic advice to an autonomous closed-loop optimization system:
**Find** ➔ **Quantify** ➔ **Fix** ➔ **Verify** ➔ **Alert/Report**.

### Core Architecture Added in Phase 1:
- **6 Config-Driven Modules** (`src/lib/modules/registry.ts`):
  1. `ads` (Marketing) — Low-ROAS, wasted spend & CAC optimization.
  2. `profit` (Finance + Unit Economics) — Loss-making SKUs, margin erosion, price adjustments.
  3. `inventory` (Inventory) — Stockout risk (<14 days), overstock, automated PO drafts.
  4. `retention` (Retention) — Lapsed customers, repeat rate lifts, win-back flows.
  5. `cart-cro` (Technology) — Checkout drop-off points, abandoned cart recovery.
  6. `fulfillment` (Operations) — Pincode RTO clusters, courier delays, COD to prepaid switches.
- **Data Models**:
  - `Subscription` & `Entitlement`: Plan-based entitlement gating (Starter, Growth, Pro).
  - `AutopilotPreferences`: Global kill switch, 14-day shadow mode, auto-rollback flags, and safety limits.
  - `Finding`: Problems with deterministic monthly ₹ impact, confidence levels, and input breakdowns.
  - `PlaybookRun` & `Action`: Execution tracking, before/after state snapshots, idempotency keys.
  - `Task`: Human fallback items with ready-made drafts (briefs, supplier emails).
  - `AuditLog`: Immutable change history of all system and human modifications.
  - `Benchmark`: P25, Median, P75 category metrics for D2C benchmarks.
  - `AlertLog` & `AlertPreferences`: Email & WhatsApp alerts with deduplication and quiet hours.
- **Shared Access Check** (`src/lib/access/has-access.ts`):
  - Unified access boundary `hasAccess(userId, moduleSlug)` and plan limits `canRunSimulation`, `canUseAutonomyLevel`.
- **Navigation**:
  - Growth Modules collapsible sidebar section in `dashboard-sidebar.tsx`.
