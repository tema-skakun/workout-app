import {db} from '@/db';
import type {User} from '@/domain/types';

export async function updateUser(id: string, patch: Partial<User>) {
	await db.users.update(id, patch);
}

export async function getUser(id: string) {
	return db.users.get(id);
}
