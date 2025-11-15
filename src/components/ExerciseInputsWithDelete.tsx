import {useTranslation} from "react-i18next";

export const ExerciseInputsWithDelete = ({
																		exercises,
																		onChange,
																		onAdd,
																		onRemove
																	}: {
	exercises: { name: string }[];
	onChange: (index: number, value: string) => void;
	onAdd: () => void;
	onRemove: (index: number) => void;
}) => {
	const {t} = useTranslation();

	return (
		<div style={{marginBottom: '16px'}}>
			<label style={{display: 'block', marginBottom: '16px', fontWeight: '600'}}>
				{t('workouts.exercises')}
			</label>

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
					/>
					{exercises.length > 1 && (
						<button
							className="btn"
							onClick={() => onRemove(index)}
							style={{
								width: '44px',
								background: 'var(--danger)',
								color: 'white'
							}}
							type="button"
						>
							×
						</button>
					)}
				</div>
			))}

			<button
				className="btn"
				onClick={onAdd}
				style={{width: '100%'}}
				type="button"
			>
				+ {t('workouts.addExercise')}
			</button>
		</div>
	)
}
