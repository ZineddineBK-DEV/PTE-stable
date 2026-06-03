# 🚀 PTE-stable — Local Development Setup Guide

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| **Node.js** | v18+ (v20 recommended) | [nodejs.org](https://nodejs.org) |
| **npm** | v9+ (comes with Node) | included with Node |
| **MongoDB** | v5+ | [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community) or use Docker (see below) |
| **Angular CLI** | v15 | `npm install -g @angular/cli@15` |
| **Git** | latest | [git-scm.com](https://git-scm.com) |

---

## 1. Clone the Repo

```bash
git clone https://github.com/ZineddineBK-DEV/PTE-stable.git
cd PTE-stable
```

---

## 2. MongoDB Setup

### Option A: Install MongoDB locally
1. Install [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. Start the service:
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Windows — runs as a service automatically after install
   ```
3. MongoDB will run on `mongodb://127.0.0.1:27017` by default

### Option B: Use Docker (easiest)
```bash
docker run -d --name pte-mongo -p 27017:27017 mongo:6
```

---

## 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment config
# The .env file should already exist, but verify it has these values:
```

### Verify `backend/.env`
```env
PORT=3001
CONNECTION_STRING=mongodb://127.0.0.1:27017/PTE
JWT_SECRET=your_super_long_random_secret_key_change_this_to_something_secure_at_least_64_chars
JWT_EXPIRES_IN=2h

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX=5
```

### Create required directories
```bash
mkdir -p src/static/images
mkdir -p logs
```

### Start the backend
```bash
# Development mode (with auto-reload via nodemon)
npm run server

# Or just:
node server.js
```

You should see: `Server running on port 3001` and `MongoDB connected`

---

## 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Install Angular CLI globally (if not already installed)
npm install -g @angular/cli@15
```

### Create the environment files

The `src/environments/` directory is git-ignored (contains secrets). Create it manually:

```bash
mkdir -p src/environments
```

#### `src/environments/environment.ts` (production)
```typescript
export const environment = {
  production: true,
  apiUrl: 'http://localhost:3001/api',
  PICSURL: 'http://localhost:3001/',
  REQUEST_FILES_URL: 'http://localhost:3001/requestFiles/',
  CONVENTION_FILES_URL: 'http://localhost:3001/conventionFiles/',
  CIN_FILES_URL: 'http://localhost:3001/cinFiles/',
  LETTER_FILES_URL: 'http://localhost:3001/letterFiles/',
  PRESENCE_FILES_URL: 'http://localhost:3001/presenceFiles/',
  REPORT_FILES_URL: 'http://localhost:3001/reportFiles/',
  INTERN_CERTFICATE_FILES_URL: 'http://localhost:3001/internCertif/',
  INTERN_CV_URL: 'http://localhost:3001/cvFiles/',
};
```

#### `src/environments/environment.development.ts` (development)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3001/api',
  PICSURL: 'http://localhost:3001/',
  REQUEST_FILES_URL: 'http://localhost:3001/requestFiles/',
  CONVENTION_FILES_URL: 'http://localhost:3001/conventionFiles/',
  CIN_FILES_URL: 'http://localhost:3001/cinFiles/',
  LETTER_FILES_URL: 'http://localhost:3001/letterFiles/',
  PRESENCE_FILES_URL: 'http://localhost:3001/presenceFiles/',
  REPORT_FILES_URL: 'http://localhost:3001/reportFiles/',
  INTERN_CERTFICATE_FILES_URL: 'http://localhost:3001/internCertif/',
  INTERN_CV_URL: 'http://localhost:3001/cvFiles/',
};
```

### Start the frontend
```bash
ng serve

# Or with a specific port:
ng serve --port 4200

# Or open in browser automatically:
ng serve --open
```

The app will be available at **http://localhost:4200**

---

## 5. Verify Everything Works

| Check | URL |
|-------|-----|
| Frontend loads | http://localhost:4200 |
| Sign-in page appears | http://localhost:4200/authentication/signin |
| Backend API responds | http://localhost:3001/api |
| MongoDB has PTE database | `mongosh` → `use PTE` → `show collections` |

---

## 6. First Login

You'll need to either:
- **Sign up** a new user at http://localhost:4200/authentication/signup
- Or insert an admin user directly into MongoDB:

```bash
mongosh
```
```javascript
use PTE
db.users.insertOne({
  firstName: "Admin",
  lastName: "User",
  email: "admin@pte.com",
  password: "$2a$10$hashed_password_here",  // Must be bcrypt hashed
  roles: ["ADMIN"],
  departement: "IT",
  nationality: "TN",
  gender: "Male",
  address: "Tunisia",
  phone: "+216 00000000"
})
```

> ⚠️ The password in the database must be **bcrypt hashed**. The backend uses `bcryptjs` to hash passwords on signup, so the easiest way is to use the **signup page** to create your first admin user.

---

## Quick Start (Copy-Paste)

```bash
# Terminal 1 — MongoDB (Docker)
docker run -d --name pte-mongo -p 27017:27017 mongo:6

# Terminal 2 — Backend
cd PTE-stable/backend
npm install
mkdir -p src/static/images logs
npm run server

# Terminal 3 — Frontend
cd PTE-stable/frontend
npm install
mkdir -p src/environments
# Create environment files (see above)
ng serve --open
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `ng: command not found` | `npm install -g @angular/cli@15` |
| `MongoServerError: connect ECONNREFUSED` | Start MongoDB first: `docker start pte-mongo` or `sudo systemctl start mongod` |
| `Module '"src/environments/environment"' not found` | Create the environment files (step 4 above) |
| Port 4200 in use | `ng serve --port 4300` |
| Port 3001 in use | Change `PORT=3002` in `backend/.env` |
| `npm ERR! code ERESOLVE` on frontend | `npm install --legacy-peer-deps` |
| Blank page after login | Check browser console — likely missing environment file or backend not running |

---

## Architecture (After Lazy Loading Redesign)

```
http://localhost:4200
├── /authentication/signin     → AuthenticationModule (eager)
├── /authentication/signup     → AuthenticationModule (eager)
├── /dashboard/main            → DashboardHomeModule  (lazy) ← charts + calendar
├── /dashboard/vehicle         → VehicleModule        (lazy) ← FullCalendar + Leaflet
├── /dashboard/room            → RoomModule           (lazy) ← FullCalendar
├── /dashboard/technician      → TechnicianModule     (lazy) ← FullCalendar + Leaflet
├── /dashboard/userList        → UserListModule       (lazy) ← NgxDatatable
├── /dashboard/profile         → ProfileModule        (lazy)
├── /dashboard/leave           → LeaveModule          (lazy)
├── /dashboard/virt-env        → VirtEnvModule        (lazy) ← MatStepper
├── /dashboard/interns         → InternsRequestModule (lazy)
├── /dashboard/offer           → OffersModule         (lazy)
├── /dashboard/inventory       → InventoryModule      (lazy)
├── /dashboard/networkRequests → NetworkModule        (lazy)
└── /allnews                   → NewspaperModule      (lazy)
```

Each `/dashboard/*` route loads **only its own module** on first navigation — no more downloading the entire app upfront.
