import {Route, Routes, Navigate} from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Workouts from '@/pages/Workouts';
import CreateWorkout from '@/pages/CreateWorkout';
import EditWorkout from '@/pages/EditWorkout';
import TrainWorkout from '@/pages/TrainWorkout';
import {useAuth} from '@/auth/AuthContext';
import {ReactNode} from 'react';
import './App.css';

const basename = import.meta.env.BASE_URL ? '/workout-app/' : '/';

function PrivateRoute({children}: { children: ReactNode }) {
	const {user} = useAuth();
	if (!user) return <Navigate to="/login" replace/>;
	return <>{children}</>;
}

export default function App() {
	return (
		<div style={{display: 'flex', flexDirection: 'column', height: 'calc(100dvh - 63px)'}}>
			<Header/>
			<main className="container" style={{flex: 1}}>
				<Routes>
					<Route path={basename} element={<Home/>}/>
					<Route path="/login" element={<Login/>}/>
					<Route path="/register" element={<Register/>}/>

					<Route
						path="/workouts"
						element={
							<PrivateRoute>
								<Workouts/>
							</PrivateRoute>
						}
					/>
					<Route
						path="/create-workout"
						element={
							<PrivateRoute>
								<CreateWorkout/>
							</PrivateRoute>
						}
					/>
					<Route
						path="/edit-workout/:id"
						element={
							<PrivateRoute>
								<EditWorkout/>
							</PrivateRoute>
						}
					/>
					<Route
						path="/train-workout/:id"
						element={
							<PrivateRoute>
								<TrainWorkout/>
							</PrivateRoute>
						}
					/>
				</Routes>
			</main>
			<Footer/>
		</div>
	);
}
