import {useTranslation} from "react-i18next";
import {Plus} from "../svg/plus";
import {Cross} from "../svg/cross";

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
		<div style={{marginBottom: '16px', padding: '15px'}}>
			{exercises.map((exercise, index) => (
				<div key={index} style={{
					display: 'flex',
					gap: '8px',
					marginBottom: '12px',
					alignItems: 'center'
				}}>
					<input
						className="input"
						type="text"
						value={exercise.name}
						onChange={(e) => onChange(index, e.target.value)}
						placeholder={`${t('workouts.exercise')} ${index + 1}`}
						style={{flex: 1}}
						autoFocus
					/>
					<button
						disabled={exercises.length <= 1}
						className="btn"
						onClick={() => onRemove(index)}
						style={{
							width: '44px',
							background: 'var(--danger)',
							color: 'white'
						}}
						type="button"
					>
						<Cross height={15} width={15} fill='var(--bg)'/>
					</button>
				</div>
			))}

			<button
				className="btn"
				onClick={onAdd}
				style={{width: '100%'}}
				type="button"
			>
				<Plus height={15} width={15}/> {t('workouts.addExercise')}
			</button>
		</div>
	);
};
