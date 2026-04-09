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
				<div className="battery">Battery Chart</div>
				<div className="current">Currently Checked Out</div>
				<div className="blast">Blast Charger</div>
				<div className="latest">
					<LatestUsed />
				</div>
			</div>
		);
	}
}

export default HubPage;
