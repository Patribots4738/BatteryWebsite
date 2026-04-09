import './App.css';
import HubPage from './pages/HubPage';
import SearchPage from './pages/SearchPage';
import RawDataPage from './pages/RawDataPage';

function getPage() {
	switch (window.location.pathname) {
		case '/Hub':
			return <HubPage />;
			break;
		case '/Search':
			return <SearchPage />;
			break;
		case '/Raw_Data':
			return <RawDataPage />;
			break;
		default:
			window.location.pathname = '/Hub';
			return;
	}
}

export default function App() {
	return <div className="App">{getPage()}</div>;
}
