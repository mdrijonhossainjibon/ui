import classNames from 'classnames';
import { Decimal, TableTrading } from 'components';
import { localeDate } from 'helpers';
import { PublicTrade, selectCurrentMarket, selectCurrentPrice, setCurrentPrice } from 'modules';
import { recentTradesFetch, selectRecentTradesOfCurrentMarket } from 'modules/public/recentTrades';
import * as React from 'react';
import isEqual from 'react-fast-compare';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

const handleHighlightValue = (prevValue: string, curValue: string) => {
	let highlighted = '';
	let val = curValue;
	let prev = prevValue;

	while (val !== prev && val.length > 0) {
		highlighted = val[val.length - 1] + highlighted;
		val = val.slice(0, -1);
		prev = prev.slice(0, -1);
	}

	return (
		<React.Fragment>
			<span className="td-decimal__opacity">{val}</span>
			<span>{highlighted}</span>
		</React.Fragment>
	);
};

const RecentTradesMarketContainer: React.FC = () => {
	const dispatch = useDispatch();
	const intl = useIntl();

	const recentTrades = useSelector(selectRecentTradesOfCurrentMarket, isEqual);
	const currentMarket = useSelector(selectCurrentMarket, isEqual);
	const currentPrice = useSelector(selectCurrentPrice, isEqual);

	React.useEffect(() => {
		if (currentMarket) {
			dispatch(recentTradesFetch(currentMarket));
		}
	}, [currentMarket]);

	const getHeaders = () => {
		const titleColPrice = `${intl.formatMessage({ id: 'page.body.trade.header.recentTrades.content.price' })}${
			currentMarket ? `(${currentMarket.quote_unit.toUpperCase()})` : ''
		}`;
		const titleColAmount = `${intl.formatMessage({ id: 'page.body.trade.header.recentTrades.content.amount' })}${
			currentMarket ? `(${currentMarket.base_unit.toUpperCase()})` : ''
		}`;
		const titleColTime = intl.formatMessage({ id: 'page.body.trade.header.recentTrades.content.time' });

		return [titleColPrice, titleColAmount, titleColTime];
	};

	const getTrades = (trades: PublicTrade[]) => {
		const priceFixed = currentMarket ? currentMarket.price_precision : 0;
		const amountFixed = currentMarket ? currentMarket.amount_precision : 0;

		const renderRow = (item, i) => {
			const { created_at, taker_type, price, amount } = item;
			const higlightedDate = handleHighlightValue(
				String(localeDate(trades[i - 1] ? trades[i - 1].created_at : '', 'time')),
				String(localeDate(created_at, 'time')),
			);

			const isPositive = taker_type === 'sell';

			const classname = classNames({
				'td-recent-trades__markets__positive': isPositive,
				'td-recent-trades__markets__negative': !isPositive,
			});

			return [
				<span className={classname} key={i}>
					{Decimal.formatRemoveZero(price, priceFixed)}
				</span>,
				<span key={i}>{Decimal.formatRemoveZero(amount, amountFixed)}</span>,
				<span key={i}>{higlightedDate}</span>,
			];
		};

		return trades.length > 0 ? trades.map(renderRow) : [[[''], intl.formatMessage({ id: 'page.noDataToShow' }), ['']]];
	};

	const handleOnSelect = (index: string) => {
		const priceToSet = recentTrades[Number(index)] ? Number(recentTrades[Number(index)].price) : 0;

		if (currentPrice !== priceToSet) {
			dispatch(setCurrentPrice(priceToSet));
		}
	};

	return (
		<div className="td-recent-trades__markets">
			<TableTrading data={getTrades(recentTrades)} header={getHeaders()} onSelect={handleOnSelect} />
		</div>
	);
};

const RecentTradesMarket = RecentTradesMarketContainer;

export { handleHighlightValue, RecentTradesMarket };
