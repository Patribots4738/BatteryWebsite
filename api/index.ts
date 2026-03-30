type JsonRecord = Record<string, unknown>;

type RequestLike = {
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

export default function handler(req: RequestLike, res: ResponseLike): void {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

	if (req.method === 'GET') {
		res.status(200).json({
			ok: true,
			message: 'Server OK'
		});
		return;
	}

	if (req.method === 'POST') {
		console.log('Received data:', req.body);
		if (req.body) {
			res.status(200).json({
				ok: true,
				message: 'Data accepted, sent to backend',
				received: req.body
			});
		} else {
			res.status(400).json({
				ok: false,
				message: 'No data received',
				recieved: req.body
			});
		}
		return;
	}

	res.status(405).json({
		ok: false,
		message: 'Method not allowed.'
	});
}
