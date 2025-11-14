import {useEffect, useState} from 'react';
import {useAuth} from '@/auth/AuthContext';
import * as repo from '@/repositories/workoutsRepo';
import type {Workout} from '@/domain/types';
import {Link, useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {Edit} from '@/svg/edit';
import {Delete} from '@/svg/delete';
import {Plus} from '@/svg/plus';

export default function Workouts() {
	const {t} = useTranslation();
	const {user} = useAuth();
	const nav = useNavigate();
	const [items, setItems] = useState<Workout[]>([]);
	const [error, setError] = useState('');

	useEffect(() => {
		if (!user) return;
		repo.listByUser(user.id).then(setItems).catch(() => setError('Load failed'));
	}, [user]);

	const onDelete = async (id: string) => {
		await repo.remove(id);
		setItems(prev => prev.filter(x => x.id !== id));
	};

	return (
		<div>
			<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
				<h2 style={{margin: 0}}>{t('workouts.my')}</h2>
				<Link to="/create-workout" className="btn">
					<Plus/>
				</Link>
			</div>
			{error && <p style={{color: 'red'}}>{error}</p>}
			{items.length === 0 && <p>{t('workouts.dontHave')}</p>}
			<ul style={{listStyle: 'none', padding: 0, margin: 0}}>
				{items.map(w => (
					<li key={w.id} style={{
						display: 'flex',
						gap: 8,
						alignItems: 'center',
						marginBottom: 8,
						padding: 12,
						border: '2px solid #0a4a94',
						borderRadius: 12
					}}>
						<Link to={`/train-workout/${w.id}`} style={{flex: 1}}>{w.name}</Link>
						<button className="btn" onClick={() => nav(`/edit-workout/${w.id}`)}>
							<Edit/>
						</button>
						<button className="btn secondary" onClick={() => onDelete(w.id)}>
							<Delete/>
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}
