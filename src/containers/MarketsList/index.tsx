import * as React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ConvertUsd, Decimal, MarketsHotOnlist, UdonMarketTable, ButtonFIAT, FiatMarketFill } from '../../components';

import Tabs, { TabPane } from 'rc-tabs';

import { useMarketsFetch, useMarketsTickersFetch, useRangerConnectFetch } from '../../hooks';
import { Market, selectMarkets, selectMarketTickers, setCurrentMarket } from '../../modules';

import classNames from 'classnames';
import { useIntl } from 'react-intl';

const defaultTicker = {
	amount: '0.0',
	last: '0.0',
	high: '0.0',
	open: '0.0',
	low: '0.0',
	price_change_percent: '+0.00%',
	volume: '0.0',
};

export const MarketsList = props => {
	const favoritemMarketsLocal = JSON.parse(localStorage.getItem('favourites_markets') || '[]');
	const [marketIdsLocalState, setMarketIdsLocalState] = React.useState<string[]>(favoritemMarketsLocal);
	const [searchMarketInputState, setSearchMarketInputState] = React.useState('');

	const [marketPair, setMarketPair] = React.useState('');
	const [activeButton, setActiveButton] = React.useState(0);
	const [nameMarketPair, setNameMarketPair] = React.useState('');

	const [activeFiat, setActiveFiat] = React.useState(0);

	useMarketsFetch();
	useMarketsTickersFetch();
	useRangerConnectFetch();
	const history = useHistory();
	const dispatch = useDispatch();
	const markets = useSelector(selectMarkets);
	const marketTickers = useSelector(selectMarketTickers);
	const intl = useIntl();

	const handleRedirectToTrading = (id: string) => {
		const currentMarket: Market | undefined = markets.find(item => item.id === id);
		if (currentMarket) {
			props.handleChangeCurrentMarket && props.handleChangeCurrentMarket(currentMarket);
			dispatch(setCurrentMarket(currentMarket));
			history.push(`/market/${currentMarket.id}`);
		}
	};

	const currentBidUnitMarkets = (props.markets || markets) as typeof markets;

	const clickFavoritesMarket = (id: string) => {
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

		const newLocal = localStorage.getItem('favourites_markets') || '[]';
		setMarketIdsLocalState(JSON.parse(newLocal));
	};

	const formattedMarkets = currentBidUnitMarkets.length
		? currentBidUnitMarkets

				.filter(market => market.base_unit.toLowerCase().includes(searchMarketInputState.toLowerCase()))
				.filter(market => market.quote_unit.includes(marketPair))
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
				.map(market => ({
					...market,
					change: Decimal.format((+market.last - +market.open).toFixed(market.price_precision), market.price_precision),
				}))

				.map(market => {
					const marketChangeColor = +(market.change || 0) < 0 ? '#E01E5A' : '#2FB67E';
					const marketName = market.name.split('/');
					const svgClass = classNames(marketIdsLocalState.includes(market.id) ? 'active_id' : '');
					return {
						...market,
						pair: (
							<div className="d-flex flex-row align-items-center">
								<svg
									onClick={() => clickFavoritesMarket(market.id)}
									width="20"
									height="20"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										className={svgClass}
										d="M10 14.3917L15.15 17.5L13.7834 11.6417L18.3334 7.69999L12.3417 7.19166L10 1.66666L7.65835 7.19166L1.66669 7.69999L6.21669 11.6417L4.85002 17.5L10 14.3917Z"
										fill="#848E9C"
									/>
								</svg>

								<span style={{ color: '#fff', marginLeft: 8 }}>{marketName[0]}</span>
								<span style={{ color: '#737f92' }}>/</span>
								<span style={{ color: '#737f92' }}>{marketName[1]}</span>
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
						open: <span style={{ color: marketChangeColor }}>{market.open}</span>,
						change: <span style={{ color: marketChangeColor }}>{market.change}</span>,
						volume: <span style={{ color: marketChangeColor }}>{market.volume}</span>,
						price_change_percent: <span style={{ color: marketChangeColor }}>{market.price_change_percent}</span>,
						trade: (
							<button onClick={() => handleRedirectToTrading(market.id)} className="cx-market__btn-trading">
								{intl.formatMessage({ id: 'page.marketsLists.table.body.trade' })}
							</button>
						),
					};
				})
		: [];
	const FavoriteMarkets = formattedMarkets.filter((e: any) => marketIdsLocalState.includes(e.id));

	const handldeSearchInputChange = (e: any) => {
		setSearchMarketInputState(e.target.value);
	};

	const renderFIATMarketElement = (): void | any => {
		if (nameMarketPair === 'FIAT') {
			const marketFIATs = [
				{
					name: 'BUSD',
					fill: 'busd',
				},
				{
					name: 'USDC',
					fill: 'usdc',
				},
				{
					name: 'TUSD',
					fill: 'tusd',
				},
			];

			return (
				<div className="row">
					<div className="col-md-12 d-flex align-items: baseline">
						{marketFIATs.map((marketFiat, index) => {
							return (
								<FiatMarketFill
									id={index}
									value={marketFiat.fill}
									marketFiat={marketFiat.name}
									setActiveFiat={setActiveFiat}
									setMarketPair={setMarketPair}
									active={activeFiat === index ? true : false}
								/>
							);
						})}
					</div>
				</div>
			);
		}
	};
	const renderALTSmarkets = () => {
		const marketFIATs = [
			{
				name: intl.formatMessage({ id: 'page.marketsLists.markets.all' }),
				fill: '',
			},
			{
				name: 'USDT',
				fill: 'usdt',
			},
			{
				name: 'BTC',
				fill: 'btc',
			},
			{
				name: 'ETH',
				fill: 'eth',
			},
			{
				name: 'BNB',
				fill: 'bnb',
			},
			{
				name: 'FIAT',
				fill: 'busd',
			},
		];

		return (
			<div className="row">
				<div className="col-md-12 pt-3">
					{marketFIATs.map((marketFiat, index) => {
						return (
							<ButtonFIAT
								id={index}
								value={marketFiat.fill}
								marketFiat={marketFiat.name}
								setActiveButton={setActiveButton}
								setMarketPair={setMarketPair}
								setNameMarketPair={setNameMarketPair}
								active={activeButton === index ? true : false}
							/>
						);
					})}
				</div>
			</div>
		);
	};
	const MarketsTabs = () => {
		return (
			<div className="cx-market-item">
				<Tabs defaultActiveKey="Spot Markets">
					<div className="market__pair">
						<div className="row d-flex align-item-center">
							<div className="col-md-9 ">{renderALTSmarkets()}</div>
							<div className="col-md-3">
								<div className="search-coin">
									<div className="search-coin__icon">
										<img alt="search" src={require('./icon/search.svg')} />
									</div>
									<input
										className="search-coin__input"
										type="text"
										placeholder={intl.formatMessage({ id: 'page.marketsLists.input.search.placeholder' })}
										onChange={handldeSearchInputChange}
									/>
								</div>
							</div>
						</div>
						<div className="market__pair__fiat">{renderFIATMarketElement()}</div>
					</div>
					<TabPane tab={intl.formatMessage({ id: 'page.marketsLists.tab.favorites' })} key="Favorites">
						<UdonMarketTable columns={columns} data={FavoriteMarkets} />
					</TabPane>
					<TabPane tab={intl.formatMessage({ id: 'page.marketsLists.tab.spotMarkets' })} key="Spot Markets">
						<UdonMarketTable columns={columns} data={formattedMarkets} />
					</TabPane>
				</Tabs>
			</div>
		);
	};

	const MarketsHotOnList = () => {
		return (
			<React.Fragment>
				<MarketsHotOnlist />
			</React.Fragment>
		);
	};

	const columns = React.useMemo(() => {
		return [
			{
				Header: intl.formatMessage({ id: 'page.marketsLists.table.header.pair' }),
				accessor: 'pair',
			},
			{
				Header: intl.formatMessage({ id: 'page.marketsLists.table.header.last' }),
				accessor: 'last',
			},
			{
				Header: intl.formatMessage({ id: 'page.marketsLists.table.header.change' }),
				accessor: 'price_change_percent',
			},
			{
				Header: intl.formatMessage({ id: 'page.marketsLists.table.header.high' }),
				accessor: 'high',
			},
			{
				Header: intl.formatMessage({ id: 'page.marketsLists.table.header.low' }),
				accessor: 'low',
			},
			{
				Header: intl.formatMessage({ id: 'page.marketsLists.table.header.volume' }),
				accessor: 'volume',
			},
			{
				Header: intl.formatMessage({ id: 'page.marketsLists.table.header.trade' }),
				accessor: 'trade',
			},
		];
	}, []);

	return (
		<div id="marketList">
			<div>{MarketsHotOnList()}</div>
			<div>{MarketsTabs()}</div>
		</div>
	);
};

export const MarketsTableScreen = React.memo(MarketsList);
