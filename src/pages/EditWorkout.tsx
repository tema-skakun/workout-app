import {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import * as repo from '@/repositories/workoutsRepo';
import {useTranslation} from 'react-i18next';
import {WorkoutForm} from '@/components/WorkoutForm';
import {Arrow} from '@/svg/arrow';
import type {WorkoutFormData} from '@/hooks/useWorkoutForm';
import type {Workout} from '@/domain/types';

export default function EditWorkout() {
	const {t} = useTranslation();
	const {id} = useParams();
	const navigate = useNavigate();
	const [workout, setWorkout] = useState<Workout | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (!id) return;

		const loadWorkout = async () => {
			try {
				const data = await repo.getById(id);
				if (!data) {
					return;
				}
				setWorkout(data);
			} catch (err) {
				console.error('Failed to load workout:', err);
			} finally {
				setIsLoading(false);
			}
		};

		loadWorkout();
	}, [id]);

	const handleSubmit = async (formData: WorkoutFormData) => {
		if (!id) return;

		setIsSubmitting(true);
		try {
			await repo.update(id, formData);
			navigate('/workouts');
		} catch (err) {
			console.error('Failed to save workout:', err);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCancel = () => {
		navigate('/workouts');
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

	if (!workout) {
		return (
			<div style={{textAlign: 'center', padding: '40px'}}>
				<p style={{color: 'var(--danger)'}}>Workout not found</p>
				<button className="btn" onClick={handleCancel}>
					{t('common.back', 'Back to workouts')}
				</button>
			</div>
		);
	}

	const initialData: WorkoutFormData = {
		name: workout.name,
		exercises: workout.exercises.length > 0 ? workout.exercises : [{name: ''}],
		warmupTime: workout.warmupTime,
		exerciseTime: workout.exerciseTime,
		restTime: workout.restTime,
		rounds: workout.rounds,
		restBetweenRounds: workout.restBetweenRounds
	};

	return (
		<div style={{maxWidth: '480px', margin: '0 auto'}}>
			<div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px'}}>
				<button
					className="btn"
					onClick={handleCancel}
					style={{display: 'flex', alignItems: 'center', padding: '8px'}}
				>
					<Arrow/>
				</button>
			</div>

			<WorkoutForm
				initialData={initialData}
				onSubmit={handleSubmit}
				onCancel={handleCancel}
				submitButtonText={t('workouts.save')}
				title={t('workouts.edit')}
				isLoading={isSubmitting}
			/>
		</div>
	);
}
