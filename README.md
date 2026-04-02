# BatteryChecker

A React app built with Vite that runs an API for interacting with our data.

## Local Development

Install dependencies:

```bash
npm install
```

Frontend development: `npm run dev:react`<br>
Backend development: `npm run dev:server`<br>
Fullstack development: `npm run dev:all`<br>
Test before deploying: `npm run start`

## Vercel Deployment

Everything will be deployed to Vercel, and this is primarily why `npm run start` runs the Vercel CLI.

- Builds can be done with `npm run build`
- `outputDirectory`: `dist`
- API route is hosted at `/api`

## API Behavior

`/api` supports:

- `GET` for health checks
- `POST` for JSON payload submission

Example:

```bash
curl -X POST https://127.0.0.1:3000/api \
  -H "Content-Type: application/json" \
  -d '{ "yourData": "here" }'
```

### JSON Payloads

The API expects JSON payloads with the following structure:

```json
{
  "batteryNumber": 17,
  "header": {
    "date": {
      "year": 1928,
      "month": 4,
      "day": 12
    },
    "time": {
      "hour": 16,
      "time": 3,
      "second": 45
    },
    "movingTo": "Robot",
    "initialVoltage": 13.192,
    "internalResistance": 0.021
  },
  "datapoints": {
    "0": {
      "time": 0,
      "voltage": 13.192,
      "current": 0.0
    },
    "1": {
      "time": 1,
      "voltage": 13.183,
      "current": 1.0
    }
  }
}
```