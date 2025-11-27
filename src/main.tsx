import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import '@/i18n/i18n';
import App from './App';
import './index.css';
import './styles/global.css';
import {AuthProvider} from './auth/AuthContext';
import {BrowserRouter} from 'react-router-dom';

const basename = import.meta.env.PROD ? '/workout-app' : '/';

// Регистрируем SW только в production и только если модуль доступен
if (import.meta.env.PROD) {
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
		<BrowserRouter basename={basename}>
			<AuthProvider>
				<App/>
			</AuthProvider>
		</BrowserRouter>
	</StrictMode>,
);
