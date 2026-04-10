import './HubPage.css';
import { Component } from 'react';
import LatestUsed from '../components/LatestUsed';
import Navigation from '../components/Navigation';

class HubPage extends Component {
	render() {
		return (
			<div className="hub-container">
				<div className="navi">
					<Navigation />
				</div>
				<div className="battery">Battery Chart Work in Progress</div>
				<div className="current">
					Currently Checked Out Work in Progress
				</div>
				<div className="blast">Blast Charger Work in Progress</div>
				<div className="latest">
					<LatestUsed />
				</div>
			</div>
		);
	}
}

export default HubPage;
