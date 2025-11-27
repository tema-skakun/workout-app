import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

const isProd = process.env.NODE_ENV === 'production';
const base = isProd ? '/workout-app/' : '/';

export default defineConfig({
	base,
	plugins: [
		react(),
		VitePWA({
			registerType: 'autoUpdate',
			includeAssets: [
				'favicon.svg',
				'robots.txt',
				'sounds/whistle.mp3',
				'sounds/ticking.mp3',
				'sounds/gong.mp3',
			],
			manifest: {
				name: 'Workout App',
				short_name: 'Workout',
				start_url: isProd ? '/workout-app/' : '/',
				scope: isProd ? '/workout-app/' : '/',
				display: 'standalone',
				orientation: 'portrait',
				background_color: '#f0f0f3',
				theme_color: '#6366f1',
				icons: [
					{
						src: 'icons/icon-192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: 'icons/icon-512.png',
						sizes: '512x512',
						type: 'image/png',
					},
				],
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3}'],
			},
		}),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
		},
	},
	server: {
		port: 5173,
	},
});
