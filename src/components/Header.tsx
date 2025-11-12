import Navbar from './Navbar';
import {useAuth} from '@/auth/AuthContext';
import {useTranslation} from 'react-i18next';


export default function Header() {
	const {t} = useTranslation();
	const {user, logout} = useAuth();
	return (
		<header>
			<h3 style={{margin: 0}}>{t('appTitle')}</h3>
			<div style={{marginLeft: 'auto'}}>
				{user ? (
					<>
						<Navbar/>
						<button className="btn" onClick={logout}>{t('nav.logout')}</button>
					</>
				) : null}
			</div>
		</header>
	);
}
