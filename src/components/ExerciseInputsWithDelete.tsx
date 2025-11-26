import {useTranslation} from "react-i18next";
import {Cross} from "@/svg/cross";
import {Plus} from "@/svg/plus";

interface ExerciseInputsWithDeleteProps {
	exercises: { name: string }[];
	onChange: (index: number, value: string) => void;
	onAdd: () => void;
	onRemove: (index: number) => void;
}

export const ExerciseInputsWithDelete = ({
																					 exercises,
																					 onChange,
																					 onAdd,
																					 onRemove
																				 }: ExerciseInputsWithDeleteProps) => {
	const {t} = useTranslation();

	return (
		<div style={{marginBottom: '12px', padding: '10px'}}>
			{exercises.map((exercise, index) => (
				<div key={index} style={{
					display: 'flex',
					gap: '6px',
					marginBottom: '8px',
					alignItems: 'center'
				}}>
					<input
						className="input small"
						type="text"
						value={exercise.name}
						onChange={(e) => onChange(index, e.target.value)}
						placeholder={`${t('workouts.exercise')} ${index + 1}`}
						maxLength={20}
						style={{flex: 1, height: '36px'}}
						autoFocus
					/>
					<button
						disabled={exercises.length <= 1}
						className="btn small"
						onClick={() => onRemove(index)}
						style={{
							width: '36px',
							height: '36px',
							background: exercises.length <= 1 ? 'var(--text-light)' : 'var(--danger)',
							color: 'white',
							padding: '6px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center'
						}}
						type="button"
					>
						<Cross height={14} width={14} fill='var(--bg)'/>
					</button>
				</div>
			))}

			<button
				className="btn small"
				onClick={onAdd}
				style={{
					width: '100%',
					height: '36px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					gap: '6px'
				}}
				type="button"
			>
				<Plus height={14} width={14}/> {t('workouts.addExercise')}
			</button>
		</div>
	);
};
