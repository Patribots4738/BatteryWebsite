import './CurrentlyUsed.css';
import { useEffect, useState } from 'react';
import { type TruncatedJsonData } from '../../shared/types';
import LoadingData from './LoadingData';
import { formatTime } from '../functions/DataOrganization.tsx';
import { useSocket } from '../context/SocketContext.tsx';
import type { JSX } from 'react/jsx-runtime';
import { useSessionContext } from 'supertokens-auth-react/recipe/session';

function CheckedOut() {
	const [currentData, setCurrentData] = useState<TruncatedJsonData[]>([]);
	const [loadingState, setLoadingState] = useState(true);

	const session = useSessionContext();
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
				setCurrentData(await socket.emitWithAck('checkedOut', userId));
			} catch {
				console.log('error fetching data');
			} finally {
				setLoadingState(false);
			}
		};

		fetchData().then(() => console.log('Data successfully loaded!'));
	}, [socket, session]);

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
			<div className="checked-out-grid">
				<h4 className="identification">Battery:</h4>
				<h4 className="dateAndTime">
					Date: {date} | Time: {time}
				</h4>
				<h4 className="current-location">
					From: {from} To: {to}
				</h4>
				<table className="checked-out-table">
					<thead className="checked-out-table-header">
						<tr>
							<th>%</th>
							<th>V0</th>
							<th>Ω</th>
						</tr>
					</thead>
					<tbody className="checked-out-table-body">
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
		let grid: JSX.Element[] = [];
		for (let i = 0; i < currentData.length; i++) {
			const header = currentData[i].header;

			const formattedDate = `${header.date.month}/${header.date.day}/${header.date.year}`;
			const time = formatTime(header.time);

			const charge = Number(header.charge).toFixed() as string;
			const voltage = Number(header.initialVoltage).toFixed(3) as string;
			const resistance = Number(header.internalResistance).toFixed(
				3
			) as string;

			const newElement = formatGridElement(
				formattedDate,
				time,
				header.comingFrom,
				header.movingTo,
				charge,
				voltage,
				resistance
			);

			if (i === 0) {
				grid = [newElement];
			} else {
				grid.push(newElement);
			}
		}

		return grid;
	}

	if (loadingState) {
		return (
			<div className="checked-out-bin">
				<h2 className="checked-out-header">Currently in Use</h2>
				<div className="battery-widget">
					<LoadingData />
				</div>
			</div>
		);
	}

	return (
		<div className="checked-out-bin">
			<h2 className="checked-out-header">Currently in Use</h2>
			<div className="battery-widget">{createGrid()}</div>
		</div>
	);
}

export default CheckedOut;
