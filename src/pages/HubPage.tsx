import './HubPage.css';
import { Component } from 'react';
import LatestUsed from '../components/LatestUsed';

class HubPage extends Component {
	render() {
		return (
			<div className="hub-container">
				<div>Nav Box</div>
				<div>Battery Chart</div>
				<div>Currently Checked Out</div>
				<div>Blast Charger</div>
				<LatestUsed />
			</div>
		);
	}
}

export default HubPage;
