import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import '@/i18n/i18n';
import App from './App';
import './index.css';
import './styles/global.css';
import {AuthProvider} from './auth/AuthContext';
import {BrowserRouter} from 'react-router-dom';
import {APP_CONFIG} from "@/constants/app";

// Регистрируем SW только в production и только если модуль доступен
if (APP_CONFIG.IS_PROD) {
	import('virtual:pwa-register')
		.then(({registerSW}) => {
			registerSW({
				immediate: true,
			});
		})
		.catch((err) => {
			console.warn('PWA register failed, skip:', err);
		});
}

createRoot(document.getElementById('root') as HTMLElement).render(
	<StrictMode>
		<BrowserRouter basename={APP_CONFIG.BASENAME}>
			<AuthProvider>
				<App/>
			</AuthProvider>
		</BrowserRouter>
	</StrictMode>,
);
