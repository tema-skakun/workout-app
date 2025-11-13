import {useAuth} from '@/auth/AuthContext';
import {useTranslation} from 'react-i18next';
import Navbar from './Navbar';

export default function Header() {
	const {t} = useTranslation();
	const {user, logout} = useAuth();
	return (
		<header style={{borderBottom: '4px solid #0a4a94'}}>
			<h3 style={{margin: 0, color: 'black'}}>{t('appTitle')}</h3>
			{user ? (
				<>
					<Navbar/>
					<button
						className="btn"
						onClick={logout}
						style={{marginLeft: 'auto'}}
					>
						{t('nav.logout')}
					</button>
				</>
			) : null}
		</header>
	);
}
