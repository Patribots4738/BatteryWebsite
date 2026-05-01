import {
	type Header,
	type JsonData,
	type TruncatedJsonData
} from '../shared/types.ts';

export type DatabaseStructure = {
	allData: {
		[batteryNumber: string]: {
			[dateTimeString: string]: JsonData;
		};
	};
	latest: TruncatedJsonData;
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
		batteryNumber: 0,
		header: {
			date: { year: 0, month: 0, day: 0 },
			time: { hour: 0, minute: 0, second: 0 },
			movingTo: '',
			comingFrom: '',
			initialVoltage: 0,
			charge: 0,
			internalResistance: 0
		}
	},
	num: {},
	recentlyUsed: [],
	checkedOut: []
};

export type UserDatabaseStructure = {
	[userId: string]: number;
};
