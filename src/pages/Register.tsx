import {FormEvent, useState} from 'react';
import {useAuth} from '@/auth/AuthContext';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {Arrow} from '@/svg/arrow';

// const basename = import.meta.env.BASE_URL ? '/workout-app/' : '/';
const basename = import.meta.env.PROD ? '/' : '/workout-app/';

export default function Register() {
	const {t} = useTranslation();
	const {register} = useAuth();
	const nav = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const onSubmit = async (e: FormEvent) => {
		e.preventDefault();
		const res = await register(email, password);
		if (!res.ok) {
			setError(t('auth.failedRegister')!);
			return;
		}
		nav('/login');
	};

	return (
		<div style={{maxWidth: 360, margin: '0 auto'}}>
			<button
				className="btn secondary"
				onClick={() => nav(basename)}
				style={{marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8}}
			>
				<Arrow/>
			</button>
			<form onSubmit={onSubmit}>
				<h2>{t('nav.register')}</h2>
				{error && <p style={{color: 'red'}}>{error}</p>}
				<div style={{display: 'grid', gap: 8}}>
					<input className="input" type="email" placeholder={t('auth.email')!} value={email}
								 onChange={e => setEmail(e.target.value)} required/>
					<input className="input" type="password" placeholder={t('auth.password')!} value={password}
								 onChange={e => setPassword(e.target.value)} required/>
					<button className="btn" type="submit">{t('auth.register')}</button>
				</div>
			</form>
		</div>
	);
}
