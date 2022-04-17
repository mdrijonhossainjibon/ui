import { Decimal } from 'components';
import { selectCurrencies } from 'modules';
import { useSelector } from 'react-redux';

export const useConvertToUSD = (value = 0, symbol?: string, precision = 6, defaultValue = '0.00') => {
	const currencies = useSelector(selectCurrencies);

	const currency = currencies.find(e => e.id.toLowerCase() === symbol?.toLowerCase());

	return currency === undefined ? defaultValue : Decimal.formatRemoveZero(currency.price * value, precision);
};
