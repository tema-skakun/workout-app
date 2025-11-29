import {Route, Routes, Navigate} from 'react-router-dom';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Workouts from '@/pages/Workouts';
import EditWorkout from '@/pages/EditWorkout';
import TrainWorkout from '@/pages/TrainWorkout';
import CreateWorkout from '@/pages/CreateWorkout';
import {useAuth} from '@/auth/AuthContext';
import {ReactNode} from 'react';

const basename = import.meta.env.PROD ? '/' : '/workout-app/';

function PrivateRoute({children}: { children: ReactNode }) {
	const {user} = useAuth();
	if (!user) return <Navigate to="/login" replace/>;
	return <>{children}</>;
}

function PublicRoute({children}: { children: ReactNode }) {
	const {user} = useAuth();
	if (user) return <Navigate to="/workouts" replace/>;
	return <>{children}</>;
}

export default function AppRouter() {
	const {user} = useAuth();

	return (
		<Routes>
			<Route path={basename} element={
				user ? <Navigate to="/workouts" replace/> : <Home/>
			}/>
			<Route path="/login" element={
				<PublicRoute>
					<Login/>
				</PublicRoute>
			}/>
			<Route path="/register" element={
				<PublicRoute>
					<Register/>
				</PublicRoute>
			}/>
			<Route path="/workouts" element={
				<PrivateRoute>
					<Workouts/>
				</PrivateRoute>
			}/>
			<Route path="/create-workout" element={
				<PrivateRoute>
					<CreateWorkout/>
				</PrivateRoute>
			}/>
			<Route path="/edit-workout/:id" element={
				<PrivateRoute>
					<EditWorkout/>
				</PrivateRoute>
			}/>
			<Route path="/train-workout/:id" element={
				<PrivateRoute>
					<TrainWorkout/>
				</PrivateRoute>
			}/>
		</Routes>
	);
}
