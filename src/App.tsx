import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppRouter from '@/components/AppRouter';
import './App.css';

export default function App() {
	return (
		<div style={{display: 'flex', flexDirection: 'column', minHeight: '100dvh'}}>
			<Header/>
			<main className="container" style={{flex: 1}}>
				<AppRouter/>
			</main>
			<Footer/>
		</div>
	);
}
