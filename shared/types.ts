export type Time = {
	hour: number;
	minute: number;
	second: number;
};

export type ValidationIssue = {
	path: string;
	expected: string;
	received: string;
	message: string;
};

function describeValue(value: unknown): string {
	if (value === null) {
		return 'null';
	}
	if (Array.isArray(value)) {
		return 'array';
	}
	return typeof value;
}

function addIssue(
	issues: ValidationIssue[] | undefined,
	path: string,
	expected: string,
	received: unknown,
	message: string
): void {
	if (!issues) {
		return;
	}
	issues.push({
		path,
		expected,
		received: describeValue(received),
		message
	});
}

export function formatValidationIssues(issues: ValidationIssue[]): string {
	if (issues.length === 0) {
		return 'No validation issues.';
	}
	return issues
		.map(
			(issue) =>
				`${issue.path}: ${issue.message} (expected ${issue.expected}, received ${issue.received})`
		)
		.join('; ');
}

export function validateTime(
	obj: unknown,
	issues?: ValidationIssue[],
	path = 'time'
): obj is Time {
	if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
		addIssue(issues, path, 'object', obj, 'Time must be an object');
		return false;
	}

	const record = obj as Record<string, unknown>;
	let valid = true;

	if (typeof record.hour !== 'number') {
		addIssue(
			issues,
			`${path}.hour`,
			'number',
			record.hour,
			'Hour is missing or not a number'
		);
		valid = false;
	}
	if (typeof record.minute !== 'number') {
		addIssue(
			issues,
			`${path}.minute`,
			'number',
			record.minute,
			'Minute is missing or not a number'
		);
		valid = false;
	}
	if (typeof record.second !== 'number') {
		addIssue(
			issues,
			`${path}.second`,
			'number',
			record.second,
			'Second is missing or not a number'
		);
		valid = false;
	}

	return valid;
}

export type Date = {
	year: number;
	month: number;
	day: number;
};

export function validateDate(
	obj: unknown,
	issues?: ValidationIssue[],
	path = 'date'
): obj is Date {
	if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
		addIssue(issues, path, 'object', obj, 'Date must be an object');
		return false;
	}

	const record = obj as Record<string, unknown>;
	let valid = true;

	if (typeof record.year !== 'number') {
		addIssue(
			issues,
			`${path}.year`,
			'number',
			record.year,
			'Year is missing or not a number'
		);
		valid = false;
	}
	if (typeof record.month !== 'number') {
		addIssue(
			issues,
			`${path}.month`,
			'number',
			record.month,
			'Month is missing or not a number'
		);
		valid = false;
	}
	if (typeof record.day !== 'number') {
		addIssue(
			issues,
			`${path}.day`,
			'number',
			record.day,
			'Day is missing or not a number'
		);
		valid = false;
	}

	return valid;
}

export type Header = {
	date: Date;
	time: Time;
	movingTo: string;
	comingFrom: string;
	initialVoltage: number;
	charge: number;
	internalResistance: number;
};

export function validateHeader(
	obj: unknown,
	issues?: ValidationIssue[],
	path = 'header'
): obj is Header {
	if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
		addIssue(issues, path, 'object', obj, 'Header must be an object');
		return false;
	}

	const record = obj as Record<string, unknown>;
	let valid = true;

	if (!validateDate(record.date, issues, `${path}.date`)) {
		valid = false;
	}
	if (!validateTime(record.time, issues, `${path}.time`)) {
		valid = false;
	}
	if (typeof record.movingTo !== 'string') {
		addIssue(
			issues,
			`${path}.movingTo`,
			'string',
			record.movingTo,
			'movingTo is missing or not a string'
		);
		valid = false;
	}
	if (typeof record.comingFrom !== 'string') {
		addIssue(
			issues,
			`${path}.comingFrom`,
			'string',
			record.comingFrom,
			'comingFrom is missing or not a string'
		);
		valid = false;
	}
	if (typeof record.initialVoltage !== 'number') {
		addIssue(
			issues,
			`${path}.initialVoltage`,
			'number',
			record.initialVoltage,
			'initialVoltage is missing or not a number'
		);
		valid = false;
	}
	if (typeof record.charge !== 'number') {
		addIssue(
			issues,
			`${path}.charge`,
			'number',
			record.charge,
			'charge is missing or not a number'
		);
		valid = false;
	}
	if (typeof record.internalResistance !== 'number') {
		addIssue(
			issues,
			`${path}.internalResistance`,
			'number',
			record.internalResistance,
			'internalResistance is missing or not a number'
		);
		valid = false;
	}

	return valid;
}

export type DataPoint = {
	time: number;
	voltage: number;
	current: number;
};

export function validateDataPoint(
	obj: unknown,
	issues?: ValidationIssue[],
	path = 'datapoint'
): obj is DataPoint {
	if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
		addIssue(issues, path, 'object', obj, 'DataPoint must be an object');
		return false;
	}

	const record = obj as Record<string, unknown>;
	let valid = true;

	if (typeof record.time !== 'number') {
		addIssue(
			issues,
			`${path}.time`,
			'number',
			record.time,
			'time is missing or not a number'
		);
		valid = false;
	}
	if (typeof record.voltage !== 'number') {
		addIssue(
			issues,
			`${path}.voltage`,
			'number',
			record.voltage,
			'voltage is missing or not a number'
		);
		valid = false;
	}
	if (typeof record.current !== 'number') {
		addIssue(
			issues,
			`${path}.current`,
			'number',
			record.current,
			'current is missing or not a number'
		);
		valid = false;
	}

	return valid;
}

export type Datapoints = Record<string, DataPoint>;

export function validateDatapoints(
	obj: unknown,
	issues?: ValidationIssue[],
	path = 'datapoints'
): obj is Datapoints {
	if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
		addIssue(
			issues,
			path,
			'object',
			obj,
			'datapoints must be an object map'
		);
		return false;
	}

	let valid = true;
	for (const [key, value] of Object.entries(obj)) {
		if (!validateDataPoint(value, issues, `${path}.${key}`)) {
			valid = false;
		}
	}

	return valid;
}

export interface JsonData {
	batteryNumber: number;
	header: Header;
	datapoints: Datapoints;
}

export function validateJsonData(
	obj: unknown,
	issues?: ValidationIssue[],
	path = 'jsonData'
): obj is JsonData {
	if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
		addIssue(
			issues,
			path,
			'object',
			obj,
			'Top-level payload must be an object'
		);
		return false;
	}

	const record = obj as Record<string, unknown>;
	let valid = true;

	if (typeof record.batteryNumber !== 'number') {
		addIssue(
			issues,
			`${path}.batteryNumber`,
			'number',
			record.batteryNumber,
			'batteryNumber is missing or not a number'
		);
		valid = false;
	}
	if (!validateHeader(record.header, issues, `${path}.header`)) {
		valid = false;
	}
	if (!validateDatapoints(record.datapoints, issues, `${path}.datapoints`)) {
		valid = false;
	}

	return valid;
}

export function getJsonDataValidationIssues(obj: unknown): ValidationIssue[] {
	const issues: ValidationIssue[] = [];
	validateJsonData(obj, issues);
	return issues;
}

export const BatteryNames: Record<number, string> = {
	1: 'Unused',
	2: 'Unused',
	3: 'Unused',
	4: 'Unused',
	5: 'Unused',
	6: 'Unused',
	7: 'Marley',
	8: 'Unused',
	9: 'Unused',
	10: 'Benson',
	11: 'Waggles',
	12: 'Unused',
	13: 'Nemo',
	14: 'Waldo',
	15: 'Buc-ee',
	16: 'Frank',
	17: 'Dexter',
	18: 'Woody',
	19: 'Geoff',
	20: 'Humpty Dumpty',
	21: 'Olaf',
	22: 'Snufflupagus',
	23: 'Pikachu',
	24: 'Voltaire',
	25: 'Spyro',
	26: 'Bowser'
};

export type ApiResponseBody = {
	status: number;
	message: string;
	data?: object;
	errors?: Error[];
};

export type DatabaseStructure = {
	allData: {
		[batteryNumber: string]: {
			[dateTimeString: string]: JsonData;
		};
	};
	latest: Header;
	num: {
		[batteryNumber: string]: {
			headers: {
				[dateTimeString: string]: Header;
			};
			latest: Header;
		};
	};
	recentlyUsed: JsonData[];
	checkedOut: JsonData[];
};

export const EmptyDatabase: DatabaseStructure = {
	allData: {},
	latest: {
		date: { year: 0, month: 0, day: 0 },
		time: { hour: 0, minute: 0, second: 0 },
		movingTo: '',
		comingFrom: '',
		initialVoltage: 0,
		charge: 0,
		internalResistance: 0
	},
	num: {},
	recentlyUsed: [],
	checkedOut: []
};
