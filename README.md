# BatteryChecker

BatteryChecker is a Vite + React + TypeScript frontend with a Vercel serverless API in `api/index.ts`.

## Local Development

Install dependencies:

```bash
npm install
```

Run the frontend locally:

```bash
npm run dev
```

## Vercel Deployment

This project is configured for Vercel with:

- `buildCommand`: `npm run build`
- `outputDirectory`: `dist`
- Serverless API route at `/api` powered by `api/index.ts`
- SPA fallback routing to `index.html`

Important behavior:

- Frontend static assets are served from `dist/`
- API requests to `/api` and `/api/*` are handled by the serverless function
- Client-side routes (for example `/dashboard`) are rewritten to `index.html`

## API Behavior

`/api` supports:

- `GET` for health checks
- `POST` for JSON payload submission
- `OPTIONS` for CORS preflight

Example:

```bash
curl -X POST https://<your-vercel-domain>/api \
  -H "Content-Type: application/json" \
  -d '{"battery": 87, "status": "ok"}'
```
