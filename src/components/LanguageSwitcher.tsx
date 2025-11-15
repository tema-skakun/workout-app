import {useState, useRef, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useAuth} from '@/auth/AuthContext';
import * as userRepo from '@/repositories/userRepo';

const languages = [
	{code: 'ru', name: 'Русский', flag: '🇷🇺'},
	{code: 'en', name: 'English', flag: '🇺🇸'}
];

export default function LanguageSwitcher() {
	const {i18n, t} = useTranslation();
	const {user} = useAuth();
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Закрытие dropdown при клике вне компонента
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

	const changeLanguage = async (languageCode: string) => {
		await i18n.changeLanguage(languageCode);

		// Сохраняем язык в базу данных, если пользователь авторизован
		if (user) {
			await userRepo.updateUser(user.id, {language: languageCode});
		}

		setIsOpen(false);
	};

	// if (!user) return null; // Показываем только авторизованным пользователям

	return (
		<div ref={dropdownRef} style={{position: 'relative'}}>
			<button
				className="btn"
				onClick={() => setIsOpen(!isOpen)}
				style={{display: 'flex', alignItems: 'center', gap: '8px'}}
			>
				<span style={{fontSize: '18px'}}>{currentLanguage.flag}</span>
				<span style={{fontSize: '12px'}}>▼</span>
			</button>

			{isOpen && (
				<div style={{
					position: 'absolute',
					top: '100%',
					right: 0,
					marginTop: '8px',
					background: 'var(--surface)',
					borderRadius: 'var(--border-radius)',
					boxShadow: 'var(--shadow)',
					padding: '8px',
					zIndex: 1000,
					width: '60px'
				}}>
					{languages.map((language) => (
						<button
							key={language.code}
							className="btn"
							onClick={() => changeLanguage(language.code)}
							style={{
								width: '100%',
								justifyContent: 'flex-start',
								marginBottom: '4px',
								background: i18n.language === language.code ? 'var(--primary)' : 'transparent',
								color: i18n.language === language.code ? 'white' : 'var(--text)'
							}}
						>
							<span style={{fontSize: '18px', marginRight: '8px'}}>
								{language.flag}
							</span>
						</button>
					))}
				</div>
			)}
		</div>
	);
}
