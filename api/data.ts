import { db } from './firebaseConfig.ts';
import { get, push, set, ref } from 'firebase/database';

export async function parseData(data: JsonData) {
	const fromRemote: JsonData = JSON.parse(JSON.stringify(data)) as JsonData;
	const batteryNumber: number = fromRemote.batteryNumber;
	const dateString: string = `${fromRemote.header.date.month}-${fromRemote.header.date.day}-${fromRemote.header.date.year}`;
	const timeString: string = `${fromRemote.header.time.hour}:${fromRemote.header.time.minute}:${fromRemote.header.time.second}`;
	const fullDateTimeString: string = `${dateString}_${timeString}`;
	
	const latestBatteryData = ref(db, `/num/${batteryNumber}/latest`);
	const headerDb = ref(db, `/num/${batteryNumber}/headers`);
	const fullDataDb = ref(db, `/allData/${batteryNumber}/${fullDateTimeString}`);
	const recentlyUsedList = ref(db, `/recentlyUsed`);
	const lastChangedBattery = ref(db, '/latest');
	const lastChangedBatteryData = (await get(lastChangedBattery)).toJSON() as JsonData | null;
	
	if (lastChangedBatteryData?.header.movingTo.search(/Charger/) !== -1) {
		const list = (await get(recentlyUsedList)).exportVal() as number[];
		list.reverse();
		list.push(batteryNumber);
		list.reverse();
		while (list.length > 10) {
			list.pop()
		}
		await set(recentlyUsedList, list);
	}
	
	await push(headerDb, fromRemote.header);
	await push(latestBatteryData, fromRemote.header);
	await push(fullDataDb, fromRemote);
}

export async function getDataFromFirebase(path: string) {
	return (await get(ref(db, path))).toJSON() as object;
}

type DataPoint = {
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
