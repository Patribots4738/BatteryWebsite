import './CurrentlyUsed.css';
import { getCurrentlyUsed } from '../functions/PromisedLand.tsx';
import { useEffect, useState } from 'react';
import { type Header, type TruncatedJsonData } from '../../shared/types';
import LoadingData from './LoadingData';
import { formatTime } from '../functions/DataOrganization.tsx';

function CurrentlyUsed() {
	const [currentData, setCurrentData] = useState<TruncatedJsonData>(
		{} as TruncatedJsonData
	);
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

	function formatGridElement(
		date: string,
		time: string,
		from: string,
		to: string,
		charge: string,
		voltage: string,
		intRes: string
	) {
		return (
			<div className="current-grid">
				<h4 className="identification">Battery:</h4>
				<h4 className="dateAndTime">
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

	function createGrid() {
		let header: Header;
		try {
			header = currentData.header;
		} catch (error) {
			console.error(error);
			return formatGridElement(
				'00/0/0000',
				'00:00:00',
				'null',
				'null',
				'0',
				'0',
				'0'
			);
		}

		const formattedDate = `${header.date.month}/${header.date.day}/${header.date.year}`;
		const time = formatTime(header.time);

		const charge = Number(header.charge).toFixed() as string;
		const voltage = Number(header.initialVoltage).toFixed(3) as string;
		const resistance = Number(header.internalResistance).toFixed(
			3
		) as string;

		return formatGridElement(
			formattedDate,
			time,
			header.comingFrom,
			header.movingTo,
			charge,
			voltage,
			resistance
		);
	}

	if (loadingState) {
		return (
			<div className="current-bin">
				<h2 className="current-header">Currently in Use</h2>
				<div className="battery-widget">
					<LoadingData />
				</div>
			</div>
		);
	}

	return (
		<div className="current-bin">
			<h2 className="current-header">Currently in Use</h2>
			<div className="battery-widget">{createGrid()}</div>
		</div>
	);
}

export default CurrentlyUsed;
