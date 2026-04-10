import './RawDataPage.css';
import { Component } from 'react';
import Navigation from '../components/Navigation';

class RawDataPage extends Component {
	render() {
		return (
			<div className="rawdata-container">
				<div>
					<h1>Raw Data</h1>
					<h3>Work in Progress</h3>
				</div>
				<Navigation />
			</div>
		);
	}
}

export default RawDataPage;
