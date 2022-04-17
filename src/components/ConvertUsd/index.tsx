import { useConvertToUSD } from 'hooks';
import * as React from 'react';

// tslint:disable-next-line: no-empty-interface
interface ConvertUsdProps {
	value: number;
	precision?: number;
	symbol: string;
	defaultValue?: string;
}

export const ConvertUsd: React.FC<ConvertUsdProps> = ({ value, symbol, precision, defaultValue }) => {

	const price = useConvertToUSD(value, symbol, precision, defaultValue);
	return <>{price}</>;
};
