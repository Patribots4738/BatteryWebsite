import { JSONFilePreset } from 'lowdb/node';
import {
	formatValidationIssues,
	getJsonDataValidationIssues,
	type DatabaseStructure,
	type Header,
	type JsonData,
	validateJsonData,
	EmptyDatabase
} from './types';
import * as fs from 'node:fs';
import path from 'node:path';

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

function normalizeLists(data: unknown): JsonData[] {
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

export async function parseData(
	data: unknown,
	teamNumber: number
): Promise<Error[] | null> {
	const errors: Error[] = [];
	let fromRemote: unknown;

	try {
		fromRemote = normalizeIncomingData(await data);
	} catch (error) {
		const errorMessage =
			'Invalid data type received from remote: unable to parse payload';
		console.error(errorMessage, await data);
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

	const db = await JSONFilePreset<DatabaseStructure>(
		checkDataFiles(teamNumber),
		EmptyDatabase
	);

	const canonicalData = fromRemote as JsonData;

	const batteryNumber: number = canonicalData.batteryNumber;
	const dateString: string = `${canonicalData.header.date.month}-${canonicalData.header.date.day}-${canonicalData.header.date.year}`;
	const timeString: string = `${canonicalData.header.time.hour}-${canonicalData.header.time.minute}-${canonicalData.header.time.second}`;
	const fullDateTimeString: string = `${dateString}_${timeString}`;

	if (!db.data.num[batteryNumber] || !db.data.num[batteryNumber].headers) {
		db.data.num[batteryNumber] = {
			headers: {},
			latest: canonicalData.header
		};
	}

	if (!db.data.allData[batteryNumber]) {
		db.data.allData[batteryNumber] = {};
	}

	if (
		canonicalData.header.comingFrom.search(/Robot/) !== -1 &&
		canonicalData.header.movingTo.search(/Charger/) !== -1
	) {
		// add the new data to the recently used ones
		db.data.recentlyUsed = [canonicalData, ...db.data.recentlyUsed].slice(
			0,
			10
		);
	}

	if (
		canonicalData.header.movingTo.search(/CBA/) !== -1 &&
		canonicalData.header.movingTo.search(/Robot/) !== -1 &&
		canonicalData.header.movingTo.search(/Other/) !== -1
	) {
		// update the checked out batteries list
		db.data.checkedOut = [canonicalData, ...db.data.checkedOut];
	}

	if (
		canonicalData.header.comingFrom.search(/CBA/) !== -1 &&
		canonicalData.header.comingFrom.search(/Robot/) !== -1 &&
		canonicalData.header.comingFrom.search(/Other/) !== -1 &&
		canonicalData.header.movingTo.search(/Charger/) !== -1
	) {
		// remove the data from the checked out batteries list
		const checkedOut = normalizeLists(db.data.checkedOut);
		let list: JsonData[] = checkedOut;
		for (let i = 0; i < checkedOut.length; i++) {
			if (checkedOut[i].batteryNumber === canonicalData.batteryNumber) {
				list = checkedOut.slice(0, i).concat(checkedOut.slice(i + 1));
			}
		}
		db.data.checkedOut = list;
	}

	// Write the header data
	db.data.num[batteryNumber].headers[fullDateTimeString] =
		canonicalData.header;

	// Update latest header for this battery
	db.data.num[batteryNumber].latest = canonicalData.header;

	// Update latest changed battery
	db.data.latest = canonicalData.header;

	// Write the full data to the allData section of the database
	db.data.allData[batteryNumber][fullDateTimeString] = canonicalData;

	if (errors.length > 0) {
		for (const error of errors) {
			console.error('Error during data processing:', error);
		}
		return errors;
	}

	await db.write();

	return null;
}

export async function getData(
	requestedPath: string,
	teamNumber: number
): Promise<JsonData | JsonData[] | Header | Header[] | object> {
	const isValidPath = [
		'latest',
		'num',
		'recentlyUsed',
		'checkedOut'
	].includes(requestedPath);
	if (!isValidPath) {
		console.error(`Invalid path requested: ${requestedPath}`);
		return {};
	}

	const db = await JSONFilePreset<DatabaseStructure>(
		checkDataFiles(teamNumber),
		EmptyDatabase
	);

	switch (requestedPath) {
		case 'latest':
			return db.data.latest;
		case 'num':
			return db.data.num;
		case 'recentlyUsed':
			return db.data.recentlyUsed;
		case 'checkedOut':
			return db.data.checkedOut;
		default:
			return {};
	}
}

function checkDataFiles(teamNumber: number): string {
	const databasePath: string =
		process.env.DATABASE_PATH === '' || !process.env.DATABASE_PATH
			? path.join(__dirname, '../.jsonfiles/')
			: process.env.DATABASE_PATH;

	if (!fs.existsSync(`${databasePath}${teamNumber}.json`)) {
		fs.mkdirSync(databasePath, { recursive: true });
		fs.writeFileSync(
			`${databasePath}${teamNumber}.json`,
			JSON.stringify(EmptyDatabase)
		);
	}

	if (databasePath === path.join(__dirname, '../.jsonfiles/')) {
		console.error(`WARNING!! Using database path: ${databasePath}`);
		console.error(`Please update the DATABASE_PATH variable ASAP!!`);
	}
	return databasePath + teamNumber + '.json';
}
