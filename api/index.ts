type JsonRecord = Record<string, unknown>;

type RequestLike = {
	method?: string;
	headers?: Record<string, string | string[] | undefined>;
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
		if (req.query?.path) {
			const data = req.query?.path as string;
			const rawUserAgent =
				req.headers?.['user-agent'] ?? req.headers?.['User-Agent'];
			const userAgent = Array.isArray(rawUserAgent)
				? rawUserAgent.join(', ')
				: (rawUserAgent ?? 'unknown-user-agent');
			import('../shared/data.ts').then((module) => {
				module
					.getDataFromFirebase(data as string)
					.then((firebaseData) => {
						console.log(
							`${userAgent} requested ${data}, returned ` +
								firebaseData
						);
						if (firebaseData) {
							res.status(200).json({
								ok: true,
								message: 'Data retrieved successfully',
								data: firebaseData
							});
						} else {
							res.status(206).json({
								ok: true,
								message:
									'Data retrieved successfully, return was null',
								data: firebaseData
							});
						}
					})
					.catch((error: unknown) => {
						console.log(
							`Failed to retrieve data ${data} from Firebase:` +
								error
						);
						res.status(500).json({
							ok: false,
							message: 'Failed to retrieve data'
						});
					});
			});
			return;
		}
		res.status(200).json({
			ok: true,
			message: 'Server OK, no data requested'
		});
		return;
	}

	if (req.method === 'POST') {
		console.log('Received data:', req.body);
		if (req.body) {
			import('../shared/data.ts').then((module) => {
				module
					.parseData(req.body)
					.then((errors) => {
						if (!errors) {
							res.status(202).json({
								ok: true,
								message: 'Data accepted, sent to backend',
								received: req.body
							});
						} else {
							for (const error of errors) {
								console.error(error);
							}

							res.status(500).json({
								ok: false,
								message: 'Failed to process data',
								received: req.body,
								errors: errors.map((error) => error.message)
							});
						}
					})
					.catch((error: unknown) => {
						console.error('Failed to process POST payload:', error);
						res.status(500).json({
							ok: false,
							message: 'Failed to process data'
						});
					});
			});
			return;
		}
		res.status(400).json({
			ok: false,
			message: 'No data received',
			received: req.body
		});
		return;
	}

	res.status(405).json({
		ok: false,
		message: 'Method not allowed.'
	});
	return;
}
