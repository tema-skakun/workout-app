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
	// title: string;
	isLoading?: boolean;
}

export const WorkoutForm: React.FC<WorkoutFormProps> = ({
																													initialData,
																													onSubmit,
																													onCancel,
																													submitButtonText,
																													// title,
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

			<Tabs
				activeTab={activeTab}
				onTabChange={setActiveTab}
				tabs={tabs}
				disabledTabs={[false, !isFirstTabValid()]} // Вторая вкладка disabled пока не пройдена валидация первой
			/>

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
						<div style={{marginBottom: '12px'}}>
							<input
								autoFocus
								className="input small"
								name="name"
								value={form.name}
								onChange={handleChange}
								placeholder={t('workouts.name')!}
								maxLength={20}
								style={{
									borderColor: !form.name.trim() ? 'var(--danger)' : undefined,
									borderWidth: !form.name.trim() ? '2px' : undefined,
									height: '40px'
								}}
							/>
						</div>

						<TimeInput
							labelKey="fields.warmupTime"
							name="warmupTime"
							value={form.warmupTime}
							min={5}
							max={3600}
							onChange={handleChange}
							hasError={form.warmupTime < 5 || form.warmupTime > 3600}
						/>
						<TimeInput
							labelKey="fields.exerciseTime"
							name="exerciseTime"
							value={form.exerciseTime}
							min={5}
							max={3600}
							onChange={handleChange}
							hasError={form.exerciseTime < 5 || form.exerciseTime > 3600}
						/>
						<TimeInput
							labelKey="fields.restTime"
							name="restTime"
							value={form.restTime}
							min={5}
							max={3600}
							onChange={handleChange}
							hasError={form.restTime < 5 || form.restTime > 3600}
						/>
						<TimeInput
							labelKey="fields.rounds"
							name="rounds"
							value={form.rounds}
							min={1}
							max={999}
							onChange={handleChange}
							hasError={form.rounds < 1 || form.rounds > 999}
						/>
						<TimeInput
							labelKey="fields.restBetweenRounds"
							name="restBetweenRounds"
							value={form.restBetweenRounds}
							min={5}
							max={3600}
							onChange={handleChange}
							hasError={form.restBetweenRounds < 5 || form.restBetweenRounds > 3600}
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
				gap: '10px',
				marginTop: '20px',
				paddingTop: '16px',
				borderTop: '1px solid rgba(0,0,0,0.1)'
			}}>
				{activeTab === 0 ? (
					<>
						<button
							className="btn small"
							onClick={onCancel}
							style={{flex: 1, height: '38px'}}
							disabled={isLoading}
						>
							{t('common.cancel', 'Отмена')}
						</button>
						<button
							className={`btn small primary ${!isFirstTabValid() ? 'disabled' : ''}`}
							onClick={handleNext}
							disabled={!isFirstTabValid() || isLoading}
							style={{
								flex: 1,
								height: '38px',
								opacity: (!isFirstTabValid() || isLoading) ? 0.5 : 1,
								cursor: (!isFirstTabValid() || isLoading) ? 'not-allowed' : 'pointer'
							}}
						>
							{t('common.next')}
						</button>
					</>
				) : (
					<>
						<button
							className="btn small"
							onClick={handleBack}
							style={{flex: 1, height: '38px'}}
							disabled={isLoading}
						>
							{t('common.back')}
						</button>
						<button
							className={`btn small primary ${!isSecondTabValid() ? 'disabled' : ''}`}
							onClick={handleSubmit}
							disabled={!isSecondTabValid() || isLoading}
							style={{
								flex: 1,
								height: '38px',
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
