import React from 'react';
import {useTranslation} from 'react-i18next';

interface ConfirmModalProps {
	isOpen: boolean;
	title: string;
	message: string;
	onConfirm: () => void;
	onCancel: () => void;
	confirmText?: string;
	cancelText?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
																														isOpen,
																														title,
																														message,
																														onConfirm,
																														onCancel,
																														confirmText,
																														cancelText
																													}) => {
	const {t} = useTranslation();

	if (!isOpen) return null;

	return (
		<div style={{
			position: 'fixed',
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			backgroundColor: 'rgba(0, 0, 0, 0.5)',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			zIndex: 1000,
			padding: '16px'
		}}>
			<div style={{
				background: 'var(--surface)',
				borderRadius: 'var(--border-radius)',
				boxShadow: 'var(--shadow)',
				padding: '24px',
				maxWidth: '400px',
				width: '100%'
			}}>
				<h3 style={{margin: '0 0 16px 0', color: 'var(--text)'}}>
					{title}
				</h3>

				<p style={{
					margin: '0 0 24px 0',
					color: 'var(--text-light)',
					lineHeight: '1.5'
				}}>
					{message}
				</p>

				<div style={{
					display: 'flex',
					gap: '12px',
					justifyContent: 'flex-end'
				}}>
					<button
						className="btn"
						onClick={onCancel}
						style={{
							background: 'var(--surface)',
							color: 'var(--text)'
						}}
					>
						{cancelText || t('common.cancel')}
					</button>
					<button
						className="btn"
						onClick={onConfirm}
						style={{
							background: 'var(--danger)',
							color: 'white'
						}}
					>
						{confirmText || t('deleteConfirm.yes')}
					</button>
				</div>
			</div>
		</div>
	);
};
