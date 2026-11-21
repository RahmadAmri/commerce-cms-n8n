# NOVA Commerce & CMS

A full-stack modern commerce technical test implementation built with Next.js, Node.js/Express, Sequelize, PostgreSQL, Tripay Sandbox, and n8n.

## Features

- Responsive storefront with product catalog and shopping bag
- Checkout flow with customer details
- Tripay sandbox integration plus a usable mock payment page
- Tripay callback endpoint with HMAC-style private-key verification
- CMS for product creation, deletion, and order monitoring
- PostgreSQL persistence through Sequelize ORM
- n8n webhook events for `product.created`, `order.created`, and `payment.paid`
- Demo mode that lets the complete application run even if PostgreSQL or payment credentials are unavailable

## Architecture

```text
Next.js storefront/CMS
        |
        | REST API
        v
Express API -> Sequelize -> PostgreSQL
        |
        +------> Tripay Sandbox
        |
        +------> n8n Webhooks
```

`client/` contains the Next.js application. `server/` contains Express routes, Sequelize models, migration/seed data, and third-party integrations.

## Quick start

### 1. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 2. Prepare PostgreSQL locally

This project does not require Docker. Install PostgreSQL natively, create the database, and point `DATABASE_URL` to it:

```bash
cd server
npm run db:create
npm run db:migrate
npm run db:seed
```

The API opens in demo mode when PostgreSQL is unavailable, so the storefront can still be run locally.

### 3. Configure the API

```bash
cd server
cp .env.example .env
```

Fill Tripay sandbox credentials and n8n webhook URL only when available. Without credentials, the system uses a mock payment page.

### 4. Run

Terminal 1:

```bash
cd server
npm run dev
```

Terminal 2:

```bash
cd client
npm run dev
```

Open `http://localhost:3000` for the store and `http://localhost:3000/admin` for the CMS.

## Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `TRIPAY_API_KEY` | Tripay API key |
| `TRIPAY_PRIVATE_KEY` | Tripay private key for signature verification |
| `TRIPAY_MERCHANT_CODE` | Tripay merchant code |
| `TRIPAY_SANDBOX` | Set `true` for Tripay sandbox |
| `TRIPAY_BASE_URL` | Tripay sandbox or production API base URL |
| `N8N_WEBHOOK_URL` | n8n production/webhook-test URL |
| `N8N_WEBHOOK_TOKEN` | Optional webhook token |
| `NEXT_PUBLIC_API_URL` | Express API URL used by Next.js |

## Tripay setup

1. Register for the Tripay sandbox and copy the API key, private key, and merchant code.
2. Set them in `server/.env`.
3. For callback delivery, expose the Express callback URL publicly (for example with ngrok): `https://YOUR_DOMAIN/api/payments/tripay/callback`.
4. Set `API_PUBLIC_URL` and `CLIENT_URL` to the public/local URLs.

For a local callback without Docker, expose the Express server:

```bash
npx ngrok http 4000
```

Set `API_PUBLIC_URL=https://YOUR-NGROK-DOMAIN.ngrok-free.app` in `server/.env`, restart the API, then create a new checkout.

Without credentials, checkout redirects to `/api/payments/mock/:reference`, where payment can be simulated and redirects back to the store.

## n8n setup

Run n8n locally without Docker:

```bash
npx n8n
```

1. Open n8n at `http://localhost:5678`.
2. Import `n8n/order-automation.json`.
3. Activate the workflow and copy its production webhook URL.
4. Set `N8N_WEBHOOK_URL` in `server/.env`.

The workflow accepts commerce events and separates paid orders, new orders, and product events into downstream automation branches.

## Database migration

```bash
cd server
npm run db:migrate
```

## Production build

```bash
cd server && npm start
cd ../client && npm run build && npm start
```
