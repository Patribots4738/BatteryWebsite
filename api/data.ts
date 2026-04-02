import { db } from './firebaseConfig.ts';
import { get, push, ref } from 'firebase/database';

export async function parseData(data: JsonData) {
	const fromRemote: JsonData = JSON.parse(JSON.stringify(data)) as JsonData;
	const batteryNumber: number = fromRemote.batteryNumber;
	const dateString: string = `${fromRemote.header.date.month}-${fromRemote.header.date.day}-${fromRemote.header.date.year}`;
	const timeString: string = `${fromRemote.header.time.hour}:${fromRemote.header.time.minute}:${fromRemote.header.time.second}`;
	const fullDateTimeString: string = `${dateString}_${timeString}`;
	
	const latestQuery = ref(db, `/${batteryNumber}/latest`);
	const headerDb = ref(db, `/${batteryNumber}/headers`);
	const fullDataDb = ref(db, `/allData/${batteryNumber}/${fullDateTimeString}`);
	
	await push(headerDb, fromRemote.header);
	await push(latestQuery, fromRemote.header);
	await push(fullDataDb, fromRemote);
}

export async function getDataFromFirebase(path: string) {
	const dataRef = ref(db, path);
	const snapshot = await get(dataRef);
	return snapshot.toJSON() as object;
}

export type DataPoint = {
	time: number;
	voltage: number;
	current: number;
};

export interface JsonData {
	batteryNumber: number;
	header: {
		date: {
			year: number;
			month: number;
			day: number;
		};
		time: {
			hour: number;
			minute: number;
			second: number;
		};
		movingTo: string,
		initialVoltage: number;
		internalResistance: number;
	};
	datapoints: Record<string, DataPoint>;
}
