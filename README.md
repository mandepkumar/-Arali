# Arali- ai

Small full-stack app for managing customers: a **React** (Vite) front end and an **Express** API backed by a JSON file.

## Structure

- **`client/`** — UI (`npm run dev` for local dev)
- **`backend/`** — API and `database.json` (`npm run dev` to run the server)
- **`api/`** — Vercel serverless entry that wires the API for production

## Local development

1. **API** — from `backend/`:

   ```bash
   npm install
   npm run dev
   ```

2. **Client** — from `client/`:

   ```bash
   npm install
   npm run dev
   ```

   Vite proxies `/customers` to `http://localhost:3000`, so keep the API on the default port **3000** while using the client dev server.

3. **Backend tests** — from `backend/`:

   ```bash
   npm test
   ```

## Deploy

The repo is set up for **Vercel** (`vercel.json`): client build output is served, and `/customers` routes go to the serverless API.
