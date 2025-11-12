import {useState} from 'react';
import ExerciseInputs from '@/components/ExerciseInputs';
import TimeInput from '@/components/TimeInput';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import { useAuth } from '@/auth/AuthContext';
import * as repo from '@/repositories/workoutsRepo';


export default function CreateWorkout() {
	const {t} = useTranslation();
	const {user} = useAuth();
	const nav = useNavigate();
	const [error, setError] = useState('');
	const [form, setForm] = useState({
		name: '',
		exercises: [{name: ''}],
		warmupTime: 5,
		exerciseTime: 5,
		restTime: 5,
		rounds: 1,
		restBetweenRounds: 5
	});


	const setField = (name: string, value: number | string) => setForm(p => ({...p, [name]: value}));
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {name, value} = e.target;
		setField(name, name === 'rounds' || name.includes('Time') ? Number(value) : value);
	};


	const handleExerciseChange = (i: number, value: string) => {
		const copy = form.exercises.slice();
		copy[i].name = value;
		setForm(p => ({...p, exercises: copy}));
	};


	const addExercise = () => setForm(p => ({...p, exercises: [...p.exercises, {name: ''}]}));


	const validate = () => {
		if (!form.name) {
			setError(t('workouts.errors.name')!);
			return false;
		}
		for (const ex of form.exercises) {
			if (!ex.name) {
				setError(t('workouts.errors.exercise')!);
				return false;
			}
		}
		const minOK = form.warmupTime >= 5 && form.exerciseTime >= 5 && form.restTime >= 5 && form.restBetweenRounds >= 5 && form.rounds >= 1;
		if (!minOK) {
			setError(t('workouts.errors.form')!);
			return false;
		}
		setError('');
		return true;
	};


	const onCreate = async () => {
		if (!user) return;
		if (!validate()) return;
		const id = await repo.create({...form, userId: user.id});
		nav(`/train-workout/${id}`);
	};


	return (
		<div>
			<h2>{t('workouts.create')}</h2>
			{error && <p style={{color: 'red'}}>{error}</p>}
			<input className="input" name="name" value={form.name} onChange={handleChange} placeholder={t('workouts.name')!}/>
			<TimeInput labelKey="fields.warmupTime" name="warmupTime" value={form.warmupTime} min={5}
								 onChange={handleChange}/>
			<TimeInput labelKey="fields.exerciseTime" name="exerciseTime" value={form.exerciseTime} min={5}
								 onChange={handleChange}/>
			<TimeInput labelKey="fields.restTime" name="restTime" value={form.restTime} min={5} onChange={handleChange}/>
			<TimeInput labelKey="fields.rounds" name="rounds" value={form.rounds} min={1} onChange={handleChange}/>
			<TimeInput labelKey="fields.restBetweenRounds" name="restBetweenRounds" value={form.restBetweenRounds} min={5}
								 onChange={handleChange}/>
			<ExerciseInputs exercises={form.exercises} onChange={handleExerciseChange} onAdd={addExercise}/>
			<button className="btn" onClick={onCreate}>{t('workouts.createBtn')}</button>
		</div>
	);
}
