import './RawDataPage.css';
import { Component } from 'react';
import Navigation from '../components/Navigation';
import RawDataDisplay from '../components/RawDataDisplay';

class RawDataPage extends Component {
	render() {
		return (
			<div className="rawdata-container">
				<div className="header-bin">
					<h1 className="page-header">Raw Data</h1>
				</div>
				<div className="navigation">
					<Navigation />
				</div>
				<div className="rawdata-display">
					<RawDataDisplay />
				</div>
			</div>
		);
	}
}

export default RawDataPage;
