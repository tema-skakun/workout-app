import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useAuth} from '@/auth/AuthContext';
import * as repo from '@/repositories/workoutsRepo';

const PRESETS = {
	beginner: {warmupTime: 5, exerciseTime: 30, restTime: 15, rounds: 3, restBetweenRounds: 30},
	intermediate: {warmupTime: 5, exerciseTime: 45, restTime: 15, rounds: 4, restBetweenRounds: 45},
	advanced: {warmupTime: 5, exerciseTime: 60, restTime: 15, rounds: 5, restBetweenRounds: 60}
};

export default function QuickCreate() {
	const {t} = useTranslation();
	const {user} = useAuth();
	const navigate = useNavigate();
	const [name, setName] = useState('');
	const [exercises, setExercises] = useState(['', '', '']);
	const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

	const updateExercise = (index: number, value: string) => {
		const newExercises = [...exercises];
		newExercises[index] = value;
		setExercises(newExercises);
	};

	const addExercise = () => {
		setExercises([...exercises, '']);
	};

	const removeExercise = (index: number) => {
		if (exercises.length > 1) {
			setExercises(exercises.filter((_, i) => i !== index));
		}
	};

	const createWorkout = async () => {
		if (!user || !name.trim()) return;

		const workoutData = {
			name: name.trim(),
			exercises: exercises.filter(ex => ex.trim()).map(name => ({name: name.trim()})),
			userId: user.id,
			...PRESETS[level]
		};

		const id = await repo.create(workoutData);
		navigate(`/train-workout/${id}`);
	};

	return (
		<div className="card">
			<h3 style={{margin: '0 0 16px 0'}}>{t('workouts.quickCreate')}</h3>

			<div style={{marginBottom: '16px'}}>
				<input
					className="input"
					placeholder={t('workouts.name')}
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
			</div>

			<div style={{marginBottom: '16px'}}>
				<label style={{display: 'block', marginBottom: '8px', fontWeight: '600'}}>
					{t('workouts.level')}
				</label>
				<div style={{display: 'flex', gap: '8px'}}>
					{(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
						<button
							key={lvl}
							className={`btn ${level === lvl ? 'primary' : ''}`}
							onClick={() => setLevel(lvl)}
							style={{flex: 1}}
						>
							{t(`workouts.levels.${lvl}`)}
						</button>
					))}
				</div>
			</div>

			<div style={{marginBottom: '16px'}}>
				<label style={{display: 'block', marginBottom: '8px', fontWeight: '600'}}>
					{t('workouts.exercises')}
				</label>
				{exercises.map((exercise, index) => (
					<div key={index} style={{display: 'flex', gap: '8px', marginBottom: '8px'}}>
						<input
							className="input"
							placeholder={`${t('workouts.exercise')} ${index + 1}`}
							value={exercise}
							onChange={(e) => updateExercise(index, e.target.value)}
							style={{flex: 1}}
						/>
						{exercises.length > 1 && (
							<button
								className="btn"
								onClick={() => removeExercise(index)}
								style={{width: '44px'}}
							>
								×
							</button>
						)}
					</div>
				))}
				<button className="btn" onClick={addExercise} style={{width: '100%'}}>
					+ {t('workouts.addExercise')}
				</button>
			</div>

			<button
				className="btn primary"
				onClick={createWorkout}
				disabled={!name.trim() || exercises.filter(ex => ex.trim()).length === 0}
				style={{width: '100%'}}
			>
				{t('workouts.createBtn')}
			</button>
		</div>
	);
}
