import React from 'react';

interface IconProps {
	className?: string;
	active?: boolean;
}

export const WalletIcon: React.FC<IconProps> = ({ className, active }) => {
	const color = active ? '#FFB800' : '#fff';

	return (
		<svg width={22} height={20} viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
			<g clipPath="url(#prefix__clip0)" fill={color}>
				<path d="M14.013 9.928c0-2.446 1.962-4.46 4.344-4.46H22V1.15c0-.72-.56-1.295-1.261-1.295H1.26C.561 0 0 .576 0 1.295v17.41C0 19.425.56 20 1.261 20H20.74c.7 0 1.261-.576 1.261-1.295v-4.316h-3.643c-2.382 0-4.344-2.015-4.344-4.46z" />
				<path d="M18.637 6.33c-2.102 0-3.784 1.584-3.784 3.742 0 2.014 1.682 3.74 3.784 3.74h3.223V6.332h-3.223zm-.42 4.461c-.42 0-.841-.431-.841-.863s.42-.863.84-.863c.421 0 .841.431.841.863 0 .576-.42.863-.84.863z" />
			</g>
			<defs>
				<clipPath id="prefix__clip0">
					<path fill={color} d="M0 0h22v20H0z" />
				</clipPath>
			</defs>
		</svg>
	);
};
