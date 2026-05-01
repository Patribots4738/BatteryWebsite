import './Navigation.css';
import { Component } from 'react';

class Navigation extends Component {
	navigationButtons = () => {
		const locationArr = [this.hubButton(), this.rawDataButton()];
		switch (localStorage.getItem('currentPage')) {
			case 'hub':
				locationArr.splice(0, 1);
				break;
			case 'rawData':
				locationArr.splice(1, 1);
				break;
			default:
				return;
		}
		return locationArr;
	};

	rawDataButton = () => {
		return (
			<button
				className="rawData"
				onClick={() => {
					localStorage.setItem('currentPage', 'rawData');
					window.location.reload();
				}}
			>
				Raw Data 📊
			</button>
		);
	};

	hubButton = () => {
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
				<div className="navi-box">{this.navigationButtons()}</div>
			</div>
		);
	}
}

export default Navigation;
