import {useAuth} from "@/auth/AuthContext";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import {Workout} from "@/svg/workout";

export default function Home() {
	const {t} = useTranslation();
	const {user} = useAuth();

	return (
		<div style={{
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			height: '100%',
			minHeight: 'calc(100dvh - 63px)'
		}}>
			<div style={{textAlign: 'center'}}>
				<h1>{t('home.welcome')}</h1>
				<Workout width={200} height={200}/>
				{!user &&
            <div style={{display: 'flex', gap: 8, justifyContent: 'center'}}>
                <Link to="/login" className="btn">{t('home.ctaLogin')}</Link>
                <Link to="/register" className="btn">{t('home.ctaRegister')}</Link>
            </div>}
			</div>
		</div>
	);
}
