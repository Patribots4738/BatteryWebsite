import './Navigation.css';
import { Component } from 'react';

class Navigation extends Component {
	naviBtns = () => {
		const locationArr = [
			this.hubBtn(),
			this.searchBtn(),
			this.rawDataBtn()
		];
		switch (localStorage.getItem('currentPage')) {
			case 'hub':
				locationArr.splice(0, 1);
				break;
			case 'search':
				locationArr.splice(1, 1);
				break;
			case 'rawData':
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
				onClick={() => {
					localStorage.setItem('currentPage', 'search');
					window.location.reload();
				}}
			>
				Search 🔍︎
			</button>
		);
	};

	rawDataBtn = () => {
		return (
			<button
				className="rawdata"
				onClick={() => {
					localStorage.setItem('currentPage', 'rawData');
					window.location.reload();
				}}
			>
				Raw Data 📊
			</button>
		);
	};

	hubBtn = () => {
		return (
			<button
				className="hub"
				onClick={() => {
					localStorage.setItem('currentPage', 'hub');
					window.location.reload();
				}}
			>
				Hub 🏠︎
			</button>
		);
	};

	render() {
		return (
			<div className="navi-bin">
				<h2 className="navi-header"> Navigation </h2>
				<div className="navi-box">{this.naviBtns()}</div>
			</div>
		);
	}
}

export default Navigation;
