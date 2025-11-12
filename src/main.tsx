import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import '@/i18n/i18n';
import App from './App';
import './index.css';
import './styles/global.css'
import { AuthProvider } from './auth/AuthContext';
import { BrowserRouter } from 'react-router-dom';


createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<App/>
			</AuthProvider>
		</BrowserRouter>
	</StrictMode>
);
