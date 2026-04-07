import { db } from './firebaseConfig.ts';
import { get, ref, set } from 'firebase/database';
import { JsonData, Header, validateHeader, validateJsonData } from './types.ts';

export async function parseData(data: JsonData): Promise<Error[] | null> {
	const errors: Error[] = [];

	if (!validateJsonData(data)) {
		const errorMessage = 'Invalid data format received from remote';
		console.error(errorMessage, data);
		errors.push(new Error(errorMessage));
		return errors;
	}

	const fromRemote: JsonData = JSON.parse(JSON.stringify(data)) as JsonData;
	const batteryNumber: number = fromRemote.batteryNumber;
	const dateString: string = `${fromRemote.header.date.month}-${fromRemote.header.date.day}-${fromRemote.header.date.year}`;
	const timeString: string = `${fromRemote.header.time.hour}-${fromRemote.header.time.minute}-${fromRemote.header.time.second}`;
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
	const lastChangedBatteryData = (
		await get(lastChangedBattery)
	).toJSON() as JsonData | null;

	if (validateJsonData(lastChangedBatteryData)) {
		if (
			lastChangedBatteryData?.header.movingTo.search(/Charger/) !== -1 &&
			lastChangedBatteryData?.header.comingFrom.search(/Robot/) !== -1
		) {
			const list = (
				await get(recentlyUsedList)
			).exportVal() as JsonData[];
			list.reverse();
			list.push(fromRemote);
			list.reverse();
			while (list.length > 10) {
				list.pop();
			}
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
		} else {
			errors.push(
				new Error(
					'Latest battery data does not indicate a charger-to-robot transfer, skipping recently used list update'
				)
			);
		}
	}

	set(headerDb, fromRemote.header)
		.then(() => {
			console.log('Header data pushed successfully to header database');
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
			errors.push(
				new Error('Failed to update latest header data' + error)
			);
		});

	set(fullDataLocation, fromRemote)
		.then(() => {
			console.log('All data pushed successfully');
		})
		.catch((error) => {
			console.error('Error pushing latest data:', error);
			errors.push(
				new Error('Failed to push full data to database' + error)
			);
		});

	set(lastChangedBattery, fromRemote.header)
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
