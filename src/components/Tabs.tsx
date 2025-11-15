import React from 'react';

interface TabsProps {
	activeTab: number;
	onTabChange: (tab: number) => void;
	tabs: string[];
}

export default function Tabs({ activeTab, onTabChange, tabs }: TabsProps) {
	return (
		<div style={{
			display: 'flex',
			marginBottom: '24px',
			background: 'var(--surface)',
			borderRadius: 'var(--border-radius)',
			padding: '4px',
			boxShadow: 'var(--inner-shadow)'
		}}>
			{tabs.map((tab, index) => (
				<button
					key={index}
					onClick={() => onTabChange(index)}
					className="btn"
					style={{
						flex: 1,
						background: activeTab === index ? 'var(--primary)' : 'transparent',
						color: activeTab === index ? 'white' : 'var(--text)',
						boxShadow: 'none',
						border: 'none',
						borderRadius: '12px',
						fontWeight: activeTab === index ? '600' : '400',
						transition: 'all 0.3s ease'
					}}
				>
					{tab}
				</button>
			))}
		</div>
	);
}
