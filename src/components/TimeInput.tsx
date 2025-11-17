import React from 'react';
import {useTranslation} from 'react-i18next';

const TimeInput = ({
										 labelKey,
										 name,
										 value,
										 min,
										 onChange,
										 hasError
									 }: {
	labelKey: string;
	name: string;
	value: number;
	min: number;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	hasError?: boolean;
}) => {
	const {t} = useTranslation();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// Запрещаем ввод нуля как первого символа
		const inputValue = e.target.value;
		if (inputValue.startsWith('0') && inputValue.length > 1) {
			// Если ввели "05", убираем ведущий ноль и передаём "5"
			e.target.value = inputValue.replace(/^0+/, '') || min.toString();
		}
		onChange(e);
	};

	return (
		<div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12}}>
			<label htmlFor={name} style={{display: 'block', marginBottom: 4}}>
				{t(labelKey)}
			</label>
			<input
				className="input"
				type="number"
				id={name}
				name={name}
				value={value}
				min={min}
				onChange={handleChange}
				style={{
					borderColor: hasError ? 'red' : '#ccc',
					width: '85px',
				}}
			/>
			<span style={{color: 'var(--text-light)', fontSize: '14px'}}>
          с
        </span>
			{hasError && <p style={{color: 'red', margin: '4px 0 0'}}>{t('fields.minHint', {min})}</p>}
		</div>
	);
}

export default TimeInput;
