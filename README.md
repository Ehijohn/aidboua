## Aid Express — Monorepo (frontend + backend)

This repository contains the backend and frontend for the Aid Express project.

- `backend/` — Node.js (Express) API server (MongoDB, authentication, payments)
- `frontend/` — React app built with Vite (client that talks to the backend via `/api`). The frontend requires Node/npm to run the development server and to build assets, but it is a client-side React application (not a Node server).

This README explains how to set up, run, and build both projects locally. Keep one terminal for the backend and another for the frontend while developing.

## Repo layout

```
aid-express/
├─ backend/        # Express API, routes, models, scripts
├─ frontend/       # React + Vite app
├─ README.md       # <-- this file
```

## Prerequisites

Before you start, install the tools below. Each entry includes an official download link and a quick verification command you can run in a terminal.

- Node.js (LTS recommended — 16+ or 18+)
  - Download: https://nodejs.org/
  - Verify after install: `node -v` and `npm -v`

- Git
  - Download: https://git-scm.com/downloads
  - Verify: `git --version`

- MongoDB (you can use a local install or MongoDB Atlas)
  - Local download & docs: https://www.mongodb.com/try/download/community
  - Atlas (cloud): https://www.mongodb.com/cloud/atlas
  - Verify local install: `mongod --version` or use the Atlas URI when configuring `MONGO_CONNECTION_STRING`

- (Optional) VS Code — a recommended editor: https://code.visualstudio.com/

Note: All commands below are plain terminal commands.

## 1) Clone the repo

Open a terminal and run:

```bash
git clone https://github.com/samolubukun/aid-express.git aid-express
cd aid-express
```

Replace the URL above with your remote if different.

## 2) Backend setup (API)

1. Install dependencies

```bash
cd backend
npm install
```

2. Create a `.env` file for the backend

An example file is provided at `backend/.env.example`. Copy it and fill in real values:

```bash
cd backend
cp .env.example .env
# edit .env and add your MongoDB URI, JWT secret, and any payment keys you use
```

Example variables you will find in `backend/.env.example` (fill before running):

```
MONGO_CONNECTION_STRING= # e.g. mongodb://localhost:27017/aid-express
PORT=5000
JWT_SECRET=change_this_to_a_secure_value
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:8080
# Optional payment keys:
PAYSTACK_API_SECRET_KEY=
TERMINAL_AFRICA_SECRET_KEY=
```

Notes:
- `MONGO_CONNECTION_STRING` can be a MongoDB Atlas URI or a local URI like the example above.
- `FRONTEND_URL` is used to build callback links for payments. The default dev port for the frontend is `8080`.

3. Seed an admin user (optional)

```bash
npm run seed:admin
```

4. Run the backend in development mode (auto-restarts with changes):

```bash
npm run dev
```

Or run the server directly for production-style start:

```bash
npm start
```

The backend listens on `PORT` (default 5000). Health-check: http://localhost:5000/api/health

## 3) Frontend setup (React + Vite)

Open another terminal and run:

```bash
cd frontend
npm install

# Start the dev server (Vite) on port 8080 (proxy to backend /api is configured)
npm run dev
```

Key info:
- The Vite dev server is configured to run on port `8080` and proxies `/api` requests to `http://localhost:5000` (see `frontend/vite.config.js`).
- If the backend runs on a different port or host, update `frontend/vite.config.js` or set `FRONTEND_URL` in the backend `.env` accordingly.

## 4) Running both services together (dev)

1. Start the backend (in one terminal):

```bash
cd backend
npm run dev
```

2. Start the frontend (in a second terminal):

```bash
cd frontend
npm run dev
```

Open your browser at: http://localhost:8080

Because the frontend proxies `/api` to the backend, API calls from the React app to paths such as `/api/auth/login` will be sent to the backend running on port 5000.

## 5) Environment variables summary (backend)

- MONGO_CONNECTION_STRING — MongoDB URI
- PORT — port for backend (default 5000)
- JWT_SECRET — secret key used to sign JWT tokens
- JWT_EXPIRE — token expiration (e.g. `7d`)
- FRONTEND_URL — URL used for payment callbacks (default `http://localhost:8080`)
- PAYSTACK_API_SECRET_KEY — secret key for Paystack API (used in wallet routes)
- TERMINAL_AFRICA_SECRET_KEY, TERMINAL_AFRICA_URL — used by terminal-africa integration (if used)

If you do not use the payments features, you can leave Paystack/Terminal keys empty, but some route calls may fail if invoked.

## Add .env files for frontend and backend

Two example files were added for convenience:

- `backend/.env.example` — copy to `backend/.env` and populate with your MongoDB URI, JWT secret, and any payment keys.
- `frontend/env.example` — copy to `frontend/.env` (or create `VITE_API_URL` in your environment) with the API URL the frontend should use.

Commands to copy the examples:

```bash
cp backend/.env.example backend/.env
cp frontend/env.example frontend/.env
```

Note: The `frontend` uses Vite; environment variables that need to be exposed to the client should begin with `VITE_`.

## 6) Useful scripts (quick reference)

Backend (in `backend/`):
- `npm run dev` — start backend with `nodemon` (development)
- `npm start` — run `node server.js` (production)
- `npm run seed:admin` — seed an admin user via `scripts/seedAdmin.js`

Frontend (in `frontend/`):
- `npm run dev` — start Vite dev server (port 8080)

## 7) Common troubleshooting

- MongoDB connection fails: ensure `MONGO_CONNECTION_STRING` is correct and MongoDB is running or Atlas IP whitelist allows your IP.
- CORS or proxy errors: verify backend is running and `frontend/vite.config.js` proxy is set to the correct backend URL.
- Missing env vars: the server will crash or return errors if required env vars like `JWT_SECRET` or `MONGO_CONNECTION_STRING` are missing.
- Port conflicts: if `5000` or `8080` are already used, change `PORT` or Vite server port in `frontend/vite.config.js`.


cd "C:\Users\GEOGAMES\OneDrive\Desktop\aid-express-main\backend"
cd "C:\Users\GEOGAMES\OneDrive\Desktop\aid-express-main\frontend"