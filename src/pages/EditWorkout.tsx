import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as repo from '@/repositories/workoutsRepo';
import TimeInput from '@/components/TimeInput';
import Tabs from '@/components/Tabs';
import { useTranslation } from 'react-i18next';
import { Arrow } from '@/svg/arrow';
import type { Workout } from '@/domain/types';
import {ExerciseInputsWithDelete} from "../components/ExerciseInputsWithDelete";

export default function EditWorkout() {
	const { t } = useTranslation();
	const { id } = useParams();
	const nav = useNavigate();
	const [activeTab, setActiveTab] = useState(0);
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(true);

	const [form, setForm] = useState<Omit<Workout, 'id' | 'userId'> | null>(null);

	const tabs = [
		t('workouts.tabs.settings', 'Настройки времени'),
		t('workouts.tabs.exercises', 'Упражнения')
	];

	useEffect(() => {
		if (!id) return;

		const loadWorkout = async () => {
			try {
				const data = await repo.getById(id);
				if (!data) {
					setError('Workout not found');
					return;
				}

				const { name, exercises, warmupTime, exerciseTime, restTime, rounds, restBetweenRounds } = data;
				setForm({
					name,
					exercises: exercises.length > 0 ? exercises : [{ name: '' }],
					warmupTime,
					exerciseTime,
					restTime,
					rounds,
					restBetweenRounds
				});
			} catch (err) {
				setError('Failed to load workout');
			} finally {
				setIsLoading(false);
			}
		};

		loadWorkout();
	}, [id]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm((p: any) => ({
			...p,
			[name]: name === 'rounds' || name.includes('Time') ? Number(value) : value
		}));
	};

	const handleExerciseChange = (i: number, value: string) => {
		const copy = form!.exercises.slice();
		copy[i].name = value;
		setForm((p: any) => ({ ...p, exercises: copy }));
	};

	const addExercise = () =>
		setForm((p: any) => ({
			...p,
			exercises: [...p.exercises, { name: '' }]
		}));

	const removeExercise = (index: number) => {
		if (form!.exercises.length > 1) {
			setForm((p: any) => ({
				...p,
				exercises: p.exercises.filter((_: any, i: number) => i !== index)
			}));
		}
	};

	// Валидация первого таба
	const isFirstTabValid = () => {
		return form?.name.trim() !== '' &&
			form?.warmupTime >= 5 &&
			form?.exerciseTime >= 5 &&
			form?.restTime >= 5 &&
			form?.rounds >= 1 &&
			form?.restBetweenRounds >= 5;
	};

	// Валидация второго таба
	const isSecondTabValid = () => {
		return form?.exercises.some(ex => ex.name.trim() !== '');
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

	const onSave = async () => {
		if (!id || !form) return;

		if (!isSecondTabValid()) {
			setError(t('workouts.errors.exercise'));
			return;
		}

		// Фильтруем пустые упражнения перед сохранением
		const exercisesToSave = form.exercises.filter(ex => ex.name.trim() !== '');

		try {
			await repo.update(id, {
				...form,
				exercises: exercisesToSave
			});
			nav('/workouts');
		} catch (err) {
			setError('Failed to save workout');
		}
	};

	const handleCancel = () => {
		nav('/workouts');
	};

	if (isLoading) {
		return (
			<div style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '200px'
			}}>
				<p>Loading...</p>
			</div>
		);
	}

	if (!form) {
		return (
			<div style={{ textAlign: 'center', padding: '40px' }}>
				<p style={{ color: 'var(--danger)' }}>{error || 'Workout not found'}</p>
				<button className="btn" onClick={handleCancel}>
					{t('common.back', 'Back to workouts')}
				</button>
			</div>
		);
	}

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
					{t('workouts.edit')}
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
							onClick={onSave}
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
