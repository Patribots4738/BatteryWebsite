import './LatestUsed.css';
import { Component, type ReactElement } from 'react';
// import { getDataFromFirebase } from '../../api/data.ts';

class LatestUsed extends Component {
	formatData = (): ReactElement[] => {
		const displayArr: ReactElement[] = [];
		for (let i = 0; i < 5; i++) {
			const batteryNum = 'B17';
			const batteryName = 'Dexter';
			const date = '200 B.C.E.';
			const time = '0 - 7 - 20';
			const dataArr: string[] = [
				'#: ' + batteryNum,
				'Name: ' + batteryName,
				'Date: ' + date,
				'Time: ' + time
			];
			displayArr.push(<li key={i}>{dataArr.join(' | ')}</li>);
		}
		return displayArr;
	};

	render() {
		return (
			<div className="latest-used">
				<h2 className="latest-header">Latest Used</h2>
				<ul>{this.formatData()}</ul>
			</div>
		);
	}
}

export default LatestUsed;
