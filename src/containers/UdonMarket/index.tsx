import * as React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ConvertUsd, Decimal, NewMarketTable } from '../../components';

import { useMarketsFetch, useMarketsTickersFetch, useRangerConnectFetch } from '../../hooks';
import { Market, selectMarkets, selectMarketTickers, setCurrentMarket, selectCurrencies } from '../../modules';

const defaultTicker = {
	amount: '0.0',
	last: '0.0',
	high: '0.0',
	open: '0.0',
	low: '0.0',
	price_change_percent: '+0.00%',
	volume: '0.0',
};
const displayMarket = 'usdt';
const sliceTo = 0;
const sliceFrom = 5;

export const UdonMarket = props => {
	useMarketsFetch();
	useMarketsTickersFetch();
	useRangerConnectFetch();
	const history = useHistory();
	const dispatch = useDispatch();
	const markets = useSelector(selectMarkets);
	const marketTickers = useSelector(selectMarketTickers);
	const currencies = useSelector(selectCurrencies);

	const handleRedirectToTrading = (id: string) => {
		const currentMarket: Market | undefined = markets.find(item => item.id === id);
		if (currentMarket) {
			props.handleChangeCurrentMarket && props.handleChangeCurrentMarket(currentMarket);
			dispatch(setCurrentMarket(currentMarket));
			history.push(`/trading/${currentMarket.id}`);
		}
	};

	const currentBidUnitMarkets = (props.markets || markets) as typeof markets;

	const findIcon = (code: string): string => {
		const currency = currencies.find((currency: any) => String(currency.id).toLowerCase() === code.toLowerCase());
		try {
			return require(`../../../node_modules/cryptocurrency-icons/128/color/${code.toLowerCase()}.png`);
		} catch (err) {
			if (currency) {
				return currency.icon_url;
			}

			return require('../../../node_modules/cryptocurrency-icons/svg/color/generic.svg');
		}
	};

	const formattedMarkets = currentBidUnitMarkets.length
		? currentBidUnitMarkets
				.filter(market => market.name.split('/')[1].toLowerCase().includes(displayMarket))
				.map(market => {
					return {
						...market,
						last: Decimal.format(Number((marketTickers[market.id] || defaultTicker).last), market.price_precision),
						open: Decimal.format(Number((marketTickers[market.id] || defaultTicker).open), market.price_precision),
						price_change_percent: String((marketTickers[market.id] || defaultTicker).price_change_percent),
						high: Decimal.format(Number((marketTickers[market.id] || defaultTicker).high), market.price_precision),
						low: Decimal.format(Number((marketTickers[market.id] || defaultTicker).low), market.price_precision),
						volume: Decimal.format(
							Number((marketTickers[market.id] || defaultTicker).volume),
							market.amount_precision,
						),
					};
				})
				.sort((a, b) => {
					return Number(b.last) - Number(a.last);
				})
				.slice(sliceTo, sliceFrom)
				.map(market => ({
					...market,
					change: Decimal.format((+market.last - +market.open).toFixed(market.price_precision), market.price_precision),
				}))
				.map(market => {
					const marketChangeColor = +(market.change || 0) < 0 ? '#E01E5A' : '#2FB67E';
					const marketName = market.name.split('/');
					const marketID = market.name.toUpperCase();
					const baseCurrency = marketID.split('/')[0];

					return {
						...market,
						name: (
							<div className="d-flex flex-row align-items-center">
								<img
									style={{ borderRadius: '50%' }}
									width="30px"
									height="30px"
									src={findIcon(baseCurrency)}
									alt="marketName"
								/>
								<span style={{ color: '#333333', marginLeft: 8 }}>{marketName[0]}</span>
							</div>
						),
						last: (
							<span style={{ color: marketChangeColor }}>
								{market.last}
								<p className="m-0" style={{ color: 'rgb(115 127 146)' }}>
									$ <ConvertUsd value={+market.last} symbol={marketName[1]} />
								</p>
							</span>
						),

						price_change_percent: <span style={{ color: marketChangeColor }}>{market.price_change_percent}</span>,
						trade: (
							<button onClick={() => handleRedirectToTrading(market.id)} className="udon-market__trading-btn">
								Trade
							</button>
						),
					};
				})
		: [];

	const Markets = () => {
		return (
			<div className="cx-market-item">
				<NewMarketTable columns={columns} data={formattedMarkets} />
			</div>
		);
	};

	const columns = React.useMemo(() => {
		return [
			{
				Header: 'Name',
				accessor: 'name',
			},
			{
				Header: 'Last Price',
				accessor: 'last',
			},
			{
				Header: '24h Change',
				accessor: 'price_change_percent',
			},
			{
				Header: 'Trade',
				accessor: 'trade',
			},
		];
	}, []);

	const redirectMarketList = () => {
		history.push('/markets');
	};
	return (
		<div id="new-marketList">
			<div className="container">
				<div className="row">
					<div className="col-12">
						<div>{Markets()}</div>
					</div>
				</div>
				<div className="row">
					<div className="col-lg-12 text-center">
						<button onClick={redirectMarketList} className="redirect-to-market__btn">
							More {'>>'}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
