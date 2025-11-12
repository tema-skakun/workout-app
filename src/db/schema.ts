export const dbSchema = {
	users: 'id,&email,createdAt', // &email — уникальный индекс
	workouts: 'id,userId,name' // индексы для выборок
};
