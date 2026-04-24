# BatteryChecker

A React app built with Vite that runs an API for interacting with our data.

## Local Development

Install dependencies:

```bash
pnpm install
```

Run the app: `pnpm run start`

## Docker

Requires testing

- Frontend: `http://localhost:3000/`<br>
- API: `http://localhost:3000/api`

## Hosting

Start using `pnpm run start`

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
			"minute": 3,
			"second": 45
		},
		"movingTo": "Robot",
		"comingFrom": "Blast Charger",
		"initialVoltage": 13.192,
		"charge": 104.28,
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
