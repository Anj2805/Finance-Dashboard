# Finance Dashboard Backend – Setup Guide

Follow these steps to run the backend locally.

## 1. Prerequisites
- Node.js 18+
- npm 9+
- MongoDB instance (local or Atlas)

## 2. Clone & Install
```bash
git clone <repo>
cd backend
npm install
```

## 3. Environment Variables
Create `.env` in `backend/` based on `.env.example`:
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/finance_dashboard
JWT_SECRET=supersecretjwt
JWT_EXPIRES_IN=1d
```
> If using MongoDB Atlas, replace `MONGODB_URI` with the connection string.

## 4. Seed Admin User (Optional)
Either register via API or manually insert a user with `role: "admin"` to access admin-only routes.

## 5. Seed Sample Records (Optional)
```bash
node scripts/seedRecords.js
```
This script requires at least one admin user to assign as `userId`.

## 6. Run the Server
```bash
npm run dev   # uses nodemon
# or
npm start
```
Server defaults to `http://localhost:3001`.

## 7. Run Tests
```bash
npm test
```
Uses Jest + Supertest + mongodb-memory-server.

## 8. API Docs
See `API.md` for endpoint reference or import the routes into Postman.

## 9. Troubleshooting
- **DB connection errors:** confirm Mongo is running and `MONGODB_URI/MONGO_URI` is correct.
- **JWT errors:** ensure `JWT_SECRET` is set and matching between server + tests.
- **Seed script fails:** verify an admin user exists first.

You’re ready to integrate the backend with the React frontend or extend it further!
