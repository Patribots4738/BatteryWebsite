import { db } from './firebaseConfig.ts';
import { get, push, ref, set } from 'firebase/database';
import { JsonData } from './types.ts';

export async function parseData(data: JsonData): Promise<Error[]|null> {
	const errors: Error[] = [];
	
	const fromRemote: JsonData = JSON.parse(JSON.stringify(data)) as JsonData;
	const batteryNumber: number = fromRemote.batteryNumber;
	const dateString: string = `${fromRemote.header.date.month}-${fromRemote.header.date.day}-${fromRemote.header.date.year}`;
	const timeString: string = `${fromRemote.header.time.hour}-${fromRemote.header.time.minute}-${fromRemote.header.time.second}`;
	const fullDateTimeString: string = `${dateString}_${timeString}`;
	
	const latestBatteryData = ref(db, `/num/${batteryNumber}/latest/`);
	const headerDb = ref(db, `/num/${batteryNumber}/headers/`);
	const fullDataLocation = ref(db, `/allData/${batteryNumber}/${fullDateTimeString}`);
	const recentlyUsedList = ref(db, `/recentlyUsed/`);
	const lastChangedBattery = ref(db, '/latest/');
	const lastChangedBatteryData = (await get(lastChangedBattery)).toJSON() as JsonData | null;
	
	if (lastChangedBatteryData?.header.movingTo.search(/Charger/) !== -1) {
		const list = (await get(recentlyUsedList)).exportVal() as number[];
		list.reverse();
		list.push(batteryNumber);
		list.reverse();
		while (list.length > 10) {
			list.pop()
		}
		set(recentlyUsedList, list)
			.catch((error) => {
				console.error('Error updating recently used batteries list: ' + error);
				errors.push(new Error('Failed to update recently used batteries list' + error));
			});
	}
	
	push(headerDb, fromRemote.header)
		.then((snapshot) => {
			console.log('Header data pushed successfully to header database, key:', snapshot.key);
		})
		.catch((error) => {
			console.error('Error updating header db:', error);
			errors.push(new Error('Failed to update header database' + error));
		});
	
	set(latestBatteryData, fromRemote.header)
		.then(() => {
			console.log('Header data set successfully to latest data');
		})
		.catch((error) => {
			console.error('Error updating latest header:', error);
			errors.push(new Error('Failed to update latest header data' + error));
		});
	
	push(fullDataLocation, fromRemote)
		.then((snapshot) => {
			console.log('All data pushed successfully, key:', snapshot.key);
		})
		.catch((error) => {
			console.error('Error pushing latest data:', error);
			errors.push(new Error('Failed to push full data to database' + error));
		});
	
	if (errors.length > 0) {
		return errors;
	}
	return null;
}

export async function getDataFromFirebase(path: string): Promise<object | null> {
	const snapshot = await get(ref(db, path));
	return snapshot.exists() ? (snapshot.val() as object) : null;
}
