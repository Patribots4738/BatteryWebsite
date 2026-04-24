import { Request as ExpReq } from 'express';
import { getData, parseData } from '../shared/data.ts';

export async function returnGETResponse(request: ExpReq): Promise<Response> {
	const path = request.query['path'];

	if (Array.isArray(path)) {
		return buildResponse(
			400,
			'Invalid path parameter: expected a single value'
		);
	} else if (typeof path !== 'string' && path !== undefined) {
		return buildResponse(400, 'Invalid path parameter: expected a string');
	} else if (path === '' || !path || path.trim() === '') {
		return buildResponse(200, 'Server OK, no data requested');
	}

	const userAgent = request.header('User-Agent') ?? 'unknown-user-agent';

	try {
		// TODO: add auth
		const data = await getData(path, 4738);

		console.log(
			`${userAgent} requested ${path}, returned ${JSON.stringify(data)}`
		);

		if (data == null) {
			return buildResponse(
				206,
				'Data retrieved successfully, return was null',
				data
			);
		}

		return buildResponse(200, 'Data retrieved successfully', data);
	} catch (error) {
		console.log(`Failed to retrieve data ${path} from PocketBase:`, error);
		return buildResponse(500, 'Failed to retrieve data');
	}
}

export async function returnPOSTResponse(request: ExpReq): Promise<Response> {
	const body = await request.body;
	console.log('Received data:', body);

	if (!body) return buildResponse(400, 'No data received');

	try {
		// TODO: add auth
		const errors = await parseData(body, 4738);

		if (!errors) {
			return buildResponse(202, 'Data accepted, sent to backend', body);
		}

		for (const error of errors) {
			console.error(error);
		}

		return buildResponse(
			400,
			'Data validation failed',
			undefined,
			errors.map((error) => error.message)
		);
	} catch (error) {
		console.error('Failed to process POST payload:', error);
		return buildResponse(500, 'Failed to process data');
	}
}

function buildResponse(
	status: number,
	message: string,
	data?: object,
	errors?: string[]
): Response {
	return new Response(
		data
			? errors
				? JSON.stringify({ status, message, data, errors })
				: JSON.stringify({ status, message, data })
			: errors
				? JSON.stringify({ status, message, errors })
				: JSON.stringify({ status, message }),
		{
			status: status,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET,POST',
				'Access-Control-Allow-Headers': 'Content-Type'
			}
		}
	);
}
