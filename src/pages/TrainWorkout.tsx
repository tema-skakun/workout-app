import {useEffect, useMemo, useRef, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import * as repo from '@/repositories/workoutsRepo';
import type {Workout} from '@/domain/types';
import {useTranslation} from 'react-i18next';
import { Pause } from '@/svg/pause';
import { Play } from '@/svg/play';

const baseUrl = import.meta.env.BASE_URL;
const sounds = {
	whistle: `${baseUrl}sounds/whistle.mp3`,
	ticking: `${baseUrl}sounds/ticking.mp3`,
	gong: `${baseUrl}sounds/gong.mp3`
};

function play(url: string) {
	const a = new Audio(url);
	a.play();
}

export default function TrainWorkout() {
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

	const startTimer = (ms: number) => {
		setTimeLeft(ms);
		if (intervalRef.current) window.clearInterval(intervalRef.current);
		intervalRef.current = window.setInterval(() => {
			setTimeLeft(prev => {
				const next = prev - 1000;
				if (next === 4000) play(sounds.ticking);
				if (next <= 0) {
					window.clearInterval(intervalRef.current!);
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
			startTimer(timeLeft);
		} else {
			if (intervalRef.current) window.clearInterval(intervalRef.current);
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
			play(sounds.whistle);
		} else if (stage === 'exercise') {
			if (currentExerciseIndex < workout.exercises.length - 1) {
				setStage('rest');
				setNextExercise(workout.exercises[currentExerciseIndex + 1]?.name || '');
				startTimer(workout.restTime * 1000);
				play(sounds.gong);
			} else if (roundIndex < workout.rounds - 1) {
				setStage('restBetweenRounds');
				setNextExercise(workout.exercises[0]?.name || '');
				startTimer(workout.restBetweenRounds * 1000);
				play(sounds.gong);
			} else {
				setStage('complete');
				setIsActive(false);
				play(sounds.gong);
			}
		} else if (stage === 'rest') {
			setStage('exercise');
			setCurrentExerciseIndex(i => i + 1);
			startTimer(workout.exerciseTime * 1000);
			play(sounds.whistle);
		} else if (stage === 'restBetweenRounds') {
			setStage('exercise');
			setCurrentExerciseIndex(0);
			setRoundIndex(r => r + 1);
			setNextExercise(workout.exercises[1]?.name || '');
			startTimer(workout.exerciseTime * 1000);
			play(sounds.whistle);
		} else if (stage === 'complete') {
			nav('/workouts');
		}
	}, [timeLeft, isActive, stage, workout, currentExerciseIndex, roundIndex, nav]);

	useEffect(() => () => {
		if (intervalRef.current) window.clearInterval(intervalRef.current);
	}, []);

	if (!workout) return <p>Loading...</p>;

	// const btnText = !isActive ? t('timer.start') : isPaused ? t('timer.resume') : t('timer.pause');
	const mm = Math.floor(timeLeft / 60000);
	const ss = String(Math.floor((timeLeft % 60000) / 1000)).padStart(2, '0');

	return (
		<div style={{display: 'grid', justifyItems: 'center', gap: 16}}>
			<h3>{workout.name}</h3>
			<h1>{stageLabel}</h1>
			<div style={{fontSize: 48}}>{mm}:{ss}</div>
			<button className="btn" onClick={handleStartPause}>
				{/*{btnText}*/}
				{/*{!isActive ? <Play/> : <Pause/>}*/}
				{!isActive ? <Play/> : isPaused ? <Play/> : <Pause/>}
			</button>
			<h2>
				{(stage === 'rest' || stage === 'restBetweenRounds' || stage === 'warmup')
					? `${t('timer.next')}: ${nextExercise}`
					: t('timer.justDoIt')
				}
			</h2>
		</div>
	);
}
