import React from 'react';
import {useTranslation} from 'react-i18next';

interface TimerDisplayProps {
	timeLeft: number;
	stage: string;
	isActive: boolean;
	isPaused: boolean;
	onStartPause: () => void;
}

export default function TimerDisplay({
																			 timeLeft,
																			 stage,
																			 isActive,
																			 isPaused,
																			 onStartPause
																		 }: TimerDisplayProps) {
	const {t} = useTranslation();

	const minutes = Math.floor(timeLeft / 60000);
	const seconds = Math.floor((timeLeft % 60000) / 1000);

	const getStageColor = () => {
		switch (stage) {
			case 'warmup':
				return 'var(--warning)';
			case 'exercise':
				return 'var(--primary)';
			case 'rest':
				return 'var(--success)';
			case 'restBetweenRounds':
				return 'var(--success)';
			default:
				return 'var(--text)';
		}
	};

	return (
		<div className="card" style={{textAlign: 'center'}}>
			<div
				className="stage-label"
				style={{color: getStageColor()}}
			>
				{t(`timer.${stage}`)}
			</div>

			<div className="timer-display">
				{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
			</div>

			<button
				className={`btn primary`}
				onClick={onStartPause}
				style={{width: '100%'}}
			>
				{!isActive ? t('timer.start') : isPaused ? t('timer.resume') : t('timer.pause')}
			</button>
		</div>
	);
}
