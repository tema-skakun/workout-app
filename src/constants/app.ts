export const APP_CONFIG = {
	IS_PROD: import.meta.env.PROD,
	BASENAME: import.meta.env.PROD ? '/workout-app' : '/',
	API_BASE_URL: import.meta.env.PROD ? '/workout-app/api' : '/api'
} as const;
