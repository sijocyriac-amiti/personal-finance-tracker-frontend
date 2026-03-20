# Personal Finance Tracker Frontend

React + TypeScript frontend for the Personal Finance Tracker product.

## Stack

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- React Hook Form
- Zod
- Recharts
- Axios

## Features

- Auth screens:
  - login
  - sign up
  - forgot password
  - reset password
- Protected app shell with:
  - sidebar navigation
  - topbar search
  - shared date picker
  - notifications placeholder
  - user profile menu
- Main product pages:
  - dashboard
  - transactions
  - budgets
  - goals
  - reports
  - recurring
  - accounts
  - settings
- Global add transaction modal

## Setup

Create a local env file from `.env.example`.

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Default API target:

```properties
VITE_API_BASE_URL=http://localhost:8080/api
```

For this machine, a local `.env.local` is already supported and keeps the frontend pointed at the backend on `http://localhost:8080/api`.

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## E2E Test

This repo includes a Playwright smoke test for the sign-up to dashboard flow.

Prerequisites:

- frontend available at `http://localhost:3000`
- backend API available at `http://localhost:8080`

Install browsers once:

```bash
npx playwright install chromium
```

Run the smoke test:

```bash
npm run test:e2e
```

Run it headed:

```bash
npm run test:e2e:headed
```

## Local Deploy

Deploy the frontend on `http://localhost:3000` so it matches the backend CORS allowlist:

```powershell
powershell -ExecutionPolicy Bypass -File .\run\deploy-frontend.local.ps1
```

Stop the deployed frontend:

```powershell
powershell -ExecutionPolicy Bypass -File .\run\stop-frontend.local.ps1
```

## Backend Dependency

This frontend expects the Spring Boot backend to be running separately and reachable through `VITE_API_BASE_URL`.

## Container Build

This repo also includes a `Containerfile` for Podman or Docker-based builds. The full local Podman stack is orchestrated from the backend repo via `compose.podman.yaml`.

For Azure Container Apps, this image is built from ACR with `VITE_API_BASE_URL` set at build time so the frontend points at the deployed backend URL.
