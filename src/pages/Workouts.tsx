import {useEffect, useState} from 'react';
import {useAuth} from '@/auth/AuthContext';
import * as repo from '@/repositories/workoutsRepo';
import type {Workout} from '@/domain/types';
import {Link, useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';


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
			<h2>{t('workouts.your')}</h2>
			{error && <p style={{color: 'red'}}>{error}</p>}
			<ul>
				{items.map(w => (
					<li key={w.id} style={{display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8}}>
						<Link to={`/train-workout/${w.id}`}>{w.name}</Link>
						<button className="btn" onClick={() => nav(`/edit-workout/${w.id}`)}>{t('workouts.edit')}</button>
						<button className="btn secondary" onClick={() => onDelete(w.id)}>{t('workouts.delete')}</button>
					</li>
				))}
			</ul>
			<Link to="/create-workout" className="btn">{t('workouts.create')}</Link>
		</div>
	);
}
