import {useTranslation} from "react-i18next";

const Footer = () => {
	const {t} = useTranslation();
	return (
		<footer className="footer">
			<p>© {new Date().getFullYear()} {t('appTitle')}</p>
		</footer>
	);
}

export default Footer
