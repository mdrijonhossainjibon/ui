import { estimateUnitValue, estimateValue } from 'helpers/estimateValue';
import { useCurrenciesFetch, useMarketsFetch, useMarketsTickersFetch, useWalletsFetch } from 'hooks';
import { selectCurrencies, selectMarkets, selectMarketTickers, selectWallets } from 'modules';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { VALUATION_PRIMARY_CURRENCY, VALUATION_SECONDARY_CURRENCY } from '../../../constants';

const EstimatedValue = React.memo(() => {
	const wallets = useSelector(selectWallets);
	const markets = useSelector(selectMarkets);
	const currencies = useSelector(selectCurrencies);
	const tickers = useSelector(selectMarketTickers);
	const estimatedValue = estimateValue(VALUATION_PRIMARY_CURRENCY, currencies, wallets, markets, tickers);
	const estimatedSecondaryValue = estimateUnitValue(
		VALUATION_SECONDARY_CURRENCY,
		VALUATION_PRIMARY_CURRENCY,
		+estimatedValue,
		currencies,
		markets,
		tickers,
	);

	useWalletsFetch();
	useMarketsFetch();
	useCurrenciesFetch();
	useMarketsTickersFetch();

	return (
		<div className="td-mobile-cpn-estimated-value">
			<div className="td-mobile-cpn-estimated-value__body">
				<div className="td-mobile-cpn-estimated-value__body-wrap">
					<span className="td-mobile-cpn-estimated-value__body-number">{estimatedValue}</span>
					<span className="td-mobile-cpn-estimated-value__body-currency">
						{VALUATION_PRIMARY_CURRENCY.toUpperCase()}
					</span>
				</div>
				<div className="td-mobile-cpn-estimated-value__body-wrap">
					<span className="td-mobile-cpn-estimated-value__body-number">{estimatedSecondaryValue}</span>
					<span className="td-mobile-cpn-estimated-value__body-currency">
						{VALUATION_SECONDARY_CURRENCY.toUpperCase()}
					</span>
				</div>
			</div>
		</div>
	);
});

export { EstimatedValue };
