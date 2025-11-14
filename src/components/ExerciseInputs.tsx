import {Plus} from '@/svg/plus';
import {useTranslation} from "react-i18next";


export default function ExerciseInputs({
																				 exercises,
																				 autoFocus,
																				 onChange,
																				 onAdd
																			 }: {
	exercises: { name: string }[];
	autoFocus?: boolean;
	onChange: (index: number, value: string) => void;
	onAdd: () => void;
}) {
	const {t} = useTranslation();

	return (
		<div style={{marginBottom: '16px'}}>
			<label style={{display: 'block', marginBottom: '8px', fontWeight: '600'}}>
				{t('workouts.exercises')}
			</label>
			{exercises.map((exercise, index) => (
				<div key={index} style={{marginBottom: 8}}>
					<input
						className="input"
						type="text"
						value={exercise.name}
						onChange={(e) => onChange(index, e.target.value)}
						placeholder={`${t('workouts.exercise')} ${index + 1}`}
						autoFocus
						style={{flex: 1}}
					/>
				</div>
			))}
			<button className="btn" onClick={onAdd}>
				<Plus/>
			</button>
		</div>
	);
}
