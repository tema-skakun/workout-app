import React from 'react';
import {useTranslation} from 'react-i18next';

interface TimeInputProps {
	labelKey: string;
	name: string;
	value: number;
	min: number;
	max: number;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	hasError?: boolean;
	unit?: 'seconds' | 'pieces';
}

const TimeInput = ({
										 labelKey,
										 name,
										 value,
										 min,
										 max,
										 onChange,
										 hasError,
										 unit = 'seconds'
									 }: TimeInputProps) => {
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

	// Определяем отображаемую единицу измерения
	const displayUnit = unit === 'pieces'
		? t('fields.piecesShort', 'шт')
		: t('fields.secondsShort', 'с');

	return (
		<div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12}}>
			<label htmlFor={name} style={{display: 'block', marginBottom: 4, fontSize: '14px'}}>
				{t(labelKey)}
			</label>
			<input
				className="input small"
				type="number"
				id={name}
				name={name}
				value={value}
				min={min}
				max={max}
				onChange={handleChange}
				style={{
					borderColor: hasError ? 'red' : '#ccc',
					width: '85px',
				}}
			/>
			<span style={{color: 'var(--text-light)', fontSize: '13px', minWidth: '20px'}}>
        {displayUnit}
      </span>
			{hasError && (
				<p style={{color: 'red', margin: '4px 0 0', fontSize: '12px'}}>
					{value < min ? t('fields.minHint', {min}) : t('fields.maxHint', {max})}
				</p>
			)}
		</div>
	);
}

export default TimeInput;
