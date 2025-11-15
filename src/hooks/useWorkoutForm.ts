import {useState} from 'react';

export interface WorkoutFormData {
	name: string;
	exercises: { name: string }[];
	warmupTime: number;
	exerciseTime: number;
	restTime: number;
	rounds: number;
	restBetweenRounds: number;
}

export const useWorkoutForm = (initialData?: Partial<WorkoutFormData>) => {
	const [form, setForm] = useState<WorkoutFormData>({
		name: '',
		exercises: [{name: ''}],
		warmupTime: 5,
		exerciseTime: 30,
		restTime: 15,
		rounds: 3,
		restBetweenRounds: 30,
		...initialData
	});

	const [activeTab, setActiveTab] = useState(0);
	const [error, setError] = useState('');

	const setField = (name: string, value: number | string) => {
		setForm(prev => ({...prev, [name]: value}));
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {name, value} = e.target;
		setField(name, name === 'rounds' || name.includes('Time') ? Number(value) : value);
	};

	const handleExerciseChange = (index: number, value: string) => {
		const newExercises = form.exercises.map((exercise, i) =>
			i === index ? {...exercise, name: value} : exercise
		);
		setForm(prev => ({...prev, exercises: newExercises}));
	};

	const addExercise = () => {
		setForm(prev => ({
			...prev,
			exercises: [...prev.exercises, {name: ''}]
		}));
	};

	const removeExercise = (index: number) => {
		if (form.exercises.length > 1) {
			setForm(prev => ({
				...prev,
				exercises: prev.exercises.filter((_, i) => i !== index)
			}));
		}
	};

	const isFirstTabValid = () => {
		return form.name.trim() !== '' &&
			form.warmupTime >= 5 &&
			form.exerciseTime >= 5 &&
			form.restTime >= 5 &&
			form.rounds >= 1 &&
			form.restBetweenRounds >= 5;
	};

	const isSecondTabValid = () => {
		return form.exercises.some(ex => ex.name.trim() !== '');
	};

	const getExercisesToSave = () => {
		return form.exercises.filter(ex => ex.name.trim() !== '');
	};

	return {
		form,
		setForm,
		activeTab,
		setActiveTab,
		error,
		setError,
		setField,
		handleChange,
		handleExerciseChange,
		addExercise,
		removeExercise,
		isFirstTabValid,
		isSecondTabValid,
		getExercisesToSave
	};
};
