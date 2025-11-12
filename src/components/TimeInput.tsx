import React from 'react';
import {useTranslation} from 'react-i18next';


export default function TimeInput({
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
}) {
	const {t} = useTranslation();
	return (
		<div style={{marginBottom: 12}}>
			<label htmlFor={name}>{t(labelKey)} </label>
			<input
				className="input"
				type="number"
				id={name}
				name={name}
				value={value}
				min={min}
				onChange={onChange}
				style={{borderColor: hasError ? 'red' as const : '#ccc'}}
			/>
			{hasError && <p style={{color: 'red', margin: '4px 0 0'}}>{t('fields.minHint', {min})}</p>}
		</div>
	);
}
