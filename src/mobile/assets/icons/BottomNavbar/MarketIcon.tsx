import React from 'react';

interface IconProps {
	className?: string;
	active?: boolean;
}

export const MarketIcon: React.FC<IconProps> = ({ className, active }) => {
	const color = active ? '#FFB800' : '#fff';

	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="17" height="19" fill="none" viewBox="0 0 17 19" className={className}>
			<path fill={color} d="M0 7.352H3.676V18.380000000000003H0z"></path>
			<path fill={color} d="M6.433 0H10.109V18.38H6.433z"></path>
			<path fill={color} d="M12.866 3.676H16.542V18.380000000000003H12.866z"></path>
		</svg>
	);
};
