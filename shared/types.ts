export type Time = {
	hour: number;
	minute: number;
	second: number;
};

export function validateTime(obj: unknown): obj is Time {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		'hour' in obj &&
		'minute' in obj &&
		'second' in obj &&
		typeof (obj as { hour: unknown }).hour === 'number' &&
		typeof (obj as { minute: unknown }).minute === 'number' &&
		typeof (obj as { second: unknown }).second === 'number'
	);
}

export type Date = {
	year: number;
	month: number;
	day: number;
};

export function validateDate(obj: unknown): obj is Date {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		'year' in obj &&
		'month' in obj &&
		'day' in obj &&
		typeof (obj as { year: unknown }).year === 'number' &&
		typeof (obj as { month: unknown }).month === 'number' &&
		typeof (obj as { day: unknown }).day === 'number'
	);
}

export type Header = {
	date: Date;
	time: Time;
	movingTo: string;
	comingFrom: string;
	initialVoltage: number;
	internalResistance: number;
};

export function validateHeader(obj: unknown): obj is Header {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		'date' in obj &&
		'time' in obj &&
		'movingTo' in obj &&
		'comingFrom' in obj &&
		'initialVoltage' in obj &&
		'internalResistance' in obj &&
		validateDate((obj as { date: unknown }).date) &&
		validateTime((obj as { time: unknown }).time) &&
		typeof (obj as { movingTo: unknown }).movingTo === 'string' &&
		typeof (obj as { comingFrom: unknown }).comingFrom === 'string' &&
		typeof (obj as { initialVoltage: unknown }).initialVoltage ===
			'number' &&
		typeof (obj as { internalResistance: unknown }).internalResistance ===
			'number'
	);
}

export type DataPoint = {
	time: number;
	voltage: number;
	current: number;
};

export function validateDataPoint(obj: unknown): obj is DataPoint {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		'time' in obj &&
		'voltage' in obj &&
		'current' in obj &&
		typeof (obj as { time: unknown }).time === 'number' &&
		typeof (obj as { voltage: unknown }).voltage === 'number' &&
		typeof (obj as { current: unknown }).current === 'number'
	);
}

export type Datapoints = Record<string, DataPoint>;

export function validateDatapoints(obj: unknown): obj is Datapoints {
	return <boolean>(
		(obj &&
			typeof obj === 'object' &&
			Object.values(obj).every((value) => validateDataPoint(value)))
	);
}

export interface JsonData {
	batteryNumber: number;
	header: Header;
	datapoints: Datapoints;
}

export function validateJsonData(obj: unknown): obj is JsonData {
	return <boolean>(
		(obj &&
			typeof obj === 'object' &&
			'batteryNumber' in obj &&
			'header' in obj &&
			'datapoints' in obj &&
			typeof (obj as { batteryNumber: unknown }).batteryNumber ===
				'number' &&
			validateHeader((obj as { header: unknown }).header) &&
			validateDatapoints((obj as { datapoints: unknown }).datapoints))
	);
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
