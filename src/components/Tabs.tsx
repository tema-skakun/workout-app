import React from 'react';

interface TabsProps {
	activeTab: number;
	onTabChange: (tab: number) => void;
	tabs: string[];
	disabledTabs?: boolean[]; // Добавляем проп для disabled состояний
}

export default function Tabs({activeTab, onTabChange, tabs, disabledTabs = []}: TabsProps) {
	return (
		<div style={{
			display: 'flex',
			marginBottom: '24px',
			background: 'var(--surface)',
			borderRadius: 'var(--border-radius)',
			padding: '4px',
			boxShadow: 'var(--inner-shadow)'
		}}>
			{tabs.map((tab, index) => {
				const isDisabled = disabledTabs[index];

				return (
					<button
						key={index}
						onClick={() => !isDisabled && onTabChange(index)}
						className="btn"
						disabled={isDisabled}
						style={{
							flex: 1,
							background: activeTab === index ? 'var(--primary)' : 'transparent',
							color: activeTab === index ? 'white' : isDisabled ? 'var(--text-light)' : 'var(--text)',
							boxShadow: 'none',
							border: 'none',
							borderRadius: '12px',
							fontWeight: activeTab === index ? '600' : '400',
							transition: 'all 0.3s ease',
							cursor: isDisabled ? 'not-allowed' : 'pointer',
							opacity: isDisabled ? 0.5 : 1
						}}
					>
						{tab}
					</button>
				);
			})}
		</div>
	);
}
