import express, { type Response } from 'express';
import ViteExpress from 'vite-express';
import {
	checkForUserId,
	returnGETResponse,
	returnPOSTResponse
} from './api/response.ts';
import cors from 'cors';
import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import {
	middleware,
	errorHandler,
	type SessionRequest
} from 'supertokens-node/framework/express';

import { supertokensConfig } from './shared/supertokensConfig.ts';

const app = express();
const PORT = parseInt(process.env.PORT ? process.env.PORT : '4738', 10);

supertokens.init({
	framework: 'express',
	supertokens: {
		// fyi the port is correct for localhost
		connectionURI: process.env.SUPERTOKENS_INSTANCE || 'localhost:44738',
		apiKey: process.env.API_KEY || ''
	},
	appInfo: supertokensConfig,
	recipeList: [EmailPassword.init(), Session.init()]
});

app.use(express.json());
app.use(
	cors({
		origin: supertokensConfig.websiteDomain,
		allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
		credentials: true
	})
);

app.use(middleware());

app.get('/api', async (req: SessionRequest, res: Response) => {
	try {
		const userId = checkForUserId(req);
		const response = await returnGETResponse(req, userId);

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

app.post('/api', async (req: SessionRequest, res: Response) => {
	try {
		const userId = checkForUserId(req);
		const response = await returnPOSTResponse(req, userId);

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

app.use(errorHandler());

if (process.env.NODE_ENV === 'production') {
	ViteExpress.config({
		mode: 'production'
	});
} else {
	ViteExpress.config({
		mode: 'development'
	});
}

ViteExpress.listen(app, PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});
