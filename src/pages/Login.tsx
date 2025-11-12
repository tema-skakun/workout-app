import {FormEvent, useState} from 'react';
import {useAuth} from '@/auth/AuthContext';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';


export default function Login() {
	const {t} = useTranslation();
	const {login} = useAuth();
	const nav = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');


	const onSubmit = async (e: FormEvent) => {
		e.preventDefault();
		const ok = await login(email, password);
		if (!ok) {
			setError(t('auth.invalid'));
			return;
		}
		nav('/workouts');
	};


	return (
		<form onSubmit={onSubmit} style={{maxWidth: 360}}>
			<h2>{t('nav.login')}</h2>
			{error && <p style={{color: 'red'}}>{error}</p>}
			<div style={{display: 'grid', gap: 8}}>
				<input className="input" type="email" placeholder={t('auth.email')!} value={email}
							 onChange={e => setEmail(e.target.value)} required/>
				<input className="input" type="password" placeholder={t('auth.password')!} value={password}
							 onChange={e => setPassword(e.target.value)} required/>
				<button className="btn" type="submit">{t('auth.login')}</button>
			</div>
		</form>
	);
}
