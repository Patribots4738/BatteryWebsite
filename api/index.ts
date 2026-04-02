import { parseData, JsonData, getDataFromFirebase } from './data.ts';

type JsonRecord = Record<string, unknown>;

type RequestLike = {
	userAgent?: string;
	method?: string;
	headers?: Record<string, string>;
	query?: Record<string, string | string[] | undefined>;
	body?: unknown;
};

type ResponseLike = {
	status: (code: number) => ResponseLike;
	json: (payload: JsonRecord) => void;
	setHeader: (name: string, value: string) => void;
};

// Leave this ignore line, it has to be this was as to be picked up by Vercel.
// noinspection JSUnusedGlobalSymbols
export default function handler(req: RequestLike, res: ResponseLike): void {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

	if (req.method === 'GET') {
		if (req.body) {
			const data = req.body as JsonRecord;
			getDataFromFirebase(data[1] as string)
				.then((firebaseData) => {
					console.log(`${req.userAgent} requested ${data[1]}, returned `, firebaseData);
					res.status(200).json({
						ok: true,
						message: 'Data retrieved successfully',
						data: firebaseData
					});
				})
				.catch((error: unknown) => {
					console.log('Failed to retrieve data from Firebase:', error);
					res.status(500).json({
						ok: false,
						message: 'Failed to retrieve data'
					});
				});
		} else {
			res.status(400).json({
				ok: false,
				message: 'No data received'
			});
		}
		return;
	}

	if (req.method === 'POST') {
		console.log('Received data:', req.body);
		if (req.body) {
			parseData(req.body as JsonData)
				.then(() => {
					res.status(200).json({
						ok: true,
						message: 'Data accepted, sent to backend',
						received: req.body
					});
				})
				.catch((error: unknown) => {
					console.error('Failed to process POST payload:', error);
					res.status(500).json({
						ok: false,
						message: 'Failed to process data'
					});
				});
		} else {
			res.status(400).json({
				ok: false,
				message: 'No data received',
				received: req.body
			});
		}
		return;
	}

	res.status(405).json({
		ok: false,
		message: 'Method not allowed.'
	});
}
