import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import '@/i18n/i18n';
import App from './App';
import './index.css';
import './styles/global.css'
import { AuthProvider } from './auth/AuthContext';
import { BrowserRouter } from 'react-router-dom';

const basename = import.meta.env.BASE_URL || '/';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter basename={basename}>
			<AuthProvider>
				<App/>
			</AuthProvider>
		</BrowserRouter>
	</StrictMode>
);
