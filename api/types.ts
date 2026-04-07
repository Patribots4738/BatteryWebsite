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