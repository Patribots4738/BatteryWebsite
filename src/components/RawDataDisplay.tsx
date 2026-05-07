import './RawDataDisplay.css';
import { useEffect, useState } from 'react';
import {
	BatteryNames,
	type Date,
	type NumDirectory,
	type Time
} from '../../shared/types';
import LoadingData from './LoadingData';
import { formatTime } from '../functions/DataOrganization.tsx';
import { useSocket } from '../context/SocketContext.tsx';
import { DevSessionContext } from '../context/DevSessionContext';

function RawDataDisplay() {
	const [numData, setNumData] = useState<NumDirectory>({});
	const [loadingState, setLoadingState] = useState<boolean>(true);

	const session = DevSessionContext();
	const socket = useSocket();

	useEffect(() => {
		const fetchData = async () => {
			if (session.loading) return;

			const userId = session.userId;

			if (!userId) {
				setLoadingState(false);
				return;
			}

			try {
				setNumData(await socket.emitWithAck('num', userId));
			} catch {
				console.log('error fetching data');
			} finally {
				setLoadingState(false);
			}
		};

		fetchData().then(() => console.log('Data successfully loaded!'));
	}, [socket, session.userId, session.loading]);

	function createNewTableEntry(
		batteryNum: string,
		batteryName: string,
		date: Date,
		time: Time,
		from: string,
		to: string,
		charge: string,
		voltage: string,
		resistance: string
	) {
		const formattedDate = `${date.month}/${date.day}/${date.year}`;
		const formattedTime = formatTime(time);
		const location = 'From ' + from + ' To ' + to;
		return (
			<tr>
				<td className="raw-body">
					B{batteryNum} {batteryName}
				</td>
				<td className="raw-body">{formattedDate}</td>
				<td className="raw-body">{formattedTime}</td>
				<td className="raw-body">{location}</td>
				<td className="raw-body">{charge} %</td>
				<td className="raw-body">{voltage} V</td>
				<td className="raw-body">{resistance} Ω</td>
			</tr>
		);
	}

	function sortData() {
		const displayArray = [];

		let batteries: string[];

		try {
			batteries = Object.keys(numData);
		} catch (error) {
			console.error(error);
			return [<div></div>];
		}

		for (const batteryNumber in batteries) {
			const batteryName = BatteryNames[Number(batteryNumber)];
			const headers = numData[batteryNumber].headers;
			const timestamps = Object.keys(headers);

			for (const timestamp in timestamps) {
				const header = headers[timestamp];

				const charge = Number(header.charge).toFixed() as string;
				const voltage = Number(header.initialVoltage).toFixed(
					3
				) as string;
				const resistance = Number(header.internalResistance).toFixed(
					3
				) as string;

				displayArray.push(
					createNewTableEntry(
						batteryNumber,
						batteryName,
						header.date,
						header.time,
						header.comingFrom,
						header.movingTo,
						charge,
						voltage,
						resistance
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
