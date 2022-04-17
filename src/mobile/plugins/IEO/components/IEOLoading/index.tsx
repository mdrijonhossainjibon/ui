import React from 'react';
interface IEOLoadingProps {
	className?: string;
}
export const IEOLoading: React.FC<IEOLoadingProps> = props => {
	const { className } = props;
	return (
		<div className={`spinner-border text-warning  ${className || ''}`} role="status">
			<span className="sr-only">Loading...</span>
		</div>
	);
};
