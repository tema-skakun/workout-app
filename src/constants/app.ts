export const APP_CONFIG = {
	IS_PROD: import.meta.env.PROD,
	BASENAME: import.meta.env.PROD ? '/workout-app' : '/',
	HOME_PATH: '/',
	LOGIN_PATH: '/login',
	REGISTER_PATH: '/register',
	WORKOUTS_PATH: '/workouts'
} as const;
