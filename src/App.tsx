import './App.css';
import HubPage from './pages/HubPage';
import SearchPage from './pages/SearchPage';
import RawDataPage from './pages/RawDataPage';

function getPage() {
	switch (localStorage.getItem('currentPage')) {
		case 'hub':
			return <HubPage />;
		case 'search':
			return <SearchPage />;
		case 'rawData':
			return <RawDataPage />;
		default:
			localStorage.setItem('currentPage', 'hub');
			return <HubPage />;
	}
}

export default function App() {
	return <div className="App">{getPage()}</div>;
}
