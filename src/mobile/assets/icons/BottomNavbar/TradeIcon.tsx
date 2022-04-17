import React from 'react';

interface IconProps {
	className?: string;
	active?: boolean;
}

export const TradeIcon: React.FC<IconProps> = ({ className, active }) => {
	const color = active ? '#fff' : '#FFB800';
	const bgColor = active ? '#FFB800' : '#fff';

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			style={{
				backgroundColor: bgColor,
			}}
			width="20"
			height="17"
			fill="none"
			viewBox="0 0 20 17"
			className={className}
		>
			<path fill={color} d="M4.4 5.2H20v2.4H0L4.4 0h2.4L4.4 5.2zM15.6 11.2H0V8.8h20l-4.4 7.6h-2.4l2.4-5.2z"></path>
		</svg>
	);
};
