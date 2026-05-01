import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	const clientEnv = {
		API_DOMAIN: env.API_DOMAIN,
		AUTH_DOMAIN: env.AUTH_DOMAIN
	};

	return {
		plugins: [react({})],
		define: {
			'process.env': clientEnv
		},
		server: {
			host: true,
			hmr: {
				protocol: 'ws',
				host: 'localhost'
			}
		}
	};
});
