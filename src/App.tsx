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
import './App.css';


function PrivateRoute({children}: { children: Element }) {
	const {user} = useAuth();
	if (!user) return <Navigate to="/login" replace/>;
	return children;
}


export default function App() {
	return (
		<>
			<Header/>
			<main className="container">
				<Routes>
					<Route path="/" element={<Home/>}/>
					<Route path="/login" element={<Login/>}/>
					<Route path="/register" element={<Register/>}/>


					<Route path="/workouts" element={<PrivateRoute><Workouts/></PrivateRoute>}/>
					<Route path="/create-workout" element={<PrivateRoute><CreateWorkout/></PrivateRoute>}/>
					<Route path="/edit-workout/:id" element={<PrivateRoute><EditWorkout/></PrivateRoute>}/>
					<Route path="/train-workout/:id" element={<PrivateRoute><TrainWorkout/></PrivateRoute>}/>
				</Routes>
			</main>
			<Footer/>
		</>
	);
}
