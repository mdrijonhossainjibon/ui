import classNames from 'classnames';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Decimal } from '../../../components';
import { Market, selectMarkets, selectMarketTickers, setCurrentMarket } from '../../../modules/public/markets';

const DEFAULT_TICKER = {
	amount: '0.0',
	last: '0.0',
	high: '0.0',
	open: '0.0',
	low: '0.0',
	price_change_percent: '+0.00%',
	volume: '0.0',
	avg_price: '0',
};

const MarketsTopComponent: React.FC = () => {
	const markets = useSelector(selectMarkets);
	const tickers = useSelector(selectMarketTickers);
	const dispatch = useDispatch();
	const history = useHistory();

	const redirectToTrading = (paramMarket: Market) => {
		dispatch(setCurrentMarket(paramMarket));
		history.push(`/trading/${paramMarket.id}`);
	};

	const renderElem = (market, ticker, key) => {
		const marketTickerChange = +(+ticker.last - +ticker.open).toFixed(market.price_precision);
		const marketChangeClass = classNames('', {
			'market-change--positive': (+marketTickerChange || 0) >= 0,
			'market-change--negative': (+marketTickerChange || 0) < 0,
		});

		return (
			<div
				className="td-mobile-screen-home__market-top__list-item__item"
				key={key}
				onClick={() => redirectToTrading(market)}
			>
				<span className="td-mobile-screen-home__market-top__list-item__item__first">
					{market.name.split('/')[0]}/{market.name.split('/')[1]}{' '}
					<span className={`td-mobile-screen-home__market-top__list-item__item__first__persen ${marketChangeClass} `}>
						{ticker.price_change_percent}
					</span>
				</span>
				<span className={`td-mobile-screen-home__market-top__list-item__item__second ${marketChangeClass}`}>
					{Decimal.format(ticker.last, market.price_precision, ',')}
				</span>
				<span className="td-mobile-screen-home__market-top__list-item__item__third">
					&asymp;{Decimal.format(ticker.last, 4, ',')}
				</span>
			</div>
		);
	};

	const renderListElm = markets.map((market, i) => {
		const ticker = tickers[market.id] || DEFAULT_TICKER;

		return renderElem(market, ticker, i);
	});

	return (
		<div className="td-mobile-screen-home__market-top">
			<div className="td-mobile-screen-home__market-top__list-item">{renderListElm}</div>
		</div>
	);
};

export const MarketsTop = React.memo(MarketsTopComponent);
