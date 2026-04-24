import './CurrentlyUsed.css';
import { getCurrentlyUsed } from '../PromisedLand';
import { useState, useEffect } from 'react';
import { type Header } from '../../shared/types';
import LoadingData from './LoadingData';

function CurrentlyUsed() {
	const [currentData, setCurrentData] = useState<Header>({} as Header);
	const [loadingState, setLoadingState] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setCurrentData(await getCurrentlyUsed(window.location.host));
			} catch {
				console.log('error fetching data');
			} finally {
				setLoadingState(false);
			}
		};
		fetchData().then(() => console.log('Data successfully loaded!'));
	}, []);

	function formatTime(timeArr: number[]) {
		const oldHour = Number(timeArr[0]);
		let newTime;
		let minute = timeArr[1].toString();
		if (minute.length === 1) {
			minute = '0' + minute;
		}
		let formatted;
		if (Math.sign(oldHour - 12) === -1) {
			newTime = [oldHour, minute];
			formatted = newTime.join(':') + ' am';
		} else {
			newTime = [oldHour - 12, minute];
			formatted = newTime.join(':') + ' pm';
		}
		return formatted;
	}

	function formatCurrent(
		date: string,
		time: string,
		from: string,
		to: string,
		charge: number,
		voltage: number,
		intRes: number
	) {
		return (
			<div className="current-grid">
				<h4 className="identification">Battery:</h4>
				<h4 className="dateNTime">
					Date: {date} | Time: {time}
				</h4>
				<h4 className="current-location">
					From: {from} To: {to}
				</h4>
				<table className="current-table">
					<thead className="current-table-header">
						<tr>
							<th>%</th>
							<th>V0</th>
							<th>Ω</th>
						</tr>
					</thead>
					<tbody className="current-table-body">
						<tr>
							<td>{charge}</td>
							<td>{voltage}</td>
							<td>{intRes}</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}

	function fixCurrent() {
		const charge = currentData.charge;
		const voltage = currentData.initialVoltage;
		const intRes = currentData.internalResistance;
		const from = currentData.comingFrom;
		const to = currentData.movingTo;
		const date = currentData.date;
		const dateArr = [date.day, date.month, date.year];
		const formatedDate = dateArr.join('/');
		const time = currentData.time;
		const formattedTime = formatTime([time.hour, time.minute]);
		return formatCurrent(
			formatedDate,
			formattedTime,
			from,
			to,
			charge,
			voltage,
			intRes
		);
	}

	if (loadingState) {
		return (
			<div className="current-bin">
				<h2 className="current-header">Currently in Use</h2>
				<div className="battery-widg">
					<LoadingData />
				</div>
			</div>
		);
	}

	return (
		<div className="current-bin">
			<h2 className="current-header">Currently in Use</h2>
			<div className="battery-widg">{fixCurrent()}</div>
		</div>
	);
}

export default CurrentlyUsed;
