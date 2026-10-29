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