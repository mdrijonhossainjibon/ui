import classNames from 'classnames';
import { Market } from 'modules';
import React from 'react';
import { FaStar } from 'react-icons/fa';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Decimal } from '../../../components';
import { selectMarketTickers, setCurrentMarket, Ticker } from '../../../modules/public/markets';

const defaultTicker: Ticker = {
	amount: '0.0',
	last: '0.0',
	high: '0.0',
	open: '0.0',
	low: '0.0',
	price_change_percent: '+0.00%',
	volume: '0.0',
	avg_price: '0',
};

interface MarketItem {
	market: Market;
	favorites?: any;
	onchangeFavorite: () => void;
	hideFavorite?: boolean;
}

export const RowTable: React.FC<MarketItem> = ({ market, favorites, onchangeFavorite, hideFavorite }) => {
	const intl = useIntl();
	const history = useHistory();
	const tickers = useSelector(selectMarketTickers);
	const dispatch = useDispatch();

	const redirectToTrading = paramMarket => {
		dispatch(setCurrentMarket(paramMarket));
		history.push(`/market/${paramMarket.id}`);
	};

	const ticker = tickers[market.id] || defaultTicker;
	const marketTickerChange = +(+ticker.last - +ticker.open).toFixed(market.price_precision);

	const marketChangeBtnClass = classNames('d-flex justify-content-end td-mobile-cpn-market-list__body__markets__item__btn', {
		'td-mobile-cpn-market-list__body__markets__item__btn--false': (+marketTickerChange || 0) < 0,
	});

	const classOfFavorites = classNames('pr-1 pl-1', {
		'td-mobile-cpn-market-list__body__markets__item__start-favorites': favorites,
		'd-none': hideFavorite,
	});

	const setListFavorites = (id: string) => {
		const local = localStorage.getItem('favourites_markets') || '[]';
		const favouritesMarkets = JSON.parse(local);

		const foundFavoriteMarketIndex = favouritesMarkets.findIndex(
			(marketId: string) => marketId.toLowerCase() === id.toLowerCase(),
		);
		if (foundFavoriteMarketIndex >= 0) {
			favouritesMarkets.splice(foundFavoriteMarketIndex, 1);
			localStorage.setItem('favourites_markets', JSON.stringify(favouritesMarkets));
		} else {
			favouritesMarkets.push(id);
			localStorage.setItem('favourites_markets', JSON.stringify(favouritesMarkets));
		}
		// tslint:disable-next-line: no-unused-expression
		onchangeFavorite();
	};

	return (
		<tr className="td-mobile-cpn-market-list__body__markets__item">
			<td onClick={() => (hideFavorite ? redirectToTrading(market) : {})}>
				<div className="d-flex flex-row align-items-center">
					<div className={classOfFavorites} onClick={() => setListFavorites(market.id)}>
						<FaStar />
					</div>
					<div
						className="td-mobile-cpn-market-list__body__markets__item__pairs d-flex flex-column"
						onClick={() => redirectToTrading(market)}
					>
						<div>
							<span className="td-mobile-cpn-market-list__body__markets__item__pairs__first">
								{market.name.split('/')[0]}
							</span>
							<span className="td-mobile-cpn-market-list__body__markets__item__pairs__second">
								/{market.name.split('/')[1]}
							</span>
							{/* <span className="td-mobile-cpn-market-list__body__markets__item__pairs__margin">5x</span> */}
						</div>

						<div className="td-mobile-cpn-market-list__body__markets__item__pairs__vol">
							{intl.formatMessage({ id: 'page.mobile.currentMarketInfo.volume' })}{' '}
							{Decimal.format(ticker.volume, 6, ',')}
						</div>
					</div>
				</div>
			</td>

			<td onClick={() => redirectToTrading(market)}>
				<div className="d-flex justify-content-end">
					<div className="td-mobile-cpn-market-list__body__markets__item__price d-flex flex-column text-right">
						<div className="td-mobile-cpn-market-list__body__markets__item__price__volume">
							{Decimal.format(ticker.last, market.price_precision, ',')}
						</div>

						<div className="td-mobile-cpn-market-list__body__markets__item__price__volume-last">
							&asymp;{Decimal.format(ticker.last, 4, ',')}
						</div>
					</div>
				</div>
			</td>

			<td onClick={() => redirectToTrading(market)}>
				<div className={marketChangeBtnClass}>
					<button type="button" className="btn btn-primary">
						{ticker.price_change_percent}
					</button>
				</div>
			</td>
		</tr>
	);
};
