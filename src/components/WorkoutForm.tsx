import React from 'react';
import {useTranslation} from 'react-i18next';
import {useWorkoutForm, WorkoutFormData} from '@/hooks/useWorkoutForm';
import TimeInput from '@/components/TimeInput';
import Tabs from '@/components/Tabs';
import {ExerciseInputsWithDelete} from '@/components/ExerciseInputsWithDelete';

interface WorkoutFormProps {
	initialData?: Partial<WorkoutFormData>;
	onSubmit: (formData: WorkoutFormData) => Promise<void>;
	onCancel: () => void;
	submitButtonText: string;
	title: string;
	isLoading?: boolean;
}

export const WorkoutForm: React.FC<WorkoutFormProps> = ({
																													initialData,
																													onSubmit,
																													onCancel,
																													submitButtonText,
																													title,
																													isLoading = false
																												}) => {
	const {t} = useTranslation();
	const {
		form,
		activeTab,
		setActiveTab,
		error,
		setError,
		handleChange,
		handleExerciseChange,
		addExercise,
		removeExercise,
		isFirstTabValid,
		isSecondTabValid,
		getExercisesToSave
	} = useWorkoutForm(initialData);

	const tabs = [
		t('workouts.tabs.settings', 'Настройки времени'),
		t('workouts.tabs.exercises', 'Упражнения')
	];

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

	const handleSubmit = async () => {
		if (!isSecondTabValid()) {
			setError(t('workouts.errors.exercise'));
			return;
		}

		const exercisesToSave = getExercisesToSave();
		await onSubmit({
			...form,
			exercises: exercisesToSave
		});
	};

	return (
		<div style={{maxWidth: '480px', margin: '0 auto'}}>
			<h2 style={{marginBottom: '20px', fontSize: '20px'}}>
				{title}
			</h2>

			<Tabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs}/>

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

			<div style={{
				minHeight: '400px',
				display: 'flex',
				flexDirection: 'column'
			}}>
				{activeTab === 0 && (
					<div style={{flex: 1}}>
						<div style={{marginBottom: '16px'}}>
							<input
								autoFocus
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
							onClick={onCancel}
							style={{flex: 1}}
							disabled={isLoading}
						>
							{t('common.cancel', 'Отмена')}
						</button>
						<button
							className={`btn primary ${!isFirstTabValid() ? 'disabled' : ''}`}
							onClick={handleNext}
							disabled={!isFirstTabValid() || isLoading}
							style={{
								flex: 1,
								opacity: (!isFirstTabValid() || isLoading) ? 0.5 : 1,
								cursor: (!isFirstTabValid() || isLoading) ? 'not-allowed' : 'pointer'
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
							style={{flex: 1}}
							disabled={isLoading}
						>
							{t('common.back', 'Назад')}
						</button>
						<button
							className={`btn primary ${!isSecondTabValid() ? 'disabled' : ''}`}
							onClick={handleSubmit}
							disabled={!isSecondTabValid() || isLoading}
							style={{
								flex: 1,
								opacity: (!isSecondTabValid() || isLoading) ? 0.5 : 1,
								cursor: (!isSecondTabValid() || isLoading) ? 'not-allowed' : 'pointer'
							}}
						>
							{isLoading ? '...' : submitButtonText}
						</button>
					</>
				)}
			</div>
		</div>
	);
};
