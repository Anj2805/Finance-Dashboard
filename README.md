# Finance Dashboard

## Project Overview
A full-stack finance dashboard monorepo. It features a React + Vite frontend and a scalable Node.js + Express backend. It delivers secure authentication, role-based access control, financial record management, and responsive analytics endpoints backed by MongoDB.

## Features
### 🔐 Authentication & Authorization
- JWT auth with bcrypt-hashed passwords
- RBAC:
  - **Viewer** → dashboard-only APIs
  - **Analyst** → dashboard + read-only records
  - **Admin** → full CRUD + user management

### 💰 Financial Records Management
- Create/read/update/soft-delete transactions
- Filtering by type, category, date range, keyword (category/note)
- Pagination + sorting (`page`, `limit`, `sortBy`, `order`)

### 📊 Dashboard Analytics
- Totals (income, expense, net balance)
- Category breakdown
- Monthly trends
- Recent transactions (last 5)

### 👤 User Management (Admin)
- List users
- Update role (viewer/analyst/admin)
- Activate/deactivate users with self-protection

### 🛡️ Backend Practices
- Centralized error handler + consistent responses
- Validation middleware (payloads, ObjectIds, dates)
- Soft delete strategy keeps audit trail intact

### 🧪 Testing
- Jest + Supertest suites with `mongodb-memory-server`
- Coverage for auth, records, dashboard, RBAC paths
- Isolated tests that never touch production data

## Tech Stack
**Frontend:** React, Vite, TailwindCSS, Axios, Recharts
**Backend:** Node.js, Express, MongoDB + Mongoose, JWT + bcrypt, Jest, Supertest

## Folder Structure
```
backend/
├── package.json
├── .env.example
├── jest.config.js
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/db.js
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── utils/
├── tests/
│   ├── setup.js
│   ├── auth.test.js
│   ├── records.test.js
│   └── dashboard.test.js
```

## API Endpoints
_All responses follow `{ success: boolean, data?: any, message?: string }`._

### Auth
| Method | Endpoint | Access |
| --- | --- | --- |
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |

### Records (analyst, admin)
| Method | Endpoint | Access |
| --- | --- | --- |
| GET | `/api/records` | Analyst, Admin |
| GET | `/api/records/:id` | Analyst, Admin |
| POST | `/api/records` | Admin |
| PUT | `/api/records/:id` | Admin |
| DELETE | `/api/records/:id` | Admin |

_Query params:_ `type`, `category`, `search`, `startDate`, `endDate`, `page`, `limit`, `sortBy`, `order`

### Dashboard (viewer, analyst, admin)
| Method | Endpoint |
| --- | --- |
| GET | `/api/dashboard/summary` |
| GET | `/api/dashboard/categories` |
| GET | `/api/dashboard/trends` |

### Users (admin)
| Method | Endpoint |
| --- | --- |
| GET | `/api/users` |
| PATCH | `/api/users/:id/role` |
| PATCH | `/api/users/:id/status` |

## Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Environment Variables
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/finance_dashboard
JWT_SECRET=your_secret
JWT_EXPIRES_IN=1d
```

## Deployment (Vercel)

This project is fully configured for a seamless monolithic Vercel deployment.

1. Push your repository to GitHub.
2. Go to the [Vercel Dashboard](https://vercel.com/dashboard) -> Add New -> Project.
3. Import your repository. Vercel will automatically detect the Vite preset and workspace requirements.
4. Set the following **Environment Variables** in Vercel before deploying:
   - `MONGODB_URI`: Your production MongoDB connection string (e.g., from MongoDB Atlas)
   - `JWT_SECRET`: A secure random string for authentication
   - `NODE_ENV`: `production`
5. Click **Deploy**. Vercel will statically serve the frontend and automatically use serverless functions for the Express backend at `/api/...`.

## Testing
```bash
npm test
```
Utilizes Jest + Supertest with `mongodb-memory-server` for fast, isolated integration tests.

## Assumptions
- Initial admin users are provisioned manually.
- Backend enforces RBAC regardless of frontend controls.
- Soft-deleted records should stay hidden but preserved for auditing.

## Trade-offs
- Analytics run via live aggregations (could be cached later).
- Lightweight validation instead of heavier schema libraries.
- Rate limiting/security headers deferred to edge/gateway.

## Future Improvements
1. Add helmet/rate limiting middleware.
2. Cache dashboard aggregations.
3. Further automated CI actions for PRs.
4. Generate Swagger/OpenAPI docs.
5. Expand analytics (weekly trends, top categories).

## Highlights
- Clean separation of concerns across layers.
- Strong RBAC enforcement throughout the stack.
- Aggregation-driven analytics endpoints.
- Fully tested APIs with in-memory Mongo for reproducibility.
