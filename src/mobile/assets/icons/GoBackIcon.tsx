import React, { FC } from 'react';

export const GoBackIcon:FC<{
	className?: string;
	onClick?: () => void;
}> = ({className, onClick}) => {
	return (
		<svg
			onClick={onClick}
			className={className}
			xmlns="http://www.w3.org/2000/svg"
			width="18"
			height="12"
			fill="none"
			viewBox="0 0 18 12"
		>
			<path fill="#fff" d="M18 5H3.83l3.58-3.59L6 0 0 6l6 6 1.41-1.41L3.83 7H18V5z"></path>
		</svg>
	);
};
