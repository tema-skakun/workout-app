import {useTranslation} from "react-i18next";

export default function Footer() {
	const {t} = useTranslation();
	return (
		<footer style={{margin: 0, color: 'black', borderTop: '4px solid #0a4a94'}}>
			<p>© {new Date().getFullYear()} {t('appTitle')}</p>
		</footer>
	);
}
