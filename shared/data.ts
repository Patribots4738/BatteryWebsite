import { db } from './firebaseConfig.js';
import { get, ref, set } from 'firebase/database';
import {
	type JsonData,
	type Header,
	formatValidationIssues,
	getJsonDataValidationIssues,
	validateHeader,
	validateJsonData
} from './types.ts';

type RawRecord = Record<string, unknown>;

function isRecord(value: unknown): value is RawRecord {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function cloneJson<T>(value: T): T {
	return JSON.parse(JSON.stringify(value)) as T;
}

function normalizeIncomingData(data: unknown): unknown {
	const parsed = typeof data === 'string' ? JSON.parse(data) : data;
	if (!isRecord(parsed)) {
		return parsed;
	}

	const normalized = cloneJson(parsed) as RawRecord;

	if (
		typeof normalized.batteryNumber !== 'number' &&
		typeof normalized.battery === 'number'
	) {
		normalized.batteryNumber = normalized.battery;
	}

	if (isRecord(normalized.header) && isRecord(normalized.header.time)) {
		const time = normalized.header.time as RawRecord;
		if (typeof time.minute !== 'number' && typeof time.time === 'number') {
			time.minute = time.time;
		}
	}

	return normalized;
}

function normalizeRecentList(data: unknown): JsonData[] {
	if (Array.isArray(data)) {
		return data.filter((item): item is JsonData => validateJsonData(item));
	}

	if (isRecord(data)) {
		return Object.values(data).filter((item): item is JsonData =>
			validateJsonData(item)
		);
	}

	return [];
}

export async function parseData(data: unknown): Promise<Error[] | null> {
	const errors: Error[] = [];
	let fromRemote: unknown;

	try {
		fromRemote = normalizeIncomingData(data);
	} catch (error) {
		const errorMessage =
			'Invalid data type received from remote: unable to parse payload';
		console.error(errorMessage, data);
		errors.push(
			new Error(
				`${errorMessage}: ${error instanceof Error ? error.message : String(error)}`
			)
		);
		return errors;
	}

	if (!validateJsonData(fromRemote)) {
		const issues = getJsonDataValidationIssues(fromRemote);
		const errorMessage =
			'Invalid data format received from remote: ' +
			formatValidationIssues(issues);
		console.error(errorMessage, fromRemote);
		errors.push(new Error(errorMessage));
		return errors;
	}

	const canonicalData = fromRemote as JsonData;

	const batteryNumber: number = canonicalData.batteryNumber;
	const dateString: string = `${canonicalData.header.date.month}-${canonicalData.header.date.day}-${canonicalData.header.date.year}`;
	const timeString: string = `${canonicalData.header.time.hour}-${canonicalData.header.time.minute}-${canonicalData.header.time.second}`;
	const fullDateTimeString: string = `${dateString}_${timeString}`;

	const latestBatteryData = ref(db, `/num/${batteryNumber}/latest/`);
	const headerDb = ref(
		db,
		`/num/${batteryNumber}/headers/${fullDateTimeString}`
	);
	const fullDataLocation = ref(
		db,
		`/allData/${batteryNumber}/${fullDateTimeString}/`
	);
	const recentlyUsedList = ref(db, `/recentlyUsed/`);
	const lastChangedBattery = ref(db, '/latest/');

	if (
		canonicalData.header.movingTo.search(/Charger/) !== -1 &&
		canonicalData.header.comingFrom.search(/Robot/) !== -1
	) {
		const currentList = normalizeRecentList(
			(await get(recentlyUsedList)).toJSON()
		);
		const list = [canonicalData, ...currentList].slice(0, 10);
		set(recentlyUsedList, list).catch((error) => {
			console.error(
				'Error updating recently used batteries list: ' + error
			);
			errors.push(
				new Error(
					'Failed to update recently used batteries list' + error
				)
			);
		});
	}

	set(headerDb, canonicalData.header)
		.then(() => {
			console.log('Header data pushed successfully to header database');
		})
		.catch((error) => {
			console.error('Error updating header db:', error);
			errors.push(new Error('Failed to update header database' + error));
		});

	set(latestBatteryData, canonicalData.header)
		.then(() => {
			console.log('Header data set successfully to latest data');
		})
		.catch((error) => {
			console.error('Error updating latest header:', error);
			errors.push(
				new Error('Failed to update latest header data' + error)
			);
		});

	set(fullDataLocation, canonicalData)
		.then(() => {
			console.log('All data pushed successfully');
		})
		.catch((error) => {
			console.error('Error pushing latest data:', error);
			errors.push(
				new Error('Failed to push full data to database' + error)
			);
		});

	set(lastChangedBattery, canonicalData.header)
		.then(() => {
			console.log('Latest battery data updated successfully');
		})
		.catch((error) => {
			console.error('Error updating latest battery data:', error);
			errors.push(
				new Error('Failed to update latest battery data' + error)
			);
		});

	if (errors.length > 0) {
		return errors;
	}
	return null;
}

export async function getDataFromFirebase(
	path: string
): Promise<JsonData | Header | Header[] | number[] | null> {
	const data = (await get(ref(db, path))).toJSON();
	if (validateJsonData(data)) {
		return data as JsonData;
	} else if (validateHeader(data)) {
		return data as Header;
	} else if (Array.isArray(data)) {
		if (data.every((item) => validateHeader(item))) {
			return data as Header[];
		} else if (data.every((item) => typeof item === 'number')) {
			return data as number[];
		} else {
			return null;
		}
	} else {
		return null;
	}
}
