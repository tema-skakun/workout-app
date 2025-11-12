import {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import * as repo from '@/repositories/workoutsRepo';
import ExerciseInputs from '@/components/ExerciseInputs';
import TimeInput from '@/components/TimeInput';
import {useTranslation} from 'react-i18next';


export default function EditWorkout() {
	const {t} = useTranslation();
	const {id} = useParams();
	const nav = useNavigate();
	const [error, setError] = useState('');
	const [form, setForm] = useState<any>(null);


	useEffect(() => {
		if (!id) return;
		repo.getById(id).then(data => {
			if (!data) {
				setError('Not found');
				return;
			}
			const {name, exercises, warmupTime, exerciseTime, restTime, rounds, restBetweenRounds} = data;
			setForm({name, exercises, warmupTime, exerciseTime, restTime, rounds, restBetweenRounds});
		});
	}, [id]);


	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {name, value} = e.target;
		setForm((p: any) => ({...p, [name]: name === 'rounds' || name.includes('Time') ? Number(value) : value}));
	};


	const handleExerciseChange = (i: number, value: string) => {
		const copy = form.exercises.slice();
		copy[i].name = value;
		setForm((p: any) => ({...p, exercises: copy}));
	};


	const addExercise = () => setForm((p: any) => ({...p, exercises: [...p.exercises, {name: ''}]}));


	const onSave = async () => {
		if (!id) return;
		if (!form.name) {
			setError(t('workouts.errors.name')!);
			return;
		}
		for (const ex of form.exercises) {
			if (!ex.name) {
				setError(t('workouts.errors.exercise')!);
				return;
			}
		}
		await repo.update(id, form);
		nav('/workouts');
	};


	if (!form) return <p>Loading...</p>;


	return (
		<div>
			<h2>{t('workouts.edit')}</h2>
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
			<button className="btn" onClick={onSave}>{t('workouts.save')}</button>
		</div>
	);
}
