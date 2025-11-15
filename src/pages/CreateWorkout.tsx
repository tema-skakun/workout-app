import { useState } from 'react';
import TimeInput from '@/components/TimeInput';
import Tabs from '@/components/Tabs';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/auth/AuthContext';
import * as repo from '@/repositories/workoutsRepo';
import { Arrow } from '@/svg/arrow';
import {ExerciseInputsWithDelete} from "../components/ExerciseInputsWithDelete";

export default function CreateWorkout() {
	const { t } = useTranslation();
	const { user } = useAuth();
	const nav = useNavigate();
	const [activeTab, setActiveTab] = useState(0);
	const [error, setError] = useState('');

	const [form, setForm] = useState({
		name: '',
		exercises: [{ name: '' }],
		warmupTime: 5,
		exerciseTime: 30,
		restTime: 15,
		rounds: 3,
		restBetweenRounds: 30
	});

	const tabs = [
		t('workouts.tabs.settings', 'Настройки времени'),
		t('workouts.tabs.exercises', 'Упражнения')
	];

	const setField = (name: string, value: number | string) =>
		setForm(p => ({ ...p, [name]: value }));

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setField(name, name === 'rounds' || name.includes('Time') ? Number(value) : value);
	};

	const handleExerciseChange = (i: number, value: string) => {
		const copy = form.exercises.slice();
		copy[i].name = value;
		setForm(p => ({ ...p, exercises: copy }));
	};

	const addExercise = () =>
		setForm(p => ({ ...p, exercises: [...p.exercises, { name: '' }] }));

	const removeExercise = (index: number) => {
		if (form.exercises.length > 1) {
			setForm(p => ({
				...p,
				exercises: p.exercises.filter((_, i) => i !== index)
			}));
		}
	};

	// Валидация первого таба
	const isFirstTabValid = () => {
		return form.name.trim() !== '' &&
			form.warmupTime >= 5 &&
			form.exerciseTime >= 5 &&
			form.restTime >= 5 &&
			form.rounds >= 1 &&
			form.restBetweenRounds >= 5;
	};

	// Валидация второго таба
	const isSecondTabValid = () => {
		return form.exercises.some(ex => ex.name.trim() !== '');
	};

	const handleNext = () => {
		if (!isFirstTabValid()) {
			setError(t('workouts.errors.form'));
			return;
		}
		setError('');
		setActiveTab(1);
	};

	const handleBack = () => {
		setError('');
		setActiveTab(0);
	};

	const onCreate = async () => {
		if (!user) return;
		if (!isSecondTabValid()) {
			setError(t('workouts.errors.exercise'));
			return;
		}

		// Фильтруем пустые упражнения перед сохранением
		const exercisesToSave = form.exercises.filter(ex => ex.name.trim() !== '');

		const id = await repo.create({
			...form,
			exercises: exercisesToSave,
			userId: user.id
		});
		// nav(`/train-workout/${id}`);
		nav('/workouts');
	};

	const handleCancel = () => {
		nav('/workouts');
	};

	return (
		<div style={{ maxWidth: '480px', margin: '0 auto' }}>
			{/* Заголовок и навигация */}
			<div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
				<button
					className="btn"
					onClick={handleCancel}
					style={{ display: 'flex', alignItems: 'center', padding: '8px' }}
				>
					<Arrow />
				</button>
				<h2 style={{ margin: 0, fontSize: '20px' }}>
					{t('workouts.create')}
				</h2>
			</div>

			{/* Табы */}
			<Tabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />

			{error && (
				<div style={{
					color: 'var(--danger)',
					background: 'rgba(239, 68, 68, 0.1)',
					padding: '12px',
					borderRadius: 'var(--border-radius)',
					marginBottom: '16px',
					border: '1px solid var(--danger)'
				}}>
					{error}
				</div>
			)}

			{/* Содержимое табов */}
			<div style={{
				minHeight: '400px',
				display: 'flex',
				flexDirection: 'column'
			}}>
				{activeTab === 0 && (
					<div style={{ flex: 1 }}>
						<div style={{ marginBottom: '16px' }}>
							<input
								className="input"
								name="name"
								value={form.name}
								onChange={handleChange}
								placeholder={t('workouts.name')!}
								style={{
									borderColor: !form.name.trim() ? 'var(--danger)' : undefined
								}}
							/>
						</div>

						<TimeInput
							labelKey="fields.warmupTime"
							name="warmupTime"
							value={form.warmupTime}
							min={5}
							onChange={handleChange}
							hasError={form.warmupTime < 5}
						/>
						<TimeInput
							labelKey="fields.exerciseTime"
							name="exerciseTime"
							value={form.exerciseTime}
							min={5}
							onChange={handleChange}
							hasError={form.exerciseTime < 5}
						/>
						<TimeInput
							labelKey="fields.restTime"
							name="restTime"
							value={form.restTime}
							min={5}
							onChange={handleChange}
							hasError={form.restTime < 5}
						/>
						<TimeInput
							labelKey="fields.rounds"
							name="rounds"
							value={form.rounds}
							min={1}
							onChange={handleChange}
							hasError={form.rounds < 1}
						/>
						<TimeInput
							labelKey="fields.restBetweenRounds"
							name="restBetweenRounds"
							value={form.restBetweenRounds}
							min={5}
							onChange={handleChange}
							hasError={form.restBetweenRounds < 5}
						/>
					</div>
				)}

				{activeTab === 1 && (
					<div style={{
						flex: 1,
						display: 'flex',
						flexDirection: 'column',
						maxHeight: '60vh',
						overflow: 'hidden'
					}}>
						{/* Прокручиваемая область для упражнений */}
						<div style={{
							flex: 1,
							overflowY: 'auto',
							paddingRight: '8px',
							marginBottom: '16px'
						}}>
							<ExerciseInputsWithDelete
								exercises={form.exercises}
								onChange={handleExerciseChange}
								onAdd={addExercise}
								onRemove={removeExercise}
							/>
						</div>
					</div>
				)}
			</div>

			{/* Кнопки навигации */}
			<div style={{
				display: 'flex',
				gap: '12px',
				marginTop: '24px',
				paddingTop: '16px',
				borderTop: '1px solid rgba(0,0,0,0.1)'
			}}>
				{activeTab === 0 ? (
					<>
						<button
							className="btn"
							onClick={handleCancel}
							style={{ flex: 1 }}
						>
							{t('common.cancel', 'Отмена')}
						</button>
						<button
							className={`btn primary ${!isFirstTabValid() ? 'disabled' : ''}`}
							onClick={handleNext}
							disabled={!isFirstTabValid()}
							style={{
								flex: 1,
								opacity: !isFirstTabValid() ? 0.5 : 1,
								cursor: !isFirstTabValid() ? 'not-allowed' : 'pointer'
							}}
						>
							{t('common.next', 'Далее')}
						</button>
					</>
				) : (
					<>
						<button
							className="btn"
							onClick={handleBack}
							style={{ flex: 1 }}
						>
							{t('common.back', 'Назад')}
						</button>
						<button
							className={`btn primary ${!isSecondTabValid() ? 'disabled' : ''}`}
							onClick={onCreate}
							disabled={!isSecondTabValid()}
							style={{
								flex: 1,
								opacity: !isSecondTabValid() ? 0.5 : 1,
								cursor: !isSecondTabValid() ? 'not-allowed' : 'pointer'
							}}
						>
							{t('workouts.save')}
						</button>
					</>
				)}
			</div>
		</div>
	);
}
