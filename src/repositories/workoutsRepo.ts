import {db} from '@/db';
import type {Workout} from '@/domain/types';


export async function listByUser(userId: string) {
	return db.workouts.where({userId}).toArray();
}


export async function getById(id: string) {
	return db.workouts.get(id);
}


export async function create(w: Omit<Workout, 'id'>) {
	const id = crypto.randomUUID();
	await db.workouts.add({...w, id});
	return id;
}


export async function update(id: string, patch: Partial<Workout>) {
	await db.workouts.update(id, patch);
}


export async function remove(id: string) {
	await db.workouts.delete(id);
}
