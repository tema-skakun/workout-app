import {FormEvent, useState} from 'react';
import {useAuth} from '@/auth/AuthContext';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {Arrow} from '@/svg/arrow';
import {APP_CONFIG} from "@/constants/app";

const Register = () => {
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

	const handleBack = () => {
		nav(APP_CONFIG.BASENAME);
	};

	return (
		<div style={{maxWidth: 360, margin: '0 auto'}}>
			<div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px'}}>
				<button
					className="btn"
					onClick={handleBack}
					style={{display: 'flex', alignItems: 'center', padding: '8px'}}
				>
					<Arrow/>
				</button>
				<h2 style={{margin: 0, flex: 1, textAlign: 'center'}}>{t('nav.register')}</h2>
			</div>

			<form onSubmit={onSubmit}>
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

export default Register
