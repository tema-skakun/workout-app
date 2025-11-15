import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useAuth} from '@/auth/AuthContext';
import * as repo from '@/repositories/workoutsRepo';
import {WorkoutForm} from '@/components/WorkoutForm';
import {Arrow} from '@/svg/arrow';
import type {WorkoutFormData} from '@/hooks/useWorkoutForm';

export default function CreateWorkout() {
	const {t} = useTranslation();
	const {user} = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (formData: WorkoutFormData) => {
		if (!user) return;

		const id = await repo.create({
			...formData,
			userId: user.id
		});
		navigate('/workouts');
	};

	const handleCancel = () => {
		navigate('/workouts');
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
				onSubmit={handleSubmit}
				onCancel={handleCancel}
				submitButtonText={t('workouts.createBtn')}
				title={t('workouts.create')}
			/>
		</div>
	);
}
