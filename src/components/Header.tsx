import {useAuth} from '@/auth/AuthContext';
import {useTranslation} from 'react-i18next';
import Navbar from './Navbar';
import LanguageSwitcher from "./LanguageSwitcher";
import {useLocation, useNavigate} from 'react-router-dom';
import {APP_CONFIG} from "@/constants/app";

const Header = () => {
	const {t} = useTranslation();
	const navigate = useNavigate();
	const {user, logout} = useAuth();
	const location = useLocation();

	// Проверяем, находимся ли на странице тренировки
	const isTrainWorkoutPage = location.pathname.includes('/train-workout');

	return (
		<header style={{
			borderBottom: '1px solid #0a4a94',
			width: '100dvw'
		}}>
			<h3 className="app-title">{t('appTitle')}</h3>
			{user ? (
				<>
					<Navbar/>
					{/* Скрываем кнопку выхода только на странице тренировки */}
					{!isTrainWorkoutPage && (
						<button
							className="btn"
							onClick={() => {
								logout();
								navigate(APP_CONFIG.HOME_PATH);
							}}
							style={{marginLeft: 'auto'}}
						>
							{t('nav.logout')}
						</button>
					)}
				</>
			) : null}
			<LanguageSwitcher/>
		</header>
	);
}

export default Header;
