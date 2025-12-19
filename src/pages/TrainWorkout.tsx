import {useEffect, useMemo, useRef, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import * as repo from '@/repositories/workoutsRepo';
import type {Workout} from '@/domain/types';
import {useTranslation} from 'react-i18next';
import {Pause} from '@/svg/pause';
import {Play} from '@/svg/play';
import {Howl} from 'howler';

const baseUrl = import.meta.env.BASE_URL;

const TrainWorkout = () => {
	const {t} = useTranslation();
	const nav = useNavigate();
	const {id} = useParams();
	const [workout, setWorkout] = useState<Workout | null>(null);
	const [isActive, setIsActive] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
	const [roundIndex, setRoundIndex] = useState(0);
	const [stage, setStage] = useState<'warmup' | 'exercise' | 'rest' | 'restBetweenRounds' | 'complete'>('warmup');

	// Храним время в миллисекундах
	const [timeLeftMs, setTimeLeftMs] = useState(0);
	const [nextExercise, setNextExercise] = useState('');

	const animationRef = useRef<number | null>(null);
	const lastUpdateTimeRef = useRef<number>(0);

	// Референсы для звуков Howler
	const soundsRef = useRef<{ whistle: Howl | null; ticking: Howl | null; gong: Howl | null; }>({
		whistle: null,
		ticking: null,
		gong: null
	});

	// Инициализация звуков
	useEffect(() => {
		soundsRef.current.whistle = new Howl({
			src: [`${baseUrl}sounds/whistle.mp3`],
			preload: true,
			html5: true
		});

		soundsRef.current.ticking = new Howl({
			src: [`${baseUrl}sounds/ticking.mp3`],
			preload: true,
			html5: true,
			loop: true
		});

		soundsRef.current.gong = new Howl({
			src: [`${baseUrl}sounds/gong.mp3`],
			preload: true,
			html5: true
		});

		// Очистка при размонтировании
		return () => {
			Object.values(soundsRef.current).forEach(sound => {
				if (sound) {
					sound.unload();
				}
			});
		};
	}, []);

	useEffect(() => {
		if (!id) return;
		repo.getById(id).then(w => {
			if (!w) {
				nav('/workouts');
				return;
			}
			setWorkout(w);
			setStage('warmup');
			setTimeLeftMs(w.warmupTime * 1000);
			setNextExercise(w.exercises[0]?.name || '');
		});
	}, [id, nav]);

	const stageLabel = useMemo(() => ({
		warmup: t('timer.warmup'),
		exercise: workout?.exercises[currentExerciseIndex]?.name || t('timer.exercise'),
		rest: t('timer.rest'),
		restBetweenRounds: t('timer.restBetweenRounds'),
		complete: t('timer.done')
	})[stage], [stage, currentExerciseIndex, workout, t]);

	// Функции для работы со звуками
	const playSound = (soundName: 'whistle' | 'ticking' | 'gong') => {
		const sound = soundsRef.current[soundName];
		if (sound && !sound.playing()) {
			sound.play();
		}
	};

	// Функция для остановки звука
	const stopSound = (soundName: 'whistle' | 'ticking' | 'gong') => {
		const sound = soundsRef.current[soundName];
		if (sound) {
			sound.stop();
		}
	};

	// Функция для паузы звука
	const pauseSound = (soundName: 'whistle' | 'ticking' | 'gong') => {
		const sound = soundsRef.current[soundName];
		if (sound && sound.playing()) {
			sound.pause();
		}
	};

	// Функция для возобновления звука
	const resumeSound = (soundName: 'whistle' | 'ticking' | 'gong') => {
		const sound = soundsRef.current[soundName];
		if (sound && !sound.playing()) {
			sound.play();
		}
	};

	// Основная функция анимации
	const animate = (timestamp: number) => {
		if (!lastUpdateTimeRef.current) {
			lastUpdateTimeRef.current = timestamp;
		}

		const delta = timestamp - lastUpdateTimeRef.current;
		lastUpdateTimeRef.current = timestamp;

		setTimeLeftMs(prev => {
			const newTime = Math.max(0, prev - delta);

			// Управление звуком ticking
			if (newTime <= 4000 && newTime > 0) {
				if (!soundsRef.current.ticking?.playing()) {
					playSound('ticking');
				}
			} else {
				stopSound('ticking');
			}

			// Переход на следующий этап при завершении времени
			if (newTime <= 0) {
				handleStageComplete();
				return 0;
			}

			return newTime;
		});

		if (timeLeftMs > 0) {
			animationRef.current = requestAnimationFrame(animate);
		}
	};

	const handleStageComplete = () => {
		if (!workout) return;

		stopSound('ticking');

		if (stage === 'warmup') {
			setStage('exercise');
			setTimeLeftMs(workout.exerciseTime * 1000);
			playSound('whistle');
		} else if (stage === 'exercise') {
			if (currentExerciseIndex < workout.exercises.length - 1) {
				setStage('rest');
				setNextExercise(workout.exercises[currentExerciseIndex + 1]?.name || '');
				setTimeLeftMs(workout.restTime * 1000);
				playSound('gong');
			} else if (roundIndex < workout.rounds - 1) {
				setStage('restBetweenRounds');
				setNextExercise(workout.exercises[0]?.name || '');
				setTimeLeftMs(workout.restBetweenRounds * 1000);
				playSound('gong');
			} else {
				setStage('complete');
				setIsActive(false);
				playSound('gong');
			}
		} else if (stage === 'rest') {
			setStage('exercise');
			setCurrentExerciseIndex(i => i + 1);
			setTimeLeftMs(workout.exerciseTime * 1000);
			playSound('whistle');
		} else if (stage === 'restBetweenRounds') {
			setStage('exercise');
			setCurrentExerciseIndex(0);
			setRoundIndex(r => r + 1);
			setNextExercise(workout.exercises[1]?.name || '');
			setTimeLeftMs(workout.exerciseTime * 1000);
			playSound('whistle');
		} else if (stage === 'complete') {
			nav('/workouts');
		}
	};

	const startTimer = (durationMs: number) => {
		if (animationRef.current) {
			cancelAnimationFrame(animationRef.current);
		}

		setTimeLeftMs(durationMs);
		lastUpdateTimeRef.current = 0;

		if (durationMs > 0) {
			animationRef.current = requestAnimationFrame(animate);
		}
	};

	const handleStartPause = () => {
		if (!isActive) {
			handleStart();
		} else if (isPaused) {
			// Возобновление
			setIsPaused(false);
			lastUpdateTimeRef.current = 0;

			// Возобновляем звук ticking если нужно
			if (timeLeftMs <= 4000 && timeLeftMs > 0) {
				resumeSound('ticking');
			}

			animationRef.current = requestAnimationFrame(animate);
		} else {
			// Пауза
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
				animationRef.current = null;
			}

			pauseSound('ticking');
			setIsPaused(true);
		}
	};

	const handleStart = () => {
		if (!workout) return;

		const durationMs = stage === 'warmup' ? workout.warmupTime * 1000 :
			stage === 'exercise' ? workout.exerciseTime * 1000 :
				stage === 'rest' ? workout.restTime * 1000 :
					stage === 'restBetweenRounds' ? workout.restBetweenRounds * 1000 : 0;

		startTimer(durationMs);
		setIsActive(true);
		setIsPaused(false);
	};

	// Очистка при размонтировании
	useEffect(() => {
		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
			// Останавливаем все звуки при выходе
			Object.values(soundsRef.current).forEach(sound => {
				if (sound) {
					sound.stop();
				}
			});
		};
	}, []);

	if (!workout) return <p>Loading...</p>;

	// Форматирование времени для отображения
	const mm = String(Math.floor(timeLeftMs / 60000)).padStart(2, '0');
	const ss = String(Math.floor((timeLeftMs % 60000) / 1000)).padStart(2, '0');
	const ms = String(Math.floor(timeLeftMs % 1000)).padStart(3, '0').slice(0, 2); // 1 цифра миллисекунд

	const getStageColor = () => {
		switch (stage) {
			case 'warmup': return 'var(--warning)';
			case 'exercise': return 'var(--primary)';
			case 'rest': return 'var(--success)';
			case 'restBetweenRounds': return 'var(--success)';
			case 'complete': return 'var(--danger)';
			default: return 'var(--text-light)';
		}
	};

	return (
		<div className="card" style={{display: 'grid', justifyItems: 'center'}}>
			<div style={{color: 'var(--text-light)', fontSize: '1.5rem', fontWeight: 'bold'}}>
				{workout.name}
			</div>

			<div className="stage-label" style={{color: getStageColor()}}>
				{stageLabel}
			</div>

			<div style={{color: getStageColor()}} className="timer-display">
				{mm}:{ss}.{ms}
			</div>

			<button className="btn primary" onClick={handleStartPause}>
				{!isActive ? <Play fill='var(--surface)'/> :
					isPaused ? <Play fill='var(--surface)'/> :
						<Pause fill='var(--surface)'/>}
			</button>

			<div style={{color: 'var(--text-light)', fontSize: '2.5rem', fontWeight: 'bold'}}>
				{(stage === 'rest' || stage === 'restBetweenRounds' || stage === 'warmup')
					? `${t('timer.next')}: ${nextExercise}`
					: stage === 'complete'
						? t('timer.wellDone')
						: t('timer.justDoIt')}
			</div>
		</div>
	);
};

export default TrainWorkout;
