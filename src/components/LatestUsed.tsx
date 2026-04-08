import './LatestUsed.css';
import { type ReactElement, Component } from 'react';
import { getDataFromFirebase } from '@shared/data';
import {
	type JsonData,
	BatteryNames,
	validateJsonData,
	getJsonDataValidationIssues,
	formatValidationIssues
} from '@shared/types';

type LatestUsedState = {
	items: ReactElement[];
};

class LatestUsed extends Component<object, LatestUsedState> {
	state: LatestUsedState = {
		items: [<li key="loading">Loading recent data...</li>]
	};

	formatTwoDigits = (value: number): string => String(value).padStart(2, '0');

	async componentDidMount() {
		const items = await this.formatData();
		this.setState({ items });
	}

	formatData = async (): Promise<ReactElement[]> => {
		const displayArr: ReactElement[] = [];
		const data = await getDataFromFirebase('/latestUsed');

		if (!Array.isArray(data)) {
			return [<li key="no-data">Data possibly broken</li>];
		}

		const validEntries: JsonData[] = [];
		for (const [index, item] of data.entries()) {
			if (validateJsonData(item)) {
				validEntries.push(item);
			} else {
				const issues = getJsonDataValidationIssues(item);
				const errorMessage = formatValidationIssues(issues);
				console.error(
					`Validation failed for item at index ${index}: ${errorMessage}`,
					item
				);
			}
		}

		if (validEntries.length === 0) {
			return [<li key="no-data">No recent data available</li>];
		}

		validEntries.forEach((json, index) => {
			const batteryNum = json.batteryNumber;
			const batteryName = BatteryNames[batteryNum] || 'Unknown Battery';
			const date = `${json.header.date.month}/${json.header.date.day}/${json.header.date.year}`;
			const amOrPm = json.header.time.hour < 12 ? 'AM' : 'PM';
			const twelveHourTime = json.header.time.hour % 12 || 12;
			const time = `${this.formatTwoDigits(twelveHourTime)}:${this.formatTwoDigits(json.header.time.minute)}:${this.formatTwoDigits(json.header.time.second)} ${amOrPm}`;
			const dataArr: string[] = [
				'#B' + batteryNum,
				'Name: ' + batteryName,
				'Date: ' + date,
				'Time: ' + time
			];
			displayArr.push(<li key={index}>{dataArr.join(' | ')}</li>);
		});

		return displayArr;
	};

	render() {
		return (
			<div className="latest-used">
				<h2 className="latest-header">Latest Used</h2>
				<ul className="latest-li">{this.state.items}</ul>
			</div>
		);
	}
}

export default LatestUsed;
