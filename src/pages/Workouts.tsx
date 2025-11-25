import {useEffect, useState} from 'react';
import {useAuth} from '@/auth/AuthContext';
import * as repo from '@/repositories/workoutsRepo';
import type {Workout} from '@/domain/types';
import {Link, useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {Edit} from '@/svg/edit';
import {Delete} from '@/svg/delete';
import {Plus} from '@/svg/plus';
import {ConfirmModal} from '@/components/ConfirmModal';

const Workouts = () => {
	const {t} = useTranslation();
	const {user} = useAuth();
	const nav = useNavigate();
	const [items, setItems] = useState<Workout[]>([]);
	const [error, setError] = useState('');
	const [deleteModal, setDeleteModal] = useState<{
		isOpen: boolean;
		workout: Workout | null;
	}>({
		isOpen: false,
		workout: null
	});

	useEffect(() => {
		if (!user) return;
		repo.listByUser(user.id).then(setItems).catch(() => setError('Load failed'));
	}, [user]);

	const openDeleteModal = (workout: Workout) => {
		setDeleteModal({
			isOpen: true,
			workout
		});
	};

	const closeDeleteModal = () => {
		setDeleteModal({
			isOpen: false,
			workout: null
		});
	};

	const handleDelete = async () => {
		if (!deleteModal.workout) return;

		try {
			await repo.remove(deleteModal.workout.id);
			setItems(prev => prev.filter(x => x.id !== deleteModal.workout?.id));
			closeDeleteModal();
		} catch (error) {
			setError('Delete failed');
			console.error('Failed to delete workout:', error);
		}
	};

	return (
		<div>
			<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
				<h2 style={{margin: 0}}>{t('workouts.my')}</h2>
				<Link to="/create-workout" className="btn">
					<Plus/>
				</Link>
			</div>

			{error && (
				<p style={{
					color: 'var(--danger)',
					background: 'rgba(239, 68, 68, 0.1)',
					padding: '12px',
					borderRadius: 'var(--border-radius)',
					marginBottom: '16px'
				}}>
					{error}
				</p>
			)}

			{items.length === 0 && <p>{t('workouts.dontHave')}</p>}

			<ul style={{listStyle: 'none', padding: 0, margin: 0}}>
				{items.map(w => (
					<li
						key={w.id}
						className='card'
						style={{
							display: 'flex',
							gap: 8,
							alignItems: 'center',
							marginBottom: 8,
							padding: 12,
							borderRadius: 12
						}}>
						<Link
							to={`/train-workout/${w.id}`}
							style={{
								flex: 1,
								textDecoration: 'none',
								color: 'var(--text)',
								fontWeight: '500'
							}}
						>
							{w.name}
						</Link>
						<button
							className="btn"
							onClick={() => nav(`/edit-workout/${w.id}`)}
							style={{padding: '8px'}}
						>
							<Edit/>
						</button>
						<button
							className="btn"
							onClick={() => openDeleteModal(w)}
							style={{
								padding: '8px',
								color: 'white'
							}}
						>
							<Delete/>
						</button>
					</li>
				))}
			</ul>

			<ConfirmModal
				isOpen={deleteModal.isOpen}
				title={t('deleteConfirm.title')}
				message={t('deleteConfirm.message', {name: deleteModal.workout?.name})}
				onConfirm={handleDelete}
				onCancel={closeDeleteModal}
				confirmText={t('deleteConfirm.yes')}
				cancelText={t('deleteConfirm.no')}
			/>
		</div>
	);
}

export default Workouts;
