import * as React from 'react';

interface OrderBookSvgProps {
	active?: boolean;
}

type Props = React.SVGProps<SVGSVGElement> & OrderBookSvgProps;

export const OrderBookSvg: React.FC<Props> = ({ active, ...props }) => (
	<svg width={31} height={22} viewBox="0 0 31 22" fill="none" {...props}>
		<rect width={31} height={22} rx={3} fill={active ? '#848E9C' : 'none'} fillOpacity={0.35} />
		<path d="M26.1525 6.69221H13.1908V7.52295H26.1525V6.69221Z" fill="#848E9C" />
		<path d="M26.1525 8.8537H13.1908V9.68443H26.1525V8.8537Z" fill="#848E9C" />
		<path d="M26.1525 11.0156H13.1908V11.8463H26.1525V11.0156Z" fill="#848E9C" />
		<path d="M26.1525 13.1775H13.1908V14.0082H26.1525V13.1775Z" fill="#848E9C" />
		<path d="M26.1525 5.17213H11.1075V6.00287H26.1525V5.17213Z" fill="#E01F5B" />
		<path d="M3.85791 5.58771L7.41291 3.34344L11.3112 5.58771" stroke="#E01F5B" strokeMiterlimit={10} />
		<path d="M26.1525 15.2094H11.1075V16.0402H26.1525V15.2094Z" fill="#2EB67E" />
		<path d="M3.85791 15.6246L7.41291 17.8688L11.3112 15.6246" stroke="#2EB67E" strokeMiterlimit={10} />
	</svg>
);

export const OrderBookBuySvg: React.FC<Props> = ({ active, ...props }) => (
	<svg width={31} height={22} viewBox="0 0 31 22" fill="none" {...props}>
		<rect width={31} height={22} rx={3} fill={active ? '#848E9C' : 'none'} fillOpacity={0.35} />
		<path d="M26.1525 6.69221H13.1908V7.52295H26.1525V6.69221Z" fill="#848E9C" />
		<path d="M26.1525 8.8537H13.1908V9.68443H26.1525V8.8537Z" fill="#848E9C" />
		<path d="M26.1525 11.0156H13.1908V11.8463H26.1525V11.0156Z" fill="#848E9C" />
		<path d="M26.1525 13.1775H13.1908V14.0082H26.1525V13.1775Z" fill="#848E9C" />
		<path d="M26.1525 5.17213H11.1075V6.00287H26.1525V5.17213Z" fill="#848E9C" />
		<path d="M3.85791 5.58771L7.41291 3.34344L11.3112 5.58771" stroke="#848E9C" strokeMiterlimit={10} />
		<path d="M26.1525 15.2094H11.1075V16.0402H26.1525V15.2094Z" fill="#2EB67E" />
		<path d="M3.85791 15.6246L7.41291 17.8688L11.3112 15.6246" stroke="#2EB67E" strokeMiterlimit={10} />
	</svg>
);

export const OrderBookSellSvg: React.FC<Props> = ({ active, ...props }) => (
	<svg width={31} height={22} viewBox="0 0 31 22" fill="none" {...props}>
		<rect width={31} height={22} rx={3} fill={active ? '#848E9C' : 'none'} fillOpacity={0.35} />
		<path d="M26.1525 6.69221H13.1908V7.52295H26.1525V6.69221Z" fill="#848E9C" />
		<path d="M26.1525 8.8537H13.1908V9.68443H26.1525V8.8537Z" fill="#848E9C" />
		<path d="M26.1525 11.0156H13.1908V11.8463H26.1525V11.0156Z" fill="#848E9C" />
		<path d="M26.1525 13.1775H13.1908V14.0082H26.1525V13.1775Z" fill="#848E9C" />
		<path d="M26.1525 5.17213H11.1075V6.00287H26.1525V5.17213Z" fill="#E01F5B" />
		<path d="M3.85791 5.58771L7.41291 3.34344L11.3112 5.58771" stroke="#E01F5B" strokeMiterlimit={10} />
		<path d="M26.1525 15.2094H11.1075V16.0402H26.1525V15.2094Z" fill="#848E9C" />
		<path d="M3.85791 15.6246L7.41291 17.8688L11.3112 15.6246" stroke="#848E9C" strokeMiterlimit={10} />
	</svg>
);
