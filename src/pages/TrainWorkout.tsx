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
	const [timeLeft, setTimeLeft] = useState(0);
	const [nextExercise, setNextExercise] = useState('');

	const intervalRef = useRef<number | null>(null);

	// Референсы для звуков Howler
	const soundsRef = useRef<{
		whistle: Howl | null;
		ticking: Howl | null;
		gong: Howl | null;
	}>({
		whistle: null,
		ticking: null,
		gong: null
	});

	// Инициализация звуков
	useEffect(() => {
		soundsRef.current.whistle = new Howl({
			src: [`${baseUrl}sounds/whistle.mp3`],
			preload: true,
			html5: true // Для лучшей поддержки на мобильных устройствах
		});

		soundsRef.current.ticking = new Howl({
			src: [`${baseUrl}sounds/ticking.mp3`],
			preload: true,
			html5: true,
			loop: true // Тиканье будет зациклено
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
			setTimeLeft(w.warmupTime * 1000);
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

	// Функция для воспроизведения звука
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

	const startTimer = (ms: number) => {
		setTimeLeft(ms);
		if (intervalRef.current) window.clearInterval(intervalRef.current);

		intervalRef.current = window.setInterval(() => {
			setTimeLeft(prev => {
				const next = prev - 1000;

				// Запускаем тиканье за 4 секунды до конца
				if (next === 4000) {
					playSound('ticking');
				}

				if (next <= 0) {
					window.clearInterval(intervalRef.current!);
					stopSound('ticking'); // Останавливаем тиканье при завершении этапа
					return 0;
				}

				return next;
			});
		}, 1000);
	};

	const handleStartPause = () => {
		if (!isActive) {
			handleStart();
		} else if (isPaused) {
			setIsPaused(false);
			// Возобновляем тиканье, если оно должно играть
			if (timeLeft <= 4000 && timeLeft > 0) {
				resumeSound('ticking');
			}
			startTimer(timeLeft);
		} else {
			if (intervalRef.current) window.clearInterval(intervalRef.current);
			// Ставим на паузу тиканье
			pauseSound('ticking');
			setIsPaused(true);
		}
	};

	const handleStart = () => {
		if (!workout) return;
		const ms = stage === 'warmup' ? workout.warmupTime * 1000
			: stage === 'exercise' ? workout.exerciseTime * 1000
				: stage === 'rest' ? workout.restTime * 1000
					: stage === 'restBetweenRounds' ? workout.restBetweenRounds * 1000 : 0;
		startTimer(ms);
		setIsActive(true);
	};

	useEffect(() => {
		if (!isActive || !workout) return;
		if (timeLeft > 0) return;

		if (stage === 'warmup') {
			setStage('exercise');
			startTimer(workout.exerciseTime * 1000);
			playSound('whistle');
		} else if (stage === 'exercise') {
			if (currentExerciseIndex < workout.exercises.length - 1) {
				setStage('rest');
				setNextExercise(workout.exercises[currentExerciseIndex + 1]?.name || '');
				startTimer(workout.restTime * 1000);
				playSound('gong');
			} else if (roundIndex < workout.rounds - 1) {
				setStage('restBetweenRounds');
				setNextExercise(workout.exercises[0]?.name || '');
				startTimer(workout.restBetweenRounds * 1000);
				playSound('gong');
			} else {
				setStage('complete');
				setIsActive(false);
				playSound('gong');
			}
		} else if (stage === 'rest') {
			setStage('exercise');
			setCurrentExerciseIndex(i => i + 1);
			startTimer(workout.exerciseTime * 1000);
			playSound('whistle');
		} else if (stage === 'restBetweenRounds') {
			setStage('exercise');
			setCurrentExerciseIndex(0);
			setRoundIndex(r => r + 1);
			setNextExercise(workout.exercises[1]?.name || '');
			startTimer(workout.exerciseTime * 1000);
			playSound('whistle');
		} else if (stage === 'complete') {
			nav('/workouts');
		}
	}, [timeLeft, isActive, stage, workout, currentExerciseIndex, roundIndex, nav]);

	// Очистка при размонтировании компонента (выход из тренировки)
	useEffect(() => {
		return () => {
			if (intervalRef.current) {
				window.clearInterval(intervalRef.current);
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

	const mm = String(Math.floor(timeLeft / 60000)).padStart(2, '0');
	const ss = String(Math.floor((timeLeft % 60000) / 1000)).padStart(2, '0');

	const getStageColor = () => {
		switch (stage) {
			case 'warmup': return 'var(--warning)';
			case 'exercise': return 'var(--primary)';
			case 'rest': return 'var(--success)';
			case 'restBetweenRounds': return 'var(--success)';
			case 'complete': return 'var(--danger)';
			default: return 'var(--text-light)';
		}
	}

	return (
		<div
			className="card"
			style={{display: 'grid', justifyItems: 'center'}}
		>
			<div
				style={{color: 'var(--text-light)', fontSize: '1.5rem', fontWeight: 'bold'}}
			>{workout.name}
			</div>
			<div className="stage-label" style={{color: getStageColor()}} >
				{stageLabel}
			</div>
			<div
				style={{color: getStageColor()}}
				className="timer-display"
			>
				{mm}:{ss}
			</div>
			<button className="btn primary" onClick={handleStartPause}>
				{!isActive
					? <Play fill='var(--surface)'/>
					: isPaused
						? <Play fill='var(--surface)'/>
						: <Pause fill='var(--surface)'/>
				}
			</button>
			<div style={{color: 'var(--text-light)', fontSize: '2.5rem', fontWeight: 'bold'}}>
				{(stage === 'rest' || stage === 'restBetweenRounds' || stage === 'warmup')
					? `${t('timer.next')}: ${nextExercise}`
					: stage === 'complete'
						? t('timer.wellDone')
						: t('timer.justDoIt')
				}
			</div>
		</div>
	);
}

export default TrainWorkout;
