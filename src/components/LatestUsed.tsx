import './LatestUsed.css';
import { useEffect, useState } from 'react';
import { getLatestUsed } from '../functions/PromisedLand.tsx';
import { BatteryNames, type JsonData } from '../../shared/types';
import LoadingData from './LoadingData';

function LatestUsed() {
	const [latestData, setLatestData] = useState<JsonData[]>([]);
	const [loadingState, setLoadingState] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLatestData(await getLatestUsed(window.location.host));
			} catch {
				console.log('error fetching data');
			} finally {
				setLoadingState(false);
			}
		};
		fetchData().then(() => console.log('Data successfully loaded!'));
	}, []);

	function setUpTable(
		batteryNum: string,
		batteryName: string,
		from: string,
		to: string,
		intRes: string
	) {
		return (
			<tr>
				<td className="latestTable">B{batteryNum}</td>
				<td className="latestTable">{batteryName}</td>
				<td className="latestTable">{from}</td>
				<td className="latestTable">{to}</td>
				<td className="latestTable">{intRes}</td>
			</tr>
		);
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
					<LoadingData />
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
