import './index.css';
import { StrictMode } from 'react';
import App from './App';
import { createRoot } from 'react-dom/client';
import { SpeedInsights } from '@vercel/speed-insights/react';

const element: HTMLElement | null = document.getElementById('root');
if (!element) {
	throw new Error('Root element not found');
}

const root = createRoot(element);
root.render(
	<StrictMode>
		<SpeedInsights />
		<App />
	</StrictMode>
);
