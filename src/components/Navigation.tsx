import './Navigation.css';
import { Component } from 'react';

class Navigation extends Component {
	naviBtns = () => {
		const locationArr = [this.hubBtn(), this.searchBtn(), this.rawDataBtn()];
		switch (window.location.pathname) {
			case '/Hub':
				locationArr.splice(0, 1);
				break;
			case '/Search':
				locationArr.splice(1, 1);
				break;
			case '/Raw_Data':
				locationArr.splice(2, 1);
				break;
			default:
				return;
		}
		return locationArr;
	};

	searchBtn = () => {
		return (
			<button
				className="search"
				onClick={() => (window.location.pathname = '/Search')}
			>
				Search
			</button>
		);
	};

	rawDataBtn = () => {
		return (
			<button
				className="rawdata"
				onClick={() => (window.location.pathname = '/Raw_Data')}
			>
				Raw Data
			</button>
		);
	};

	hubBtn = () => {
		return (
			<button
				className="hub"
				onClick={() => (window.location.pathname = '/Hub')}
			>
				Hub
			</button>
		);
	};

	render() {
		return (
			<div className="navi-bin">
				<h2 className="navi-header">Navigation</h2>
				<div className="navi-box">{this.naviBtns()}</div>
			</div>
		);
	}
}

export default Navigation;
