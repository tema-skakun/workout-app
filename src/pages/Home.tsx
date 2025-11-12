import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';


export default function Home() {
	const {t} = useTranslation();
	return (
		<div style={{display: 'grid', placeItems: 'center', height: 'calc(100vh - 160px)'}}>
			<div style={{textAlign: 'center'}}>
				<h1>{t('home.welcome')}</h1>
				<div style={{display: 'flex', gap: 8, justifyContent: 'center'}}>
					<Link to="/login" className="btn">{t('home.ctaLogin')}</Link>
					<Link to="/register" className="btn">{t('home.ctaRegister')}</Link>
				</div>
			</div>
		</div>
	);
}
