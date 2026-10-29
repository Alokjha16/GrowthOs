# GrowthOS — AI Intelligence & Business Diagnostics Backend

> **Enterprise Spring Boot REST API for D2C Brands & E-commerce Stores**  
> **Tech Stack:** Java 21+ • Spring Boot 3.3.5 • Maven • Spring Data JPA • PostgreSQL / H2 • Swagger OpenAPI • Postman

---

## 📌 What is GrowthOS Backend?
GrowthOS Backend is a dedicated Spring Boot microservice designed to handle:
1. **Store & Brand Management**: Onboarding, financial benchmarks, COD/RTO tracking.
2. **7-Agent Diagnostic Engine**: Autonomous audit across Finance, Marketing, Operations, Tech, Unit Economics, Inventory, and Retention.
3. **Growth Scenario Simulator**: What-if financial forecasting (COD reduction, UPI prepayment incentives, ROAS targets, margin recovery).

---

## 🏗️ Architecture

```
[ Frontend: Next.js GrowthOS Dashboard ]
                    │
                    ▼  HTTP / REST (JSON)
[ Spring Boot Controller Layer ]   (@RestController: Businesses, Diagnose, Simulate, Health)
                    │
                    ▼
[ Business Logic / Services ]      (@Service: 7-Agent Diagnosis Algorithm, Scenario Simulation Engine)
                    │
                    ▼
[ Repository / Data Layer ]        (@Repository: Spring Data JPA Repositories)
                    │
                    ▼
[ Database ]                       (PostgreSQL / High-Performance Embedded H2)
```

---

## 📖 Live Swagger API Documentation
Run the server and visit:
👉 **[http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)**

---

## 🚀 REST API Endpoints

### 1. Store & Brand Management (`/api/businesses`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/businesses` | List all stores (Filter by `?industry=...` or `?keyword=...`) |
| `GET` | `/api/businesses/{id}` | Fetch detailed store metrics by ID |
| `POST` | `/api/businesses` | Register & onboard a new D2C store |
| `PUT` | `/api/businesses/{id}` | Update store financial metrics |
| `DELETE` | `/api/businesses/{id}` | Remove a store |

### 2. Multi-Agent Diagnostics (`/api/diagnose`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/diagnose/{businessId}` | Executes 7-agent diagnosis, calculates cash bleed & generates audit report |
| `GET` | `/api/diagnose/{businessId}/report` | Retrieve the latest diagnostic report & executive summary |

### 3. Growth Scenario Simulator (`/api/simulate`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/simulate/{businessId}` | Runs what-if simulation (parameters: `targetCodRate`, `targetRoas`, `prepaidDiscount`) |
| `GET` | `/api/simulate/{businessId}/history` | Retrieve past simulation records for a store |

### 4. System Health (`/api/health`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service and database connectivity check |

---

## 🏃 Running the Application
```powershell
# Option 1: Run with Maven
mvn spring-boot:run

# Option 2: Run executable JAR
java -jar target/growthos-backend-0.0.1-SNAPSHOT.jar
```
Server runs at `http://localhost:8080`.