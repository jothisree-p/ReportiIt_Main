# ReportIt Backend

Spring Boot microservices for the ReportIt crime reporting frontend.

## Services

| Service | Port | Description |
|---------|------|-------------|
| **auth-service** | 8081 | Register, login, JWT, OTP, forgot password |
| **user-management-service** | 8082 | Profiles, complaints, officers, admin users, notifications, files, dashboard, roles, status tracking, locations, OTP proxy |

## Prerequisites

- Java 17+
- Maven 3.9+
- MySQL 8 (or Docker)
- MongoDB 7+ (or Docker)

## Database split

CivicSafe/ReportIt now uses both databases:

| Database | Used for |
|----------|----------|
| **MySQL** (`reportit_db`) | Authentication, users, roles, permissions, officers, profiles, categories, relational IDs |
| **MongoDB** (`reportit_mongo`) | Complaint documents, status timeline logs, investigation notes snapshot, notifications, evidence metadata, AI chat messages |

The current REST APIs stay the same. MySQL remains the relational source for user and assignment references, while `user-management-service` mirrors complaint/log/message data into MongoDB on each write and backfills existing rows on startup.

## Quick start (no MySQL required)

By default both services use the **`local` profile** (embedded H2 database in `reportit-backend/data/`).

**Windows:** from `reportit-backend` run:

```powershell
.\start-backend.ps1
```

**Manual start** (two terminals):

```bash
cd auth-service
mvn spring-boot:run
```

```bash
cd user-management-service
mvn spring-boot:run
```

### Using MySQL + MongoDB

```powershell
$env:SPRING_PROFILES_ACTIVE="mysql"
$env:MYSQL_PASSWORD="YourMySqlRootPassword"
$env:MONGODB_URI="mongodb://localhost:27017/reportit_mongo"
.\start-backend.ps1
```

Or Docker: `docker compose up -d` starts both MySQL and MongoDB. Then set `MYSQL_PASSWORD` to match your MySQL root password (default in compose is `root`; many local installs use `Root@123`). If you use MongoDB Atlas, set `MONGODB_URI` to your Atlas connection string.

## Default admin login

| Field | Value |
|-------|-------|
| Email | admin@reportit.com |
| Password | admin123 |
| Role | ADMIN |

## Postman testing flow

1. **Register citizen** — `POST http://localhost:8081/api/auth/register`
   ```json
   {
     "fullName": "Jothisree",
     "email": "jothisree@example.com",
     "phone": "9876543210",
     "password": "pass123"
   }
   ```

2. **Login** — `POST http://localhost:8081/api/auth/login`
   ```json
   { "email": "jothisree@example.com", "password": "pass123", "role": "CITIZEN" }
   ```
   Copy `accessToken` from the response.

3. **Authenticated requests** — add header:
   ```
   Authorization: Bearer <accessToken>
   ```
   Use port **8082** for all user-management APIs.

4. **Create complaint** — `POST http://localhost:8082/api/complaints`
   ```json
   {
     "title": "Bike Theft",
     "category": "Theft",
     "description": "Stolen near market",
     "locationText": "Market Area",
     "priority": "High"
   }
   ```

5. **Admin login** — `POST http://localhost:8081/api/auth/login`
   ```json
   { "email": "admin@reportit.com", "password": "admin123", "role": "ADMIN" }
   ```

6. **Create officer** — `POST http://localhost:8082/api/officers` (admin token)
   ```json
   {
     "name": "Ravi Prakash",
     "email": "ravi.prakash@reportit.com",
     "password": "ravi123",
     "badge": "RP-4521",
     "position": "Inspector",
     "zone": "Zone A",
     "initials": "RP",
     "status": "Active"
   }
   ```

7. **Track complaint** — `GET http://localhost:8082/api/status/track/CMP-2026-001`

Import `postman/ReportIt-Backend.postman_collection.json` for all CRUD endpoints.

## API summary (user-management, port 8082)

All require `Authorization: Bearer <token>` unless noted.

| Module | Base path |
|--------|-----------|
| User Profile | `/api/profiles` |
| Complaints | `/api/complaints` |
| Location & Map | `/api/locations` |
| Officers | `/api/officers` |
| Admin Users | `/api/admin/users` |
| Notifications | `/api/notifications` |
| File Upload | `/api/files` |
| Dashboard | `/api/dashboard` |
| Roles & Permissions | `/api/roles` |
| Status Tracking | `/api/status` |
| OTP (proxy) | `/api/otp` |

Auth (port 8081, no token): `/api/auth/register`, `/api/auth/login`, `/api/auth/otp/send`, `/api/auth/otp/verify`, `/api/auth/forgot-password`, `/api/auth/refresh`

## Project structure

```
reportit-backend/
├── auth-service/
├── user-management-service/
│   └── src/main/java/com/reportit/usermgmt/
│       ├── profile/          User Profile Service
│       ├── complaint/        Complaint Management Service
│       ├── location/         Location & Map Service
│       ├── officer/          Officer Management Service
│       ├── admin/            Admin Management Service
│       ├── notification/     Notification Service
│       ├── fileupload/       File Upload Service
│       ├── dashboard/        Dashboard & Analytics Service
│       ├── role/             Role & Permission Service
│       ├── status/           Status Tracking Service
│       └── otp/              OTP Service
├── database/schema.sql       MySQL relational schema
└── docker-compose.yml
```

## MongoDB collections

When `user-management-service` starts and MongoDB is reachable, these collections are created automatically:

| Collection | Data |
|------------|------|
| `complaints` | Full complaint documents mirrored from relational complaint rows |
| `status_events` | Complaint status timeline entries |
| `notifications` | User/admin/officer notification records |
| `evidence_files` | Uploaded evidence metadata |
| `ai_chat_messages` | Saved AI assistant chat history |

## Connect frontend

```bash
cd "ReportIt-main (1)/ReportIt-main"
npm install
npm run dev
```

`.env` should point to:

```
VITE_AUTH_URL=http://localhost:8081
VITE_API_URL=http://localhost:8082
```

Start **both** backend services before using the app.

**Demo logins (seeded on first run)**

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@reportit.com | admin123 |
| Officer | officer@reportit.com | officer123 |
| Citizen | Register on signup page | (your password) |

Officers created in Admin → Manage Officers can also log in with `@reportit.com` email.

CORS is enabled for `http://localhost:5173` (Vite).
