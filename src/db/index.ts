import Dexie, {Table} from 'dexie';
import type {Workout, User} from '@/domain/types';
import {dbSchema} from './schema';


class AppDB extends Dexie {
	users!: Table<User, string>;
	workouts!: Table<Workout, string>;


	constructor() {
		super('workout_app');
		this.version(1).stores(dbSchema);
	}
}


export const db = new AppDB();
