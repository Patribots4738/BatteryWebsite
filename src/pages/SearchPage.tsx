import './SearchPage.css';
import { Component } from 'react';
import Navigation from '../components/Navigation';

class SearchPage extends Component {
	render() {
		return (
			<div className="search-container">
				<div>
					<h1>Search</h1>
					<h3>Work in Progress</h3>
				</div>
				<Navigation />
			</div>
		);
	}
}

export default SearchPage;
