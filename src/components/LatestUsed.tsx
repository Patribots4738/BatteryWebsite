import './LatestUsed.css';
import { type ReactElement, Component } from 'react';
import { getDataFromFirebase } from '../../api/data.ts';
import {
	type JsonData,
	BatteryNames,
	validateJsonData,
	validateHeader
} from '../../api/types.ts';

class LatestUsed extends Component {
	formatData = async (): Promise<ReactElement[]> => {
		const displayArr: ReactElement[] = [];
		const data = await getDataFromFirebase('/recentlyUsed/');
		if (
			data &&
			typeof data === 'object' &&
			Array.isArray(data) &&
			data.every((item) => validateJsonData(item))
		) {
			const headers = data as JsonData[];
			if (
				headers.length === 0 ||
				headers.every(
					(header) =>
						!header ||
						typeof header !== 'object' ||
						validateHeader(header)
				)
			) {
				return [<li key="no-data">No recent data available</li>];
			}
			headers.forEach((json, index) => {
				const batteryNum = json.batteryNumber;
				const batteryName =
					BatteryNames[batteryNum] || 'Unknown Battery';
				const date = `${json.header.date.month}/${json.header.date.day}/${json.header.date.year}`;
				const time = `${json.header.time.hour}:${json.header.time.minute}:${json.header.time.second}`;
				const dataArr: string[] = [
					'#: ' + batteryNum,
					'Name: ' + batteryName,
					'Date: ' + date,
					'Time: ' + time
				];
				displayArr.push(<li key={index}>{dataArr.join(' | ')}</li>);
			});
			return displayArr;
		} else {
			return [<li key="no-data">No recent data available</li>];
		}
	};

	render() {
		return (
			<div className="latest-used">
				<h2 className="latest-header">Latest Used</h2>
				<ul className="latest-li">{this.formatData()}</ul>
			</div>
		);
	}
}

export default LatestUsed;
