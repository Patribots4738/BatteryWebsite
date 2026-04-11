import './LatestUsed.css';
import { useState, useEffect } from 'react';
import { getLatestUsed } from '../PromisedLand';
import { type JsonData, BatteryNames } from '../../shared/types';

function LatestUsed() {
	const [latestData, setLatestData] = useState<JsonData[]>([]);
	const [loadingState, setLoadingState] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLatestData(await getLatestUsed());
			} catch {
				console.log('error fetching data');
			} finally {
				setLoadingState(false);
			}
		};
		fetchData();
	}, []);

	function setUpTable(
		batteryNum: string,
		batteryName: string,
		from: string,
		to: string,
		intRes: string
	) {
		const newRow = (
			<tr>
				<td className="latestTable">{batteryNum}</td>
				<td className="latestTable">{batteryName}</td>
				<td className="latestTable">{from}</td>
				<td className="latestTable">{to}</td>
				<td className="latestTable">{intRes}</td>
			</tr>
		);
		return newRow;
	}

	function fixArray() {
		const superDuperCoolList = [
			<tr>
				<th className="latestTable">B#</th>
				<th className="latestTable">Name</th>
				<th className="latestTable">From</th>
				<th className="latestTable">To</th>
				<th className="latestTable">Ω</th>
			</tr>
		];
		for (const data in latestData) {
			const headerData = latestData[data].header;
			const batteryNum = JSON.stringify(latestData[data].batteryNumber);
			const batteryName = BatteryNames[latestData[data].batteryNumber];
			const whereFrom = headerData.comingFrom;
			const whereGo = headerData.movingTo;
			const intRes = JSON.stringify(headerData.internalResistance);
			const newRow = setUpTable(
				batteryNum,
				batteryName,
				whereFrom,
				whereGo,
				intRes
			);
			superDuperCoolList.push(newRow);
		}
		return superDuperCoolList;
	}

	if (loadingState) {
		return (
			<div className="latest-bin">
				<h2 className="latest-header">Latest Used</h2>
				<div className="latest-box">
					<div>Loading...</div>
				</div>
			</div>
		);
	}

	return (
		<div className="latest-bin">
			<h2 className="latest-header">Latest Used</h2>
			<div className="latest-box">
				<table className="latest-li">{fixArray()}</table>
			</div>
		</div>
	);
}

export default LatestUsed;
