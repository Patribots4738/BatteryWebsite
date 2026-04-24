import express from 'express';
import ViteExpress from 'vite-express';
import { returnGETResponse, returnPOSTResponse } from './api/response';

const app = express();
const PORT = parseInt(process.env.PORT ? process.env.PORT : '4738', 10);

app.use(express.json());

app.get('/api', async (req, res) => {
	try {
		const response = await returnGETResponse(req);

		const headersObj: Record<string, string> = {};
		response.headers.forEach((value, key) => {
			headersObj[key] = value;
		});

		const body = await response.json();

		res.status(response.status).set(headersObj).json(body);
	} catch (error) {
		console.error('Error handling GET request:', error);
		if (!res.headersSent) {
			res.status(500).json({ message: 'Internal Server Error' });
		}
	}
});

app.post('/api', async (req, res) => {
	try {
		const response = await returnPOSTResponse(req);
		const { status, body } = response;
		let headers: object = {};
		response.headers.forEach((value, key) => {
			headers = { ...headers, [key]: value };
		});
		console.log('Response from POST handler:', { status, headers, body });
		res.set(headers).status(status).json(body);
	} catch (error) {
		console.error('Error handling POST request:', error);
		res.status(500).json({ message: 'Internal Server Error' });
	}
});

ViteExpress.config({
	mode: 'production'
});

ViteExpress.listen(app, PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});
