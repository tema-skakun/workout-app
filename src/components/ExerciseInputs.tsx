import React from 'react';
import {Plus} from '@/svg/plus';


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
	return (
		<div>
			{exercises.map((exercise, index) => (
				<div key={index} style={{marginBottom: 8}}>
					<input
						className="input"
						type="text"
						value={exercise.name}
						onChange={(e) => onChange(index, e.target.value)}
						placeholder="Exercise Name"
						autoFocus={autoFocus && index === 0}
					/>
				</div>
			))}
			<button className="btn" onClick={onAdd}>
				<Plus/>
			</button>
		</div>
	);
}
