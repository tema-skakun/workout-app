import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';


export default function Navbar() {
	const {t} = useTranslation();
	return (
		<nav>
			<Link to="/workouts" className="btn">{t('nav.workouts')}</Link>
			<Link to="/create-workout" className="btn">{t('nav.create')}</Link>
		</nav>
	);
}
