import './RawDataDisplay.css';
import { getNumData } from '../PromisedLand';
import { useState, useEffect } from 'react';
import { BatteryNames } from '../../shared/types';
import LoadingData from './LoadingData';

function RawDataDisplay() {
	const [numData, setNumData] = useState<object>({});
	const [loadingState, setLoadingState] = useState<boolean>(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setNumData(await getNumData());
			} catch {
				console.log('error fetching data');
			} finally {
				setLoadingState(false);
			}
		};
		fetchData();
	}, []);

	function formatTime(unFormatted: string) {
		const timeArr = unFormatted.split('-');
		const oldHour = Number(timeArr[0]);
		let newTime;
		let minute = timeArr[1];
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

	function setUpRawTable(
		batteryNum: string,
		batteryName: string,
		datenTime: string,
		from: string,
		to: string,
		charge: string,
		voltage: string,
		resistance: string
	) {
		const dntArr = datenTime.split('_');
		const date = dntArr[0].split('-').join('/');
		const time = formatTime(dntArr[1]);
		const location = 'From ' + from + ' To ' + to;
		return (
			<tr>
				<td className="raw-body">
					B{batteryNum} {batteryName}
				</td>
				<td className="raw-body">{date}</td>
				<td className="raw-body">{time}</td>
				<td className="raw-body">{location}</td>
				<td className="raw-body">{charge} %</td>
				<td className="raw-body">{voltage} V</td>
				<td className="raw-body">{resistance} Ω</td>
			</tr>
		);
	}

	function sortData() {
		const displayArray = [];
		const bNums = Object.keys(numData);
		for (let i = 0; i < bNums.length; i++) {
			const batteryNum = bNums[i];
			const batteryName = BatteryNames[Number(batteryNum)];
			const headerArr = Object.values(numData)[i].headers as object;
			const bDates = Object.keys(headerArr);
			for (let z = 0; z < bDates.length; z++) {
				const date = bDates[z];
				const dateArr = Object.values(headerArr)[z];
				const charge: string = Number(dateArr.charge).toFixed(1);
				const voltage: string = Number(dateArr.initialVoltage).toFixed(
					3
				) as string;
				const intRes: string = Number(
					dateArr.internalResistance
				).toFixed(3);
				const from: string = dateArr.comingFrom;
				const to: string = dateArr.movingTo;
				displayArray.push(
					setUpRawTable(
						batteryNum,
						batteryName,
						date,
						from,
						to,
						charge,
						voltage,
						intRes
					)
				);
			}
		}
		return displayArray;
	}

	if (loadingState) {
		return (
			<div className="raw-bin">
				<div className="table-box">
					<table className="raw-table">
						<thead>
							<tr>
								<th className="raw-header">Battery</th>
								<th className="raw-header">Date</th>
								<th className="raw-header">Time</th>
								<th className="raw-header">Location</th>
								<th className="raw-header">Charge %</th>
								<th className="raw-header">Voltage</th>
								<th className="raw-header">Resistance</th>
							</tr>
						</thead>
					</table>
					<LoadingData />
				</div>
			</div>
		);
	}

	return (
		<div className="raw-bin">
			<div className="table-box">
				<table className="raw-table">
					<thead>
						<tr>
							<th className="raw-header">Battery</th>
							<th className="raw-header">Date</th>
							<th className="raw-header">Time</th>
							<th className="raw-header">Location</th>
							<th className="raw-header">Charge %</th>
							<th className="raw-header">Voltage</th>
							<th className="raw-header">Resistance</th>
						</tr>
					</thead>
					<tbody>{sortData()}</tbody>
				</table>
			</div>
		</div>
	);
}

export default RawDataDisplay;
