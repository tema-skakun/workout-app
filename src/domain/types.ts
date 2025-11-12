export type Exercise = { name: string };


export type Workout = {
	id: string;
	userId: string;
	name: string;
	exercises: Exercise[];
	warmupTime: number;
	exerciseTime: number;
	restTime: number;
	rounds: number;
	restBetweenRounds: number;
};


export type User = {
	id: string;
	email: string;
	passwordHash: string;
	salt: string;
	createdAt: number;
};
